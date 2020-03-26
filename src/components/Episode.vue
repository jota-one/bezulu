<template>
  <div :class="['Episode', { active, selected }]">
    <img
      class="cover"
      :src="song.cover_art_url"
      @click="onCoverClick"
    />
    <div class="meta colored bg">
      <h2 class="title colored color">{{ song.name }}</h2>
      <h3 class="artist">{{ song.artist }}</h3>
      <div class="date-duration-wrapper">
        <h4 class="date">
          <svg viewBox="0 0 24 24">
            <path d="M5,4V6H19V4H5M5,14H9V20H15V14H19L12,7L5,14Z" />
          </svg>
          {{ pubDate }}
        </h4>
        <h4 class="duration">
          <svg viewBox="0 0 24 24">
            <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.24,7.76C15.07,6.58 13.53,6 12,6V12L7.76,16.24C10.1,18.58 13.9,18.58 16.24,16.24C18.59,13.9 18.59,10.1 16.24,7.76Z" />
          </svg>
          {{ song.duration }}
        </h4>
      </div>
      <div class="tags">
        <span
          v-for="genre in song.genres"
          :key="genre"
          class="tag"
        >
          {{ genre }}
        </span>
      </div>
    </div>
    <div
      v-if="active"
      class="player"
    >
      <div class="controls">
        <button
          :class="['play', 'colored', 'fill', { playing }]"
          @click="playPause"
        />
        <div class="spacer"/>
        <Volume/>
        <Download />
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
</template>

<script>
import Amplitude from "amplitudejs";
import Volume from './Volume'
import Download from './Download'

export default {
  name: "Episode",

  components: { Volume, Download },

  props: {
    song: {
      type: Object,
      default: () => ({})
    },

    active: Boolean,
    selected: Boolean,
    playing: Boolean
  },

  computed: {
    pubDate () {
      const padZero = input => input.toString().padStart(2, '0')

      const date = new Date(this.song.pubDate)
      const year = date.getFullYear()
      const month = padZero(date.getMonth() + 1)
      const day = padZero(date.getDate())

      return `${day}.${month}.${year}`
    }
  },

  methods: {
    onCoverClick () {
      Amplitude.playSongAtIndex(this.song.index)
      this.$emit('select')
    },

    playPause () {
      Amplitude.getPlayerState() === 'playing'
        ? Amplitude.pause()
        : Amplitude.play()

      this.$emit('playPause')
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
  }

  &.active {
    position: relative;
    width: 100%;
    max-width: 75vh;
    display: flex;
    flex-direction: column;
  }

  &:not(.selected) .meta {
    background-color: rgba(0,0,0, .9);
  }
}

/* New */

/* Cover */
.cover {
  width: 100%;
  height: 100%;
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
  padding: 2.5vh;
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
      font-size: 1.7vh;
      line-height: 1;
      font-weight: 400;
      color: rgba(255,255,255, .35);

      .selected & {
        color: rgba(0,0,0, .5);
      }

      svg {
        margin-right: .25vh;
        height: 1.65vh;
        width: 1.65vh;
        fill: rgba(255,255,255, .75);

        .selected & {
          fill: rgb(0,0,0);
        }
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
  cursor: pointer;
  background-color: transparent;
  -webkit-tap-highlight-color: transparent;

  &:not(.playing):before {
    content: "";
    display: block;
    width: 0;
    height: 0;
    margin-left: 0.5vh;
    border-top: 2vh solid transparent;
    border-bottom: 2vh solid transparent;
    border-left: 3vh solid rgba(255,53,127, .85);
  }

  &.playing {
    &:before,
    &:after {
      content: "";
      display: block;
      width: 1.25vh;
      height: 4vh;
      background-color: rgba(255,53,127, .85);
    }

    &:before {
      margin-right: 0.75vh;
    }
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
  appearance: none;

  &::-webkit-progress-bar {
    background-color: transparent;
  }
}

.buffered {
  &::-webkit-progress-value {
    background-color: rgba(0, 0, 0, .5);
  }
}

.played {
  cursor: pointer;

  &::-webkit-progress-value {
    mix-blend-mode: lighten;
    opacity: .75;
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

  .remaining:before {
    content: "-";
  }
}
</style>