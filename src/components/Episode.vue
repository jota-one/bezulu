<template>
  <div :class="['Episode', { active, selected }]">
    <img
      class="cover"
      :src="song.cover_art_url"
      @click="onCoverClick"
    />
    <div class="meta">
      <h2>{{ song.name }}</h2>
      <h3>{{ song.artist }}</h3>
    </div>
    <div
      v-if="active"
      class="player"
    >
      <div class="controls">
        <button
          :class="['play', { playing }]"
          @click="playPause"
        />
        <input
          type="range"
          class="volume amplitude-volume-slider"
        />
      </div>
      <div class="progress">
        <progress
          class="buffered amplitude-buffered-progress"
          value="0"
        />
        <progress
          class="played amplitude-song-played-progress"
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

export default {
  name: "Episode",

  props: {
    song: {
      type: Object,
      default: () => ({})
    },

    active: Boolean,
    selected: Boolean,
    playing: Boolean
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
  padding: 2rem;
  color: rgba(255,255,255, .75);
  background-color: rgba(0,0,0, .95);

  .selected & {
    display: flex;
  }

  h2, h3 {
    margin: 0;
    padding: 0;
    text-transform: uppercase;
    line-height: 1.1;
  }

  h2 {
    order: 2;
    font-size: 2.2rem;
    font-weight: 200;
    opacity: .75;
  }

  h3 {
    order: 1;
    font-size: 1.5rem;
    margin-bottom: .5rem;
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
    border-left: 3vh solid rgba(255,53,127,1);
    mix-blend-mode: screen;
  }

  &.playing {
    &:before,
    &:after {
      content: "";
      display: block;
      width: 1.25vh;
      height: 4vh;
      background-color: rgb(200,200,200);
      mix-blend-mode: screen;
    }

    &:before {
      margin-right: 0.75vh;
    }
  }
}

.volume {
  -webkit-appearance: none;
  -moz-appearance: none;
  margin: 0 3vh;

  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    background: rgba(59,173,227,1);
    background: -moz-linear-gradient(45deg, rgba(59,173,227,1) 0%, rgba(87,111,230,1) 25%, rgba(152,68,183,1) 51%, rgba(255,53,127,1) 100%);
    background: -webkit-gradient(left bottom, right top, color-stop(0%, rgba(59,173,227,1)), color-stop(25%, rgba(87,111,230,1)), color-stop(51%, rgba(152,68,183,1)), color-stop(100%, rgba(255,53,127,1)));
    background: -webkit-linear-gradient(45deg, rgba(59,173,227,1) 0%, rgba(87,111,230,1) 25%, rgba(152,68,183,1) 51%, rgba(255,53,127,1) 100%);
    background: -o-linear-gradient(45deg, rgba(59,173,227,1) 0%, rgba(87,111,230,1) 25%, rgba(152,68,183,1) 51%, rgba(255,53,127,1) 100%);
    background: -ms-linear-gradient(45deg, rgba(59,173,227,1) 0%, rgba(87,111,230,1) 25%, rgba(152,68,183,1) 51%, rgba(255,53,127,1) 100%);
    background: linear-gradient(45deg, rgba(59,173,227,1) 0%, rgba(87,111,230,1) 25%, rgba(152,68,183,1) 51%, rgba(255,53,127,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3bade3 ', endColorstr='#ff357f ', GradientType=1 );
    height: 2px;
  }

  &:focus {
    outline: none;
  }

  &::-moz-range-track {
    -moz-appearance: none;
    background: rgba(59,173,227,1);
    background: -moz-linear-gradient(45deg, rgba(59,173,227,1) 0%, rgba(87,111,230,1) 25%, rgba(152,68,183,1) 51%, rgba(255,53,127,1) 100%);
    background: -webkit-gradient(left bottom, right top, color-stop(0%, rgba(59,173,227,1)), color-stop(25%, rgba(87,111,230,1)), color-stop(51%, rgba(152,68,183,1)), color-stop(100%, rgba(255,53,127,1)));
    background: -webkit-linear-gradient(45deg, rgba(59,173,227,1) 0%, rgba(87,111,230,1) 25%, rgba(152,68,183,1) 51%, rgba(255,53,127,1) 100%);
    background: -o-linear-gradient(45deg, rgba(59,173,227,1) 0%, rgba(87,111,230,1) 25%, rgba(152,68,183,1) 51%, rgba(255,53,127,1) 100%);
    background: -ms-linear-gradient(45deg, rgba(59,173,227,1) 0%, rgba(87,111,230,1) 25%, rgba(152,68,183,1) 51%, rgba(255,53,127,1) 100%);
    background: linear-gradient(45deg, rgba(59,173,227,1) 0%, rgba(87,111,230,1) 25%, rgba(152,68,183,1) 51%, rgba(255,53,127,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3bade3 ', endColorstr='#ff357f ', GradientType=1 );
    height: 2px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 2px solid;
    border-radius: 50%;
    height: 25px;
    width: 25px;
    max-width: 80px;
    position: relative;
    bottom: 11px;
    background-color: #1d1c25;
    cursor: -webkit-grab;
    -webkit-transition: border 1000ms ease;
    transition: border 1000ms ease;
  }

  &::-moz-range-thumb {
    -moz-appearance: none;
    border: 2px solid;
    border-radius: 50%;
    height: 25px;
    width: 25px;
    max-width: 80px;
    position: relative;
    bottom: 11px;
    background-color: #1d1c25;
    cursor: -moz-grab;
    -moz-transition: border 1000ms ease;
    transition: border 1000ms ease;
  }
}



/* .range.blue::-webkit-slider-thumb {
   border-color: rgb(59,173,227);
}

.range.ltpurple::-webkit-slider-thumb {
   border-color: rgb(87,111,230);
}

.range.purple::-webkit-slider-thumb {
   border-color: rgb(152,68,183);
}

.range.pink::-webkit-slider-thumb {
   border-color: rgb(255,53,127);
}

.range.blue::-moz-range-thumb {
   border-color: rgb(59,173,227);
}

.range.ltpurple::-moz-range-thumb {
   border-color: rgb(87,111,230);
}

.range.purple::-moz-range-thumb {
   border-color: rgb(152,68,183);
}

.range.pink::-moz-range-thumb {
   border-color: rgb(255,53,127);
}

input[type=range]::-webkit-slider-thumb:active {
  cursor: -webkit-grabbing;
}

input[type=range]::-moz-range-thumb:active {
  cursor: -moz-grabbing;
}
} */

/* Progress */
.progress {
  position: relative;
  height: 1.5rem;
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
    background-color: rgba(200, 200, 200, .75);
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
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 .5rem .125rem;
  font-size: .9rem;
  font-weight: 400;
  color: rgb(255, 255, 255);
  mix-blend-mode: difference;
  pointer-events: none;

  .remaining:before {
    content: "-";
  }
}
</style>