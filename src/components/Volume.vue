<template>
  <div class="Volume">
    <svg class="icon" viewBox="0 0 24 24">
      <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
    </svg>
    <input
      type="range"
      class="slider amplitude-volume-slider"
    />
  </div>
</template>

<script>
export default {
  name: 'Volume',

  mounted () {
    // var inputRange = document.getElementsByClassName('range')[0],
    // maxValue = 100, // the higher the smoother when dragging
    // speed = 5,
    // currValue, rafID;

    // // set min/max value
    // inputRange.min = 0;
    // inputRange.max = maxValue;

    // // bind events
    // inputRange.addEventListener('mousedown', unlockStartHandler, false);
    // inputRange.addEventListener('mousestart', unlockStartHandler, false);
    // inputRange.addEventListener('mouseup', unlockEndHandler, false);
    // inputRange.addEventListener('touchend', unlockEndHandler, false);

    // // move gradient
    // inputRange.addEventListener('input', onInput)
  },

  // methods: {
  //   onInput () {
  //       //Change slide thumb color on way up
  //       if (this.value > 20) {
  //           inputRange.classList.add('ltpurple');
  //       }
  //       if (this.value > 40) {
  //           inputRange.classList.add('purple');
  //       }
  //       if (this.value > 60) {
  //           inputRange.classList.add('pink');
  //       }

  //       //Change slide thumb color on way down
  //       if (this.value < 20) {
  //           inputRange.classList.remove('ltpurple');
  //       }
  //       if (this.value < 40) {
  //           inputRange.classList.remove('purple');
  //       }
  //       if (this.value < 60) {
  //           inputRange.classList.remove('pink');
  //       }
  //   },

  //   // listen for unlock
  //   unlockStartHandler () {
  //       // clear raf if trying again
  //       window.cancelAnimationFrame(rafID);

  //       // set to desired value
  //       currValue = +this.value;
  //   },

  //   unlockEndHandler () {

  //       // store current value
  //       currValue = +this.value;

  //       // determine if we have reached success or not
  //       if(currValue >= maxValue) {
  //           successHandler();
  //       }
  //       else {
  //           rafID = window.requestAnimationFrame(animateHandler);
  //       }
  //   },

  //   // handle range animation
  //   animateHandler () {

  //       // calculate gradient transition
  //       var transX = currValue - maxValue;

  //       // update input range
  //       inputRange.value = currValue;

  //       //Change slide thumb color on mouse up
  //       if (currValue < 20) {
  //           inputRange.classList.remove('ltpurple');
  //       }
  //       if (currValue < 40) {
  //           inputRange.classList.remove('purple');
  //       }
  //       if (currValue < 60) {
  //           inputRange.classList.remove('pink');
  //       }

  //       // determine if we need to continue
  //       if(currValue > -1) {
  //         window.requestAnimationFrame(animateHandler);
  //       }

  //       // decrement value
  //       currValue = currValue - speed;
  //   },

  //   // handle successful unlock
  //   successHandler () {
  //     alert('Unlocked');
  //   }
  // }
}
</script>

<style lang="postcss" scoped>
.Volume {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.icon {
  width: 3rem;
  height: 3rem;
  fill: rgba(255,53,127, 1);
}

.slider {
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
    border: .2px solid;
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

  &.blue::-webkit-slider-thumb {
    border-color: rgb(59,173,227);
  }

  &.ltpurple::-webkit-slider-thumb {
    border-color: rgb(87,111,230);
  }

  &.purple::-webkit-slider-thumb {
    border-color: rgb(152,68,183);
  }

  &.pink::-webkit-slider-thumb {
    border-color: rgb(255,53,127);
  }

  &.blue::-moz-range-thumb {
    border-color: rgb(59,173,227);
  }

  &.ltpurple::-moz-range-thumb {
    border-color: rgb(87,111,230);
  }

  &.purple::-moz-range-thumb {
    border-color: rgb(152,68,183);
  }

  &.pink::-moz-range-thumb {
    border-color: rgb(255,53,127);
  }

  &::-webkit-slider-thumb:active {
    cursor: -webkit-grabbing;
  }

  &::-moz-range-thumb:active {
    cursor: -moz-grabbing;
  }
}
</style>