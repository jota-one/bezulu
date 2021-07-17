# Ple

## Podcast
Source is a json config file:

```json
{
    "mediaRoot": "./media",
    "coversRoot": "./public/covers",
    "appRoot": "./public",
    "mediaBaseUrl": "https://media.lionites.com/bezulu/",
    "appBaseUrl": "https://bezu.lu",
    "appBasePath": "/",
    "feedFile": "./public/feed.xml",
    "feed": {
        ...
        "items": [
            ...
        ]
    }
}
```

- The order of the config's `items` array prevails in the web app.
- The order of the podcast XML feed is defined by the `date` field.
- To skip an item in the webapp but keep it in the podcast, simply don't set the `id` property.
- Webapp currently doe not support videos.
- Fields in the `items` list are merged with metadata of the media files.
- Mandatory fields for each item in `items` array are: `file`, `date`
- Item `id` field must be unique (TODO: implement in podcast script...)

Possible fields for each item in `items` array:
- title (to overwrite media file's title)
- trackTitle (displays in webapp whereas title taken from media file displays in feed. If not provided, falls back to media file's title)
- artist
- preventDownload (media files are downladable per default)
- guid (to overwrite generated guid, which is `appBaseUrl`/`id`)
- file
- date (format: yyyy-MM-dd, with time info yyyy-MM-dd hh:mm:ss)
- genres
- description (overwrites media file's comment)
- duration (overwrites media file's generated duration, cf. needed for video files currently)
- explicit => (not yet implemented)
- author (TODO: implement author overwrite with config for videos)