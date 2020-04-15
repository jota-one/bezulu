<template>
  <div id="app">
    <div class="heading">
      <h1 class="h1 colored color">
        <span class="bold">
          Be
        </span>
        <span class="bold">
          Zulu!
        </span>
        <span>
          Podcast
        </span>
      </h1>
      <div class="count-new" v-if="newEpisodes.length">
        {{ newEpisodes.length }}
        <span class="text">
          new
        </span>
      </div>
    </div>
    <div class="info">
      <a
        class="podcast colored color"
        :href="podcastURI"
        target="_blank"
      >
        <svg
          class="podcast-icon colored fill"
          viewBox="0 0 24 24">
          <path
            d="M17,18.25V21.5H7V18.25C7,16.87 9.24,15.75 12,15.75C14.76,15.75 17,16.87 17,18.25M12,5.5A6.5,6.5 0 0,1 18.5,12C18.5,13.25 18.15,14.42 17.54,15.41L16,14.04C16.32,13.43 16.5,12.73 16.5,12C16.5,9.5 14.5,7.5 12,7.5C9.5,7.5 7.5,9.5 7.5,12C7.5,12.73 7.68,13.43 8,14.04L6.46,15.41C5.85,14.42 5.5,13.25 5.5,12A6.5,6.5 0 0,1 12,5.5M12,1.5A10.5,10.5 0 0,1 22.5,12C22.5,14.28 21.77,16.39 20.54,18.11L19.04,16.76C19.96,15.4 20.5,13.76 20.5,12A8.5,8.5 0 0,0 12,3.5A8.5,8.5 0 0,0 3.5,12C3.5,13.76 4.04,15.4 4.96,16.76L3.46,18.11C2.23,16.39 1.5,14.28 1.5,12A10.5,10.5 0 0,1 12,1.5M12,9.5A2.5,2.5 0 0,1 14.5,12A2.5,2.5 0 0,1 12,14.5A2.5,2.5 0 0,1 9.5,12A2.5,2.5 0 0,1 12,9.5Z"
          />
        </svg>
        Subscribe!
      </a>
    </div>
    <div class="filters">
      <select v-model="selectedArtist" class="filter colored bg">
        <option value="">
          All artists
        </option>
        <option
          v-for="artist in artists"
          :key="artist"
          :value="artist"
        >
          {{ artist }}
        </option>
      </select>
      <select v-model="selectedGenre" class="filter colored bg">
        <option value="">
          All genres
        </option>
        <option
          v-for="genre in genres"
          :key="genre"
          :value="genre"
        >
          {{ genre }}
        </option>
      </select>
    </div>
    <div class="grid">
      <Episode
        active
        ref="player"
        :song="episodes[selected]"
        :index="selected"
        :is-new="newEpisodes.some(e => e.id === episodes[selected].id)"
        :playing="playing"
        @playPause="onPlayPause" />
      <Episode
        v-for="episode in filteredEpisodes"
        :key="episode.index"
        :song="episode"
        :index="episode.index"
        :is-new="newEpisodes.some(e => e.id === episode.id)"
        :selected="selected === episode.index"
        :class="{ hidden: episode.hidden }"
        @select="select(episode)" />
      <div style="clear:left"/>
    </div>
    <About />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Amplitude from 'amplitudejs'
import Episode from '@/components/Episode'
import About from '@/components/About'
import podcast from '../www/podcast.json'
import config from '../config.json'

const cleanEmptyObject = input => {
  if (typeof input === 'object' && !Object.keys(input).length) {
    return ''
  }

  return input
}

const IS_NEW_TIMERANGE = 2505600000 // 1 month

