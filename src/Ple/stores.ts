import { writable, derived } from 'svelte/store'
import * as player from './services/player'
import { app } from '../feed.json'
import type { Track, SortKey, FilterItem, TracksOrder, TracksFilter, AppState } from './types'

const persistKey = 'ple-state-' + (app as any).id
const persistedState = (localStorage as any)[persistKey]

let _initialState: AppState = {}
let _allTracks: Track[] = []

export const sortKeys: SortKey[] = [
  { id: 'release', value: 'Release date', sortKey: 'dates.released' },
  { id: 'add', value: 'Date added', sortKey: 'dates.added' },
  { id: 'artist', value: 'Artist', sortKey: 'artist' },
  { id: 'title', value: 'Title', sortKey: 'title' },
  { id: 'title', value: 'Title', sortKey: 'title' },
  { id: 'duration', value: 'Duration', sortKey: 'duration' },
]

export const state = writable<AppState>(
  persistedState ? JSON.parse(persistedState) : _initialState
)

state.subscribe(s => { _initialState = s })

export const activeTrackId = writable<string>(_initialState.activeTrackId || '')
export const duration = writable<number | undefined>(_initialState.duration)
export const ellapsed = writable<number>(_initialState.ellapsed || 0)
export const error = writable<string>('')
export const loop = writable<number>(_initialState.loop || 0)
export const random = writable<boolean>(false)
export const showMeta = writable<string[]>([])
export const tracksFilter = writable<TracksFilter>(_initialState.tracksFilter || {})
export const tracksOrder = writable<TracksOrder>(_initialState.tracksOrder || {})
export const volume = writable<number>(_initialState.volume === 0 ? 0 : _initialState.volume || 0.5)

export const allTracks = derived(
  [random, tracksOrder],
  ([$random, $tracksOrder]: [boolean, TracksOrder]) => {
    if ($random) {
      _allTracks = _allTracks.reduce((randomTracks: Track[], track: Track, i: number) => {
        const index = getRandomIndex(_allTracks.length, randomTracks)
        if (!track._pos) track._pos = i
        randomTracks[index] = track
        return randomTracks
      }, new Array(_allTracks.length))
    } else {
      let tracks = _allTracks.reduce((all: Track[], track: Track, i: number) => {
        all[track._pos !== undefined ? track._pos : i] = track
        return all
      }, new Array(_allTracks.length))

      if (Object.keys($tracksOrder).length) {
        tracks = tracks.sort((a: Track, b: Track) => {
          const va = getSortValue(a, $tracksOrder)
          const vb = getSortValue(b, $tracksOrder)
          return va === vb ? 0 : va > vb
            ? ($tracksOrder.desc ? -1 : 1)
            : ($tracksOrder.desc ? 1 : -1)
        })
      }

      _allTracks = tracks
    }

    return _allTracks
  }
)

export const activeTrack = derived(
  [allTracks, activeTrackId],
  ([$allTracks, $activeTrackId]: [Track[], string]) => ({
    ...$allTracks.find(t => t.id === $activeTrackId),
    isShowcase: true
  }) as Track & { isShowcase: boolean }
)

export const filteredTracks = derived(
  [activeTrackId, allTracks, tracksFilter],
  ([$activeTrackId, $allTracks, $tracksFilter]: [string, Track[], TracksFilter]) =>
    $allTracks.reduce((filtered: Track[], track: Track) => {
      if (track.id !== $activeTrackId && isTrackFiltered(track, $tracksFilter)) {
        return filtered
      }
      filtered.push(track)
      return filtered
    }, [])
)

export const activeTrackIndex = derived(
  [filteredTracks, activeTrackId],
  ([$filteredTracks, $activeTrackId]: [Track[], string]) =>
    $filteredTracks.findIndex(t => t?.id === $activeTrackId)
)

export const nextTrack = derived(
  [filteredTracks, activeTrackIndex, loop],
  ([$filteredTracks, $activeTrackIndex, $loop]: [Track[], number, number]) => {
    const isLast = $activeTrackIndex === $filteredTracks.length - 1
    if (isLast && $loop === 0) return undefined
    const index = $loop === 1 ? $activeTrackIndex : isLast ? 0 : $activeTrackIndex + 1
    return $filteredTracks[index]
  }
)

