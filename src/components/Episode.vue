<template>
  <div :class="['Episode', { active, selected }]">
    <div class="wrapper">
      <div class="cover">
        <img class="size"
          src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        />
        <img
          class="image"
          :src="song.cover_art_url"
          @click="onCoverClick"
        />
      </div>
      <div
        v-if="isNew"
        class="new"
      >
        NEW!
      </div>
      <!-- <Favorite
        v-if="!active"
        class="favorite"
        :id="song.id"
      /> -->
      <div class="meta colored bg">
        <h2 class="title colored color">{{ song.name }}</h2>
        <h3 class="artist">{{ song.artist }}</h3>
        <div class="date-duration-wrapper">
          <h4 class="date">
            {{ pubDateStr }}
          </h4>
        </div>
        <div class="tags">
          <button
            v-for="genre in song.genres"
            :key="genre"
            class="tag"
          >
            {{ genre }}
          </button>
        </div>
      </div>
      <div
        v-if="active"
        class="player"
      >
        <div class="controls">
          <button
            :class="['play', { playing }]"
            @click="playPause"
          >
            <svg
              v-if="!playing"
              class="icon colored fill"
              viewBox="0 0 60 60"
            >
              <path d="M18.2874 47.335V12.6651L44.5939 29.9493L18.2874 47.335Z"/>
            </svg>
            <svg
              v-else
              class="icon colored fill"
              viewBox="0 0 60 60"
            >
              <path d="M26.6002 12.4242H16.4615V47.5758H26.6002V12.4242Z"/>
              <path d="M43.5385 12.4242H33.3998V47.5758H43.5385V12.4242Z"/>
            </svg>
          </button>
          <!-- <Favorite
            v-if="active"
            is-main
            class="favorite-button"
            :id="song.id"
          /> -->
          <div class="spacer"/>
          <Volume/>
          <Download :url="song.url" class="download" />
        </div>
        <div class="progress">
          <progress
            class="buffered amplitude-buffered-progress"
            value="0"
          />
          <progress
            class="played colored progress-bg amplitude-song-played-progress"
            @click="seek"
          />
          <div class="time">
            <div class="current amplitude-current-time" />
            <div class="remaining amplitude-time-remaining" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Amplitude from "amplitudejs"
import { mapState, mapActions } from 'vuex'
import Volume from './Volume'
import Download from './Download'
// import Favorite from './Favorite'

export default {
  name: "Episode",

  components: { Volume, Download },

  props: {
    song: {
      type: Object,
      default: () => ({})
    },

    active: Boolean,
    isNew: Boolean,
    selected: Boolean,
    playing: Boolean
  },

  computed: {
    ...mapState(['played']),

    pubDate () {
      return new Date(this.song.pubDate)
    },

    pubDateStr () {
      const padZero = input => input.toString().padStart(2, '0')

      const date = this.pubDate
      const year = date.getFullYear()
      const month = padZero(date.getMonth() + 1)
      const day = padZero(date.getDate())

      return `${day}.${month}.${year}`
    }
  },

  methods: {
    ...mapActions(['set']),

    storePlayed () {
      let played = this.played

      if (!this.played.includes(this.song.id)) {
        played.push(this.song.id)
      }

      this.set({ key: 'played', value: played })
    },

    onCoverClick () {
      if (!this.active) {
        this.$emit('select')
      }

      this.storePlayed()
    },

    playPause () {
      this.$emit('playPause')
      this.storePlayed()
    },

    seek(event) {
      const element = event.target;
      const offset = element.getBoundingClientRect();
      const x = event.pageX - offset.left;
      const percentage =
        (parseFloat(x) / parseFloat(element.offsetWidth)) * 100;

      Amplitude.setSongPlayedPercentage(percentage);
    }
  }
};
</script>

<style lang="postcss" scoped>
.Episode {
  position: relative;
  overflow: hidden;
  perspective: 500px;

  &:before {
    content: "";
    display: block;
    padding-top: 0%;
  }

  &:not(.active) {
    width: 25vh;
    height: 25vh;
    cursor: pointer;

    @media screen and (max-width: 75vh) {
      width: 50vw;
      height: 50vw;
    }

    .wrapper.flip {
      transform-style: preserve-3d;
      transition: transform 1s;
      backface-visibility: hidden;

      &:hover {
        transform: rotateY(180deg);
        transition: transform 0.5s;
      }
    }
  }

  &.active {
    position: relative;
    width: 100%;
    /* Safari compute svh weirdly... */
    max-width: calc(75vh - 2px);
    display: flex;
    flex-direction: column;
  }

  &:not(.selected) .meta {
    background-color: rgba(0,0,0, .9);
  }
}

/* New */
.new {
  position: absolute;
  top: 0;
  left: 0;
  padding: .5vh 2.5vh;
  font-size: 2.25vh;
  font-weight: 700;
  color: rgba(0,0,0, .85);
  background-color: yellow;
  z-index: 2;

  .selected & {
    display: none;
  }
}

/* Favorite + Download */
.download,
.favorite-button {
  margin-right: 2vh;
}

.favorite {
  position: absolute;
  top: 0;
  right: 0;
  margin: 1.5vh;
}

/* Cover */
.cover,
.size,
.image {
  display: block;
  width: 100%;
  height: 100%;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
}

/* Meta */
.meta {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: none;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  justify-content: flex-end;
  padding: 1.75vh;
  color: rgba(255,255,255, .75);

  .selected & {
    display: flex;
  }

  .title,
  .artist {
    margin: 0;
    padding: 0;
    text-transform: uppercase;
    line-height: 1.1;
  }

  .title {
    font-size: 2.5vh;
    font-weight: 200;
    opacity: 1;

    .selected & {
      color: rgb(0,0,0);
    }
  }

  .artist {
    font-size: 2vh;
    margin: 1vh 0 1.5vh;
  }

  .date-duration-wrapper {
    display: flex;
    align-items: center;

    & > * {
      margin: .5rem 0 0 .5rem;
      display: flex;
      align-items: center;
      font-size: 2vh;
      line-height: 1;
      font-weight: 200;
      color: rgba(255,255,255, 1);
      text-shadow: 0 1px rgba(0,0,0, .5);

      .selected & {
        color: rgba(0,0,0, .5);
      }
    }
  }
}

/* Player */
.player {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
}

/* Controls */
.controls {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0,0,0, .35);
}

.play {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8vh;
  height: 8vh;
  padding: 0;
  border: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  .icon  {
    width: 100%;
    height: 100%;
  }
}

/* Progress */
.progress {
  position: relative;
  height: 2rem;
  background-color: rgba(0, 0, 0, .4);
}

.buffered,
.played {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  background-color: transparent;

  &::-webkit-progress-bar {
    background-color: transparent;
  }
}

.buffered {
  background-color: transparent;

  &::-webkit-progress-value {
    background-color: rgba(0, 0, 0, .5);
  }

  &::-moz-progress-bar {
    background-color: rgba(0, 0, 0, .5);
  }
}

.played {
  cursor: pointer;

  &::-webkit-progress-value {
    mix-blend-mode: lighten;
    opacity: .85;
  }

  &::-moz-progress-bar {
    mix-blend-mode: lighten;
    opacity: .85;
  }
}

/* Time */
.time {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 .5rem .125rem;
  font-size: 1rem;
  font-weight: 400;
  color: rgb(255, 255, 255);
  mix-blend-mode: luminosity;
  pointer-events: none;

  .current {
    font-weight: 700;
  }

  .remaining:before {
    content: "-";
  }
}
</style>