export default {
  name: 'App',

  components: { Episode, About },

  data: () => ({
    playing: false,
    selected: 0,
    selectedGenre: '',
    selectedArtist: '',
    podcastURI: config.podcastURI,
    episodes: podcast.rss.channel.item
      .filter(episode => !episode.enclosure.type.includes('video'))
      .map((episode, index) => ({
        index,
        id: episode['jota:id'],
        name: cleanEmptyObject(episode['jota:name']),
        artist: cleanEmptyObject(episode['jota:artists']),
        artists: cleanEmptyObject(episode['jota:artists'])
          .split(',').map(artist => artist.trim()),
        genres: cleanEmptyObject(episode['jota:genres'])
          .split(',').map(genre => genre.trim()),
        pubDate: episode.pubDate,
        duration: episode['itunes:duration'],
        url: episode.enclosure.url,
        cover_art_url: cleanEmptyObject(episode['jota:image'])
      }))
  }),

  computed: {
    ...mapState(['played']),

    filteredEpisodes () {
      return this.episodes
        .map((episode, i) => {
          episode.hidden = (
            this.selectedArtist &&
            !episode.artists.includes(this.selectedArtist)
           ) || (
            this.selectedGenre &&
            !episode.genres.includes(this.selectedGenre)
          )

          if (i === this.selected) {
            episode.hidden = false
          }

          return episode
        })
    },

    artists () {
      const artists = this.episodes.reduce((allArtists, { artists }) => {
        artists.forEach(artist => {
          if (!allArtists.includes(artist)) {
            allArtists.push(artist)
          }
        })
        return allArtists
      }, [])

      artists.sort()
      return artists
    },

    genres () {
      const genres = this.episodes.reduce((allGenres, { genres }) => {
        genres.forEach(genre => {
          if (!allGenres.includes(genre)) {
            allGenres.push(genre)
          }
        })
        return allGenres
      }, [])

      genres.sort()
      return genres
    },

    newEpisodes () {
      return this.episodes.filter(episode => {
        const newlyPublished =
        Date.now() - (new Date(episode.pubDate)).getTime() < IS_NEW_TIMERANGE

        return newlyPublished && !this.played.includes(episode.id)
      })
    }
  },

  mounted () {
    Amplitude.init({
      songs: this.episodes,
      callbacks: {
        next: () => {
          this.selected++
          this.select(this.episodes[this.selected])
        }
      }
    })

    const episodeId = this.$route.params.episodeId

    this.selected = episodeId
      ? this.episodes.find(episode => episode.id === episodeId).index
      : 0
  },

  methods: {
    ...mapActions(['set']),

    storePlayed () {
      let played = this.played

      const activeEpisode = this.episodes[this.selected]

      if (!this.played.includes(activeEpisode.id)) {
        played.push(activeEpisode.id)
      }

      this.set({ key: 'played', value: played })
    },

    select (episode) {
      this.selected = episode.index

      Amplitude.playSongAtIndex(this.selected)

      this.playing = true
      this.$router.push({ name: 'player', params: { episodeId: episode.id }})
      this.updatePageTitle()
      this.storePlayed()
    },

    onPlayPause () {
      const isPlaying = Amplitude.getPlayerState() === 'playing'

      if (isPlaying) {
        Amplitude.pause()
      } else if (Amplitude.getSongPlayedPercentage() > 0) {
        Amplitude.play()
      } else {
        Amplitude.playSongAtIndex(this.selected)
      }

      this.playing = !this.playing
      this.updatePageTitle()
      this.storePlayed()
    },

    updatePageTitle () {
      const title = document.getElementsByTagName('title')[0]
      const episode = this.episodes[this.selected]

      title.innerText = `${episode.artist}: ${episode.name}`
    }
  }
}
</script>

<style lang="postcss">
@import url('https://fonts.googleapis.com/css?family=Oswald:200,400,700&display=swap');

@keyframes podcast {
  0%   { width: 4.5vh; height: 4.5vh  }
  50%  { width: 5vh; height: 5vh }
  100% { width: 4.5vh; height: 4.5vh  }
}

