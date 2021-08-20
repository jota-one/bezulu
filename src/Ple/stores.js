import { writable, derived } from 'svelte/store'
import * as player from './services/player'

let _allTracks = []

export const activeTrackId = writable('')
export const error = writable('')
export const loop = writable(0)
export const random = writable(false)
export const tracksFilter = writable({})
export const volume = writable(0.5)

export const allTracks = derived(random, $random => {  
  if ($random) {
    _allTracks = _allTracks.reduce((randomTracks, track, i) => {
      const index = $random
        ? getRandomIndex(_allTracks.length, randomTracks)
        : track._pos
      
      if (!track._pos) {
        track._pos = i
      }
  
      randomTracks[index] = track
      return randomTracks
    }, new Array(_allTracks.length))
  } else {
    _allTracks = _allTracks.reduce((allTracks, track, i) => {
      allTracks[track._pos !== undefined ? track._pos : i] = track
      return allTracks
    }, new Array(_allTracks.length))
  }

  return _allTracks
})

export const activeTrack = derived(
  [allTracks, activeTrackId],
  ([$allTracks, $activeTrackId]) => ({
    ...$allTracks.find(track => track.id === $activeTrackId),
    isShowcase: true
  })
)

export const filteredTracks = derived(
  [activeTrackId, allTracks, tracksFilter],
  ([$activeTrackId, $allTracks, $tracksFilter]) => $allTracks
    .reduce((filteredTracks, track) => {
      if (
        track.id !== $activeTrackId &&
        isTrackFiltered(track, $tracksFilter)
      ) {
        return filteredTracks
      }

      filteredTracks.push(track)
      return filteredTracks
    }, [])
)

export const activeTrackIndex = derived(
  [filteredTracks, activeTrackId],
  ([$filteredTracks, $activeTrackId]) => $filteredTracks
    .findIndex(track => track?.id === $activeTrackId)
)

export const nextTrack = derived(
  [filteredTracks, activeTrackIndex, loop],
  ([$filteredTracks, $activeTrackIndex, $loop]) => {
    const isLast = $activeTrackIndex === $filteredTracks.length - 1
      
    if (isLast && $loop === 0) {
        return
    }

    const index = $loop === 1
      ? $activeTrackIndex
      : isLast
        ? 0
        : $activeTrackIndex + 1 
    
    return $filteredTracks[index]
  }
)

export const prevTrack = derived(
  [filteredTracks, activeTrackIndex, loop],
  ([$filteredTracks, $activeTrackIndex, $loop]) => {
    const isFirst = $activeTrackIndex === 0
      
    if (isFirst && $loop === 0) {
        return
    }

    const index = $loop === 1
      ? $activeTrackIndex
      : isFirst
        ? $filteredTracks.length - 1
        : $activeTrackIndex - 1

    return $filteredTracks[index]
  }
)

export const nextDisabled = derived(
  [loop, nextTrack],
  ([$loop, $nextTrack]) => $loop === 1 || !Boolean($nextTrack)
)

export const prevDisabled = derived(
  [loop, prevTrack],
  ([$loop, $prevTrack]) => $loop === 1 || !Boolean($prevTrack)
)

export const volumeLevel = derived(volume, $volume => $volume === 0
  ? 'off'
  : $volume < 0.2
    ? 'min'
    : $volume < 0.4
      ? 'low'
      : $volume < 0.6
        ? 'default'
        : $volume < 0.8
          ? 'high'
          : 'max')

export const artists = derived(
  [allTracks, tracksFilter],
  ([$allTracks, $tracksFilter]) => getFilterList(
    $allTracks,
    $tracksFilter,
    'artist'
  )
)

export const genres = derived(
  [allTracks, tracksFilter],
  ([$allTracks, $tracksFilter]) => getFilterList(
    $allTracks,
    $tracksFilter,
    'genres'
  )
)

export function setAllTracks(tracks = []) {
  _allTracks = tracks
}

volume.subscribe(volume => {
  player.setVolume(volume)
})

function isTrackFiltered(track, filters) {
  return !Object.entries(filters).every(([key, value]) => {
    const v = Array.isArray(track[key]) ? track[key].join(',') : track[key]
    const values = [].concat(value)
    
    if (!values.length) {
      return true
    }
    
    return values
      .some(value => v.toLowerCase().includes(value.toLowerCase()))
  })
}

function getRandomIndex(max, list) {
  let index
  
  do {
    index = Math.floor(Math.random() * max)
  } while(list[index])
  
  return index
}

function getFilterList(allTracks, tracksFilter, key) {
  return allTracks.reduce((all, track) => {
    [].concat(track[key]).forEach(keyItem => {
      if (!all.map(item => item.value).includes(keyItem)) {
        all.push({
          id: keyItem.toLowerCase()
            .replace(/[^a-z0-9]/gi, '-')
            .replace(/-+/gi, '-'),
          value: keyItem,
          checked: (tracksFilter[key] || []).includes(keyItem)
        })
      }
    })
    return all
  }, [])
}