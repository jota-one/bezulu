import { Howl } from 'howler'

let sound = undefined

function debounce(fn, timeout = 0) {
  let timer

  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, timeout)
  }
}

function getError(code) {
  switch (code) {
    case 1:
      return 'Request aborted'
    case 2:
      return 'Network error'
    case 3:
      return 'Decoding error'
    case 4:
      return 'Can\'t load media file'
    default:
      return 'Unknown error'
  }
}

export function getPlayingPosition() {
  return sound.seek()
}

export function getDuration() {
  return sound.duration()
}

export function getVolume() {
  return sound.volume()
}

export function setVolume(value) {
  if (!sound) {
    return
  }

  sound.volume(value)
}

export function isLoaded() {
  return Boolean(sound)
}

export function isPlaying() {
  return sound && sound.playing()
}

export function unload() {
  sound.unload()
}

export function playNewSound({ url, volume = 1, onEnd = () => { }, onError = () => { } }) {
  sound = new Howl({
    src: [url],
    html5: true,
    volume
  })

  sound.on('end', () => {
    onEnd()
  })

  sound.on('loaderror', (_, errorCode) => {
    onError(getError(errorCode))
  })

  sound.on('playerror', (_, errorCode) => {
    onError(getError(errorCode))
  })

  play()
}

export function play() {
  sound.play()
}

export function pause() {
  sound.pause()
}

export function stop() {
  sound.stop()
}

function debouncedSeek(seconds) {
  if (!sound) {
    return
  }

  sound.seek(seconds)
}

export const seek = debounce(seconds => debouncedSeek(seconds), 100)
