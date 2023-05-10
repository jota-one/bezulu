import { writable, derived } from 'svelte/store'
import * as player from './services/player'
import { app } from '../../public/feed.json'

const persistKey = 'ple-state-' + app.id
const persistedState = localStorage[persistKey]

let _initialState = {}
let _allTracks = []

export const sortKeys = [
  {
    id: 'release',
    value: 'Release date',
    sortKey: 'dates.released'
  },
  {
    id: 'add',
    value: 'Date added',
    sortKey: 'dates.added'
  },
  {
    id: 'artist',
    value: 'Artist',
    sortKey: 'artist'
  },
  {
    id: 'title',
    value: 'Title',
    sortKey: 'title'
  },
  {
    id: 'title',
    value: 'Title',
    sortKey: 'title'
  },
  {
    id: 'duration',
    value: 'Duration',
    sortKey: 'duration'
  },
]

export const state = writable(
  persistedState ? JSON.parse(persistedState) : _initialState
)

state.subscribe(state => { _initialState = state })

export const activeTrackId = writable(_initialState.activeTrackId || '')
export const duration = writable(_initialState.duration)
export const ellapsed = writable(_initialState.ellapsed || 0)
export const error = writable('')
export const loop = writable(_initialState.loop || 0)
export const random = writable(false)
export const tracksFilter = writable(_initialState.tracksFilter || {})
export const tracksOrder = writable(_initialState.tracksOrder || {})
export const volume = writable(_initialState.volume === 0 ? 0 : _initialState.volume || 0.5)

export const allTracks = derived(
  [random, tracksOrder],
  ([$random, $tracksOrder]) => {
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
      let tracks = _allTracks
        .reduce((allTracks, track, i) => {
          allTracks[track._pos !== undefined ? track._pos : i] = track
          return allTracks
        }, new Array(_allTracks.length))
      
      if (Object.keys($tracksOrder).length) {
        tracks = tracks.sort((a,b) => {
          const valueA = getSortValue(a, $tracksOrder)
          const valueB = getSortValue(b, $tracksOrder)
          
          return valueA === valueB
            ? 0
            : valueA > valueB
              ? $tracksOrder.desc ? -1 : 1
              : $tracksOrder.desc ? 1 : -1
        })
      }

      _allTracks = tracks
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

function getSortValue(track, order) {
  const value = order.key.split('.').reduce((value, key) => value[key], track)
  
  if (order.key.startsWith('dates')) {
    return new Date(value)
  }

  return value
}

activeTrackId.subscribe(activeTrackId => {
  state.update(s => ({ ...s, activeTrackId }))
})

duration.subscribe(duration => {
  state.update(s => ({ ...s, duration }))
})

ellapsed.subscribe(ellapsed => {
  state.update(s => ({ ...s, ellapsed }))
})

loop.subscribe(loop => {
  state.update(s => ({ ...s, loop }))
})

tracksFilter.subscribe(tracksFilter => {
  state.update(s => ({ ...s, tracksFilter }))
})

tracksOrder.subscribe(tracksOrder => {
  state.update(s => ({ ...s, tracksOrder }))
})

volume.subscribe(volume => {
  player.setVolume(volume)
  state.update(s => ({ ...s, volume }))
})

state.subscribe((value) => localStorage[persistKey] = JSON.stringify(value))
