<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import { formatTime } from '../helpers'
  import * as player from '../services/player'
  import {
    activeTrack,
    duration,
    ellapsed,
    error,
    nextTrack,
    prevTrack,
    volume,
  } from '../stores'

  const dispatch = createEventDispatcher()
  const time = { ellapsed: 0, left: 0 }

  let playingTrackId = undefined
  let paused = true
  let progress = 0

  export function playPause() {
    if ($error) {
      return
    }

    if (player.isLoaded()) {
      if (playingTrackId === $activeTrack.id) {
        return play()
      } else {
        player.unload()
        paused = true
        progress = 0
        $ellapsed = 0
      }
    }

    player.playNewSound({
      url: $activeTrack.audioUrl,
      volume: $volume,
      onError,
      onEnd,
    })

    setDuration()

    paused = false
    time.ellapsed = $ellapsed
    time.left = 0

    player.seek($ellapsed)
    playingTrackId = $activeTrack.id

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: $activeTrack.title,
        artist: $activeTrack.artist,
        album: $activeTrack.album,
        artwork: [{ src: $activeTrack.thumbnailUrl }],
      })
    }
  }

  $: playPauseButtonStyle = $activeTrack
    ? `background-image:url(${$activeTrack.thumbnailUrl})`
    : ''

  onMount(() => {
    updateTime()

    if ('mediaSession' in navigator) {
      // Safari for some reason is throwing back mediaSession handlers
      // resulting in an infinite loop... As it seems also it's the only browser
      // implementing the callActionHandler function, using this trick
      // prevents executing the handler indefinitely.
      const skipHandler = Boolean(navigator.mediaSession.callActionHandler)

      navigator.mediaSession.setActionHandler('play', () => {
        if (!skipHandler) {
          player.play()
          navigator.mediaSession.playbackState = 'playing'
        }
      })

      navigator.mediaSession.setActionHandler('pause', () => {
        if (!skipHandler) {
          player.pause()
          navigator.mediaSession.playbackState = 'paused'
        }
      })

      navigator.mediaSession.setActionHandler('stop', () => {
        if (!skipHandler) {
          stop()
          navigator.mediaSession.playbackState = 'none'
        }
      })

      if ($prevTrack) {
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          dispatch('navigate', $prevTrack)
        })
      }

      if ($nextTrack) {
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          dispatch('navigate', $nextTrack)
        })
      }
    }

    window.setInterval(() => {
      if (player.isPlaying()) {
        $ellapsed = player.getPlayingPosition();
        updateTime()
      }
    }, 1000)
  })

  function onEnd() {
    stop()

    if (!$nextTrack) {
      return
    }

    dispatch('navigate', $nextTrack)
  }

  function onError(_error) {
    stop()
    error.set(_error);
  }

  function play() {
    if (player.isPlaying()) {
      player.pause()
      paused = true
    } else {
      player.play()
      paused = false
    }
  }

  function stop() {
    player.stop()
    paused = true
  }

  function seek(event) {
    player.seek(event.target.value)
  }

  function setDuration() {
    $duration = 0

    const int = setInterval(() => {
      if (player.getDuration() > 0) {
        $duration = player.getDuration()
        clearInterval(int)
      }
    }, 250)
  }

  function updateTime() {
    time.ellapsed = $ellapsed
    time.left = $duration - $ellapsed;
    progress = $ellapsed / $duration
  }

  function handleKeydown(event) {
		if (event.code.toLowerCase() === 'space') {
      playPause()
      event.preventDefault()
    }
	}
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="player">
  <button
    class="playpause"
    title="Play / Pause"
    style={playPauseButtonStyle}
    on:click={playPause}
  >
    {#if $activeTrack.id}
      <svg
        viewBox="0 0 60 60"
        width="60"
        height="60"
        fill="currentColor"
        filter="url(#dropshadow)"
      >
        {#if paused || !playingTrackId}
          <path d="M18.2874 47.335V12.6651L44.5939 29.9493L18.2874 47.335Z" />
        {:else}
          <path d="M26.6002 12.4242H16.4615V47.5758H26.6002V12.4242Z" />
          <path d="M43.5385 12.4242H33.3998V47.5758H43.5385V12.4242Z" />
        {/if}
      </svg>
    {/if}
  </button>
  <div class="progress">
    <div class="bar" class:paused style="width: {progress * 100}%">
      <div class="background"></div>
      {#if time.ellapsed}
        <div class="time ellapsed">{formatTime(time.ellapsed)}</div>
      {/if}
    </div>
    <input
      type="range"
      aria-label="Seek audio position"
      min="0"
      max={time.ellapsed + time.left}
      value={time.ellapsed}
      on:input={seek}
    />
    {#if $activeTrack.id}
      <div class="text">
        <h2>
          <b>{$activeTrack.title}</b> by <b>{$activeTrack.artist}</b>
        </h2>
        {#if time.left}
          <div class="time left">-{formatTime(time.left)}</div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  @import "../styles/_media.pcss";
  @import "../styles/_size.pcss";
  @import "../styles/_button.pcss";

  .player {
    width: 100%;
    display: flex;
    align-items: flex-end;
  }

  .playpause {
    position: absolute;
    top: 0;
    left: 0;
    height: var(--ple-s-player-height);
    width: var(--ple-s-player-height);
    color: var(--ple-c-active);
    border: none;
    background-color: rgba(128, 128, 128, 0.2);
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 1;
    transition: color var(--ple-transition-time) var(--ple-transition-type);

    &:after {
      content: "";
      width: 0;
      padding-left: 100%;
    }

    svg {
      position: absolute;
      width: 70%;
      height: 70%;
      pointer-events: none;
    }
  }

  .progress {
    position: relative;
    width: calc(100% - var(--ple-s-player-height) - 1px);
    height: calc(var(--ple-s-player-height) / 1.5);
    margin-left: var(--ple-s-player-height);
  }

  input[type="range"],
  .bar {
    width: 100%;
    height: 100%;
  }

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    height: 100%;
    margin: 0;
    padding: 0;
    background: rgba(20, 20, 20, 0.85);
    background-image: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.05) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.05) 75%,
      transparent 75%,
      transparent 100%
    );
    background-size: 0.75rem 0.75rem;
    background-position: 0 0;
    border: none;
    outline: none;
    overflow: visible;
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      position: relative;
      top: 0.6rem;
      width: 1px;
      height: var(--ple-s-player-height);
      background: var(--ple-c-active);
      outline: none;
      transition: background var(--ple-transition-time)
        var(--ple-transition-type);
    }

    &::-moz-range-thumb {
      appearance: none;
      position: relative;
      top: 0;
      width: 1px;
      height: var(--ple-s-player-height);
      background: var(--ple-c-active);
      outline: none;
      transition: background var(--ple-transition-time)
        var(--ple-transition-type);
    }
  }

  .bar {
    position: absolute;
    top: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1;

    .background {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      &:before {
        content: '';
        position: absolute;
        left: -4vh;
        width: calc(100% + 4vh);
        height: 100%;
        background: var(--ple-c-active);
        background-image: linear-gradient(
          135deg,
          rgba(0, 0, 0, 0.2) 25%,
          transparent 25%,
          transparent 50%,
          rgba(0, 0, 0, 0.2) 50%,
          rgba(0, 0, 0, 0.2) 75%,
          transparent 75%,
          transparent 100%
        );
        background-size: 0.75rem 0.75rem;
        background-position: 0 0;
        transition: background var(--ple-transition-time) var(--ple-transition-type);
      }
    }

    &:not(.paused) .background:before {
      animation: playing 1s linear infinite;
    }

    &:after {
      content: "";
      position: absolute;
      top: 0;
      right: -1px;
      width: 3px;
      height: var(--ple-s-player-height);
      background: var(--ple-c-active);
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.95);
      transition: background var(--ple-transition-time)
        var(--ple-transition-type);
      z-index: 1;
    }

    .time {
      position: absolute;
      top: calc(var(--ple-s-player-height) / 1.5);
      right: 0;
      padding: 0.5rem 0.75rem;
      background: rgba(0, 0, 0, 0.5);
    }
  }

  .text {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0 0.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    color: white;
    text-shadow: 0 0 12px rgba(0,0,0, 0.5);
    pointer-events: none;
    z-index: 2;

    b:first-of-type {
      opacity: 0.7;
    }
  }

  h2 {
    margin-right: 1rem;
    font-size: 1rem;
    line-height: 1;
    font-weight: 400;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    @media (--m) {
      font-size: 1.25rem;
    }
  }

  .time {
    font-size: 0.95rem;
    font-weight: 500;
    color: white;
    text-shadow: 1px 1px 3px black;

    @media (--m) {
      font-size: 1.125rem;
    }
  }
</style>