export const prevTrack = derived(
  [filteredTracks, activeTrackIndex, loop],
  ([$filteredTracks, $activeTrackIndex, $loop]: [Track[], number, number]) => {
    const isFirst = $activeTrackIndex === 0
    if (isFirst && $loop === 0) return undefined
    const index = $loop === 1 ? $activeTrackIndex : isFirst ? $filteredTracks.length - 1 : $activeTrackIndex - 1
    return $filteredTracks[index]
  }
)

export const nextDisabled = derived(
  [loop, nextTrack],
  ([$loop, $nextTrack]: [number, Track | undefined]) => $loop === 1 || !$nextTrack
)

export const prevDisabled = derived(
  [loop, prevTrack],
  ([$loop, $prevTrack]: [number, Track | undefined]) => $loop === 1 || !$prevTrack
)

export const volumeLevel = derived(volume, ($v: number) =>
  $v === 0 ? 'off'
  : $v < 0.2 ? 'min'
  : $v < 0.4 ? 'low'
  : $v < 0.6 ? 'default'
  : $v < 0.8 ? 'high'
  : 'max'
)

export const artists = derived(
  [allTracks, tracksFilter],
  ([$allTracks, $tracksFilter]: [Track[], TracksFilter]) =>
    getFilterList($allTracks, $tracksFilter, 'artist')
)

export const genres = derived(
  [allTracks, tracksFilter],
  ([$allTracks, $tracksFilter]: [Track[], TracksFilter]) =>
    getFilterList($allTracks, $tracksFilter, 'genres')
)

export function setAllTracks(tracks: Track[] = []) {
  _allTracks = tracks
}

function isTrackFiltered(track: Track, filters: TracksFilter): boolean {
  return !Object.entries(filters).every(([key, value]) => {
    const v = Array.isArray((track as any)[key])
      ? (track as any)[key].join(',')
      : (track as any)[key]
    const values: string[] = ([] as string[]).concat(value)
    if (!values.length) return true
    return values.some(val => v.toLowerCase().includes(val.toLowerCase()))
  })
}

function getRandomIndex(max: number, list: Track[]): number {
  let index: number
  do { index = Math.floor(Math.random() * max) } while (list[index])
  return index
}

function getFilterList(allTracks: Track[], tracksFilter: TracksFilter, key: string): FilterItem[] {
  return allTracks.reduce((all: FilterItem[], track: Track) => {
    (([] as string[]).concat((track as any)[key])).forEach((keyItem: string) => {
      if (!all.some(item => item.value === keyItem)) {
        all.push({
          id: keyItem.toLowerCase().replace(/[^a-z0-9]/gi, '-').replace(/-+/gi, '-'),
          value: keyItem,
          checked: ((tracksFilter[key] as string[]) || []).includes(keyItem)
        })
      }
    })
    return all
  }, [])
}

function getSortValue(track: Track, order: TracksOrder): any {
  const value = (order.key ?? '').split('.').reduce((v: any, k: string) => v?.[k], track as any)
  if (order.key?.startsWith('dates')) return new Date(value)
  return value
}

activeTrackId.subscribe(v => state.update(s => ({ ...s, activeTrackId: v })))
duration.subscribe(v => state.update(s => ({ ...s, duration: v })))
ellapsed.subscribe(v => state.update(s => ({ ...s, ellapsed: v })))
loop.subscribe(v => state.update(s => ({ ...s, loop: v })))
tracksFilter.subscribe(v => state.update(s => ({ ...s, tracksFilter: v })))
tracksOrder.subscribe(v => state.update(s => ({ ...s, tracksOrder: v })))
volume.subscribe(v => {
  player.setVolume(v)
  state.update(s => ({ ...s, volume: v }))
})
state.subscribe(v => { (localStorage as any)[persistKey] = JSON.stringify(v) })
