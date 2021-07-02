const fs = require('fs-extra')
const path = require('path')
const mm = require('music-metadata')
const Walk = require('@root/walk')
const Podcast = require('podcast')

const configPath = path.resolve(process.cwd(), process.argv[2])

if (!fs.pathExistsSync(configPath)) {
    throw new Error(`Config file ${configPath} not found!`)
}

const config = require(configPath)
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
            author: metadata.common.artist,
            cover,
            description: metadata.common.comment,
            duration: metadata.format.duration,
            genre: metadata.common.genre, 
            title: metadata.common.title,
            year: metadata.common.year
        }
    } catch(e) {}
}

const processMedias = async ({ root, coversRoot }) => {
    const medias = {}

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

                const media = { ...metadata,  coverPath }
                media.file = path
                delete media.cover

                medias[path.replace(root, '')] = media
            }
        }
    })

    return medias
}

const throwError = (msg, episode) => {
    throw new Error(`${msg} in episode ${JSON.stringify(episode)}`)
}

const run = async ({
    feed,
    mediaRoot,
    coversRoot,
    appRoot,
    mediaBaseUrl,
    appBaseUrl,
    appBasePath,
    feedFile
}) => {
    const json = { basePath: appBasePath, items: [] }
    const podcast = new Podcast(feed.settings)
    const medias = await processMedias({ root: mediaRoot, coversRoot })

    feed.episodes.forEach((episode, index) => {
        if (!episode.id) throwError('"id" property missing', episode)
        if (!episode.date) throwError('"date" property missing', episode)

        const item = medias[episode.file]

        if (!item) {
            throwError(`Media file "${path.join(mediaRoot, episode.file)}" not found`, episode)
        }

        podcast.addItem({
            ...item,
            ...episode,
            enclosure: {
                url: mediaBaseUrl.replace(/\/$/, '') + episode.file,
                file: item.file
            },
            itunesDuration: item.duration,
            url: `${appBaseUrl.replace(/\/$/, '')}/${episode.id}`,
        })

        json.items.push({
            artist: episode.artist || item.author,
            album: feed.settings.title,
            audioUrl: mediaBaseUrl.replace(/\/$/, '') + episode.file,
            coverUrl: path.resolve(coversRoot + item.coverPath)
                .replace(path.resolve(appRoot), ''),
            dates: {
                added: episode.date,
                updated: episode.date
            },
            duration: item.duration,
            genres: episode.genres || item.genre,
            id: episode.id,
            title: episode.trackTitle || item.title
        })
    })

    await fs.writeFile(feedFile, podcast.buildXml('\t'), 'utf8')

    await fs.writeFile(
        feedFile.replace('.xml', '.json'),
        JSON.stringify(json),
        'utf8'
    )
}

run({
    ...config,
    mediaRoot: path.join(ROOT, config.mediaRoot),
    coversRoot: path.join(ROOT, config.coversRoot),
    feedFile: path.join(ROOT, config.feedFile)
})
