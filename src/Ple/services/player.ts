import { Howl } from 'howler'

let sound: Howl | undefined

function debounce<T extends (...args: any[]) => void>(fn: T, timeout = 0): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), timeout)
  }) as T
}

function getError(code: number): string {
  switch (code) {
    case 1: return 'Request aborted'
    case 2: return 'Network error'
    case 3: return 'Decoding error'
    case 4: return "Can't load media file"
    default: return 'Unknown error'
  }
}

export function getPlayingPosition(): number {
  return sound!.seek() as number
}

export function getDuration(): number {
  return sound!.duration()
}

export function getVolume(): number {
  return sound!.volume() as number
}

export function setVolume(value: number): void {
  if (!sound) return
  sound.volume(value)
}

export function isLoaded(): boolean {
  return Boolean(sound)
}

export function isPlaying(): boolean {
  return Boolean(sound?.playing())
}

export function unload(): void {
  sound!.unload()
}

interface PlayNewSoundOptions {
  url: string
  volume?: number
  onEnd?: () => void
  onError?: (err: string) => void
}

export function playNewSound({ url, volume = 1, onEnd = () => {}, onError = () => {} }: PlayNewSoundOptions): void {
  sound = new Howl({ src: [url], html5: true, volume })
  sound.on('end', onEnd)
  sound.on('loaderror', (_, code) => onError(getError(code as number)))
  sound.on('playerror', (_, code) => onError(getError(code as number)))
  play()
}

export function play(): void {
  sound!.play()
}

export function pause(): void {
  sound!.pause()
}

export function stop(): void {
  sound!.stop()
}

function debouncedSeek(seconds: number): void {
  if (!sound) return
  sound.seek(seconds)
}

export const seek = debounce((seconds: number) => debouncedSeek(seconds), 100)
