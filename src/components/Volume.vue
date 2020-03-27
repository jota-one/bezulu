<template>
  <div class="Volume">
    <svg
      class="icon colored fill"
      viewBox="0 0 24 24"
      >
      <path d="M3 9V15H7L12 20V4L7 9H3Z"/>
      <path
        :class="['path', { visible: value > 25 }]"
        d="M16.5 12C16.5 10.23 15.5 8.71 14 7.97V16C15.5 15.29 16.5 13.76 16.5 12Z"/>
      <path
        :class="['path', { visible: value > 75 }]"
        d="M14 3.23001V5.29001C16.89 6.15001 19 8.83001 19 12C19 15.17 16.89 17.84 14 18.7V20.77C18 19.86 21 16.28 21 12C21 7.72001 18 4.14001 14 3.23001Z"/>
    </svg>
    <input
      ref="range"
      type="range"
      class="slider colored amplitude-volume-slider"
    />
  </div>
</template>

<script>
export default {
  name: 'Volume',

  props: {
    targetSelector: {
      type: String,
      default: '.colored'
    }
  },

  data: () => ({
    value: 50,
    inputRange: undefined,
    speed: 5,
    targets: []
  }),

  mounted () {
    this.inputRange = this.$refs.range
    this.inputRange.addEventListener('input', this.onInput)
    this.targets = document.querySelectorAll(this.targetSelector)
    this.targets.forEach(target => target.classList.add('high'))
  },

  beforeDestroy () {
    this.inputRange.removeEventListener('input', this.onInput)
  },

  methods: {
    onInput (event) {
      this.value = event.target.value

      // Change slide thumb color on way up
      if (this.value > 0) {
        this.targets.forEach(target =>  target.classList.add('lower'))
      }

      if (this.value > 20) {
        this.targets.forEach(target =>  target.classList.add('low'))
      }

      if (this.value > 40) {
        this.targets.forEach(target =>  target.classList.add('high'))
      }

      if (this.value > 60) {
        this.targets.forEach(target =>  target.classList.add('higher'))
      }

      // Change slide thumb color on way down
      if (this.value < 20) {
        this.targets.forEach(target =>  target.classList.remove('low'))
      }

      if (this.value < 40) {
        this.targets.forEach(target =>  target.classList.remove('high'))
      }

      if (this.value < 60) {
        this.targets.forEach(target =>  target.classList.remove('higher'))
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.Volume {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  max-width: 40%;
  padding: 2vh;
}

.icon {
  width: 5vh;
  height: 5vh;
  margin-right: 1vh;
  fill: rgba(255,53,127, 1);
}

.path {
  opacity: 0;
  -webkit-transition: opacity 1s ease;
  transition: opacity 1s ease;

  &.visible {
    opacity: 1;
  }
}

.slider {
  -webkit-appearance: none;
  -moz-appearance: none;
  background: transparent;
  width: 100%;

  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    background: rgba(59,173,227,1);
    background: -moz-linear-gradient(45deg,
      rgba(59,173,227,1) 0%,
      rgba(87,111,230,1) 25%,
      rgba(152,68,183,1) 51%,
      rgba(255,53,127,1) 100%);
    background: -webkit-gradient(left bottom, right top,
      color-stop(0%, rgba(59,173,227,1)),
      color-stop(25%, rgba(87,111,230,1)),
      color-stop(51%, rgba(152,68,183,1)),
      color-stop(100%, rgba(255,53,127,1)));
    background: -webkit-linear-gradient(45deg,
      rgba(59,173,227,1) 0%,
      rgba(87,111,230,1) 25%,
      rgba(152,68,183,1) 51%,
      rgba(255,53,127,1) 100%);
    background: -o-linear-gradient(45deg,
      rgba(59,173,227,1) 0%,
      rgba(87,111,230,1) 25%,
      rgba(152,68,183,1) 51%,
      rgba(255,53,127,1) 100%);
    background: -ms-linear-gradient(45deg,
      rgba(59,173,227,1) 0%,
      rgba(87,111,230,1) 25%,
      rgba(152,68,183,1) 51%,
      rgba(255,53,127,1) 100%);
    background: linear-gradient(45deg,
      rgba(59,173,227,1) 0%,
      rgba(87,111,230,1) 25%,
      rgba(152,68,183,1) 51%,
      rgba(255,53,127,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3bade3 ', endColorstr='#ff357f ', GradientType=1 );
    height: 2px;
  }

  &:focus {
    outline: none;
  }

  &::-moz-range-track {
    -moz-appearance: none;
    background: rgba(59,173,227,1);
    background: -moz-linear-gradient(45deg,
      rgba(59,173,227,1) 0%,
      rgba(87,111,230,1) 25%,
      rgba(152,68,183,1) 51%,
      rgba(255,53,127,1) 100%);
    background: -webkit-gradient(left bottom, right top,
      color-stop(0%, rgba(59,173,227,1)),
      color-stop(25%, rgba(87,111,230,1)),
      color-stop(51%, rgba(152,68,183,1)),
      color-stop(100%, rgba(255,53,127,1)));
    background: -webkit-linear-gradient(45deg,
      rgba(59,173,227,1) 0%,
      rgba(87,111,230,1) 25%,
      rgba(152,68,183,1) 51%,
      rgba(255,53,127,1) 100%);
    background: -o-linear-gradient(45deg,
      rgba(59,173,227,1) 0%,
      rgba(87,111,230,1) 25%,
      rgba(152,68,183,1) 51%,
      rgba(255,53,127,1) 100%);
    background: -ms-linear-gradient(45deg,
      rgba(59,173,227,1) 0%,
      rgba(87,111,230,1) 25%,
      rgba(152,68,183,1) 51%,
      rgba(255,53,127,1) 100%);
    background: linear-gradient(45deg,
      rgba(59,173,227,1) 0%,
      rgba(87,111,230,1) 25%,
      rgba(152,68,183,1) 51%,
      rgba(255,53,127,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#3bade3 ', endColorstr='#ff357f ', GradientType=1 );
    height: 2px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 2px solid;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    bottom: 9px;
    position: relative;
    background-color: #1d1c25;
    cursor: -webkit-grab;
  }

  &::-moz-range-thumb {
    -moz-appearance: none;
    border: 2px solid;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    bottom: 9px;
    position: relative;
    bottom: 11px;
    background-color: #1d1c25;
    cursor: -moz-grab;
    -moz-transition: border .25s ease;
    transition: border .25s ease;
  }

  &::-webkit-slider-thumb:active {
    cursor: -webkit-grabbing;
  }

  &::-moz-range-thumb:active {
    cursor: -moz-grabbing;
  }
}
</style>

<style lang="postcss">
/* Transition */
.colored.color {
  -webkit-transition: color 1s ease;
  transition: color 1s ease;
}

.colored.fill {
  -webkit-transition: fill 1s ease;
  transition: fill 1s ease;
}

.colored.border {
  -webkit-transition: border-color 1s ease;
  transition: border-color 1s ease;
}

.colored.bg,
.colored.progress-bg::-webkit-progress-value {
  -webkit-transition: background-color 1s ease;
  transition: background-color 1s ease;
}

.colored.progress-bg::-moz-progress-bar {
  -webkit-transition: background-color 1s ease;
  transition: background-color 1s ease;
}

.Volume .slider::-webkit-slider-thumb {
  -webkit-transition: border .5s ease;
  transition: border 1s ease;
}

.Volume .slider::-moz-range-thumb {
  -webkit-transition: border .5s ease;
  transition: border 1s ease;
}

/* LOWER */
.colored.lower.color {
  color: rgb(59,173,227);
}

.colored.lower.fill {
  fill: rgb(59,173,227);
}

.colored.lower.border {
  border-color: rgb(59,173,227);
}

.colored.lower.bg,
.colored.lower.progress-bg::-webkit-progress-value {
  background-color: rgb(59,173,227);
}

.colored.lower.progress-bg::-moz-progress-bar {
  background-color: rgb(59,173,227);
}

.Volume .lower.slider::-webkit-slider-thumb {
  border-color: rgb(59,173,227);
}

.Volume .lower.slider::-moz-range-thumb  {
  border-color: rgb(59,173,227);
}

/* LOW */
.colored.low.color {
  color: rgb(87,111,230);
}

.colored.low.fill {
  fill: rgb(87,111,230);
}

.colored.low.border {
  border-color: rgb(87,111,230);
}

.colored.low.bg,
.colored.low.progress-bg::-webkit-progress-value {
  background-color: rgb(87,111,230);
}

.colored.low.progress-bg::-moz-progress-bar {
  background-color: rgb(87,111,230);
}

.Volume .low.slider::-webkit-slider-thumb {
  border-color: rgb(87,111,230);
}

.Volume .low.slider::-moz-range-thumb {
  border-color: rgb(87,111,230);
}

/* HIGH */
.colored.high.color {
  color: rgb(152,68,183);
}

.colored.high.fill {
  fill: rgb(152,68,183);
}

.colored.high.border {
  border-color: rgb(152,68,183);
}

.colored.high.bg,
.colored.high.progress-bg::-webkit-progress-value {
  background-color: rgb(152,68,183);
}

.colored.high.progress-bg::-moz-progress-bar {
  background-color: rgb(152,68,183);
}

.Volume .high.slider::-webkit-slider-thumb {
  border-color: rgb(152,68,183);
}

.Volume .high.slider::-moz-range-thumb {
  border-color: rgb(152,68,183);
}

/* HIGHER */
.colored.higher.color {
  color: rgb(255,53,127);
}

.colored.higher.fill {
  fill: rgb(255,53,127);
}

.colored.higher.bg,
.colored.higher.progress-bg::-webkit-progress-value {
  background-color: rgb(255,53,127);
}

.colored.higher.progress-bg::-moz-progress-bar {
  background-color: rgb(255,53,127);
}

.colored.higher.border {
  border-color: rgb(255,53,127);
}

.Volume .higher.slider::-webkit-slider-thumb {
  border-color: rgb(255,53,127);
}

.Volume .higher.slider::-moz-range-thumb {
  border-color: rgb(255,53,127);
}
</style>