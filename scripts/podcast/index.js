const fs = require('fs-extra')
const path = require('path')
const mm = require('music-metadata')
const Walk = require('@root/walk')
const Podcast = require('podcast')
const config = require('../../config.json')

const ROOT = path.resolve('.')

const writeCover = async ({ root, sourceFile, format, data }) => {
    if (!fs.pathExistsSync(root)) {
        await fs.mkdirp(root)
    }

    const fileName = sourceFile
        .substr(0, sourceFile.lastIndexOf('.')) + '.' + format.replace('image/', '')
    
    const coverPath = path.join(root, fileName)
    
    await fs.writeFile(coverPath, data, 'utf8')
    return fileName
}

const getMetaData = async fileName => {
    try {
        const metadata = await mm.parseFile(fileName)
        const cover = mm.selectCover(metadata.common.picture)
        return {
            cover,
            artist: metadata.common.artist,
            title: metadata.common.title,
            year: metadata.common.year,
            duration: metadata.format.duration,
            comment: metadata.common.comment
        }
    } catch(e) {}
}

const processEpisodes = async ({ root, coversRoot }) => {
    const episodes = []

    await Walk.walk(root, async (err, path) => {
        if (err) {
            console.warn('fs stat error for %s: %s', path, err.message)
            return Promise.resolve()
        }

        if (!path.startsWith(coversRoot)) {
            const metadata = await getMetaData(path)
        
            let coverPath = undefined

            if (metadata) {
                
                if (metadata.cover) {
                    coverPath = await writeCover({
                        ...metadata.cover,
                        root: coversRoot,
                        sourceFile: path.replace(root, '')
                    })
                }

                const episode = { ...metadata,  coverPath }
                delete episode.cover

                episodes.push(episode)
            }
        }
    })

    return episodes
}

const run = async ({ settings, mediaRoot, coversRoot, feedFile }) => {
    const feed = new Podcast(settings)
    const episodes = await processEpisodes({ root: mediaRoot, coversRoot })
    
    for (const episode of episodes) {
        feed.addItem(episode)
    }

    await fs.writeFile(feedFile, feed.buildXml('\t'), 'utf8')

    await fs.writeFile(
        feedFile.replace('.xml', '.json'),
        JSON.stringify({
            ...feed,
            items: feed.items.map((episode, i) => ({
                id: i,
                artist: '',
                title: episode.title,
                coverUrl: coversRoot.replace(ROOT, '') + episodes[i].coverPath
            }))
        }),
        'utf8'
    )
}

run({
    settings: config.feed.settings,
    mediaRoot: path.join(ROOT, config.media_root),
    coversRoot: path.join(ROOT, config.covers_root),
    feedFile: path.join(ROOT, config.feed_file)
})