* {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: Oswald, sans-serif;
  font-size: 13px;
  font-weight: 200;
  background-color: rgb(10,10,10);
}

.spacer {
  flex: 1;
}

.hidden {
  display: none;
}

.tag {
  margin: 1.2vh 0 0 .5vh;
  padding: .5vh .8vh;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: Oswald, sans-serif;
  font-size: 1.5vh;
  font-weight: 400;
  text-transform: uppercase;
  color: rgba(200,200,200, 1);
  background: transparent;
  border: 2px solid rgba(180,180,180, .5);
  border-radius: .8vh;
  outline: none;
  mix-blend-mode: screen;
  user-select: none;
}

#app {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0 auto;

  @media screen and (min-width: 75vh) {
    max-width: 75vh;
  }

  @media screen and (min-width: 100vh) {
    max-width: 100vh;
  }

  @media screen and (min-width: 125vh) {
    max-width: 125vh;
  }

  @media screen and (min-width: 150vh) {
    max-width: 150vh;
  }
}

/* Heading */
.heading,
.info,
.filters {
  position: fixed;
  top: 4vh;
  z-index: 3;
}

.heading,
.info {
  left: 4vh;

  @media screen and (min-width: 75vh) {
    left: calc(50vw - 33vh);
  }

  @media screen and (min-width: 100vh) {
    left: calc(50vw - 46vh);
  }

  @media screen and (min-width: 125vh) {
    left: calc(50vw - 58.25vh);
  }

  @media screen and (min-width: 150vh) {
    left: calc(50vw - 70.75vh);
  }
}

.heading {
  text-shadow: 0 0 1px rgb(0,0,0);
}

.info {
  padding-top: 18.5vh;
}

.filters {
  right: 4vh;

  @media screen and (min-width: 75vh) {
    right: calc(50vw - 33.5vh);
  }

  @media screen and (min-width: 100vh) {
    right: calc(50vw - 20.5vh);
  }

  @media screen and (min-width: 125vh) {
    right: calc(50vw - 8vh);
  }

  @media screen and (min-width: 150vh) {
    right: calc(50vw + 3vh);
  }
}

.h1 {
  margin: 0;
  padding: 0;
  transform: skew(0, -13deg);
  font-size: 5vh;
  line-height: 1;
  font-weight: 200;
  text-transform: uppercase;
  pointer-events: none;

  .bold {
    display: block;
    font-size: 120%;
    font-weight: 700;
  }
}

.count-new {
  position: absolute;
  top: 0;
  left: 8vh;
  display: inline-flex;
  transform: skew(0, -13deg);
  padding: 1.5vh 1.25vh;
  font-weight: 700;
  font-size: 3vh;
  line-height: 1.5vh;
  color: rgba(0,0,0, .85);
  background-color: yellow;
  border-radius: 2vh;
  box-shadow: 0 0 2vh rgba(0,0,0, .25);

  .text {
    margin: -.25rem 0 0 .5vh;
    font-size: 1.75vh;
    line-height: 2vh;
    font-weight: 400;
    text-transform: uppercase;
  }
}

.podcast {
  display: flex;
  align-items: center;
  font-size: 2.5vh;
  line-height: 2vh;
  text-transform: uppercase;
  text-decoration: none;
  transform: skew(0, -13deg) scaleY(1.1);
  opacity: .85;
}

.podcast-icon {
  margin-right: 1vh;
  width: 4.5vh;
  height: 4.5vh;
}

.filter {
  -webkit-appearance: none;
  appearance: none;
  margin-left: 1vh;
  padding: 1vh 1.2vh;
  border: none;
  font-family: Oswald, sans-serif;
  font-size: 1.85vh;
  font-weight: 400;
  line-height: 1.7vh;
  text-transform: uppercase;

  option {
    font-family: Oswald, sans-serif;
  }
}

/* Grid */
.grid {
  & > * {
    float: left;
  }
}
</style>
