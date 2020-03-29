const path = require('path')
const fs = require('fs-extra')
const parser = require('xml2json')
const config = require('./config.json')
const root = 'www'
const src = 'podcast.xml'
const dst = 'podcast.json'

const transform = async (root, src, dst) => {
  const xml = await fs.readFile(path.resolve(path.join(root, src)), 'utf8')
  let json = JSON.parse(parser.toJson(xml))
  let ids = []

  json.rss.channel.item = json.rss.channel.item.map(item => {
    if (ids.includes(item['jota:id'])) {
      throw new Error(`ID ${item['jota:id']} already exists`)
    }

    ids.push(item['jota:id'])

    return {
      ...item,
      ...{ 'jota:image': item['jota:image'].replace(config.rootURI, '') }
    }
  })

  await fs.writeFile(
    path.resolve(path.join(root, dst)),
    JSON.stringify(json),
    'utf8'
  )
}

transform(root, src, dst)
