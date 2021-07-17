import { writable, derived } from 'svelte/store'
import * as player from './services/player'

export const activeTrackId = writable({})
export const allTracks = writable([])
export const error = writable('')
export const loop = writable(0)
export const random = writable(false)
export const tracksFilter = writable({ genre: 'house' })
export const volume = writable(0.5)

export const activeTrack = derived(
    [allTracks, activeTrackId],
    ([$allTracks, $activeTrackId]) => ({
        ...$allTracks.find(track => track.id === $activeTrackId),
        isShowcase: true
    })
)

export const filteredTracks = derived(
    [allTracks, tracksFilter],
    ([$allTracks, $tracksFilter]) =>  $allTracks
        .reduce((filteredTracks, track) => {
            filteredTracks.push(track)
            return filteredTracks
        }, [])
)

export const activeTrackIndex = derived(
    [filteredTracks, activeTrackId],
    ([$filteredTracks, $activeTrackId]) => $filteredTracks
        .findIndex(track => track.id === $activeTrackId)
)

export const nextDisabled = derived(
    [filteredTracks, activeTrackIndex, loop],
    ([$filteredTracks, $activeTrackIndex, $loop]) => $loop === 1
        ? true
        : $activeTrackIndex + 1 >= $filteredTracks.length
)

export const prevDisabled = derived(
    [activeTrackIndex, loop],
    ([$activeTrackIndex, $loop]) => $loop === 1 ? true : $activeTrackIndex - 1 < 0
)

export const volumeLevel = derived(volume, $volume => $volume < 0.2
    ? 'min'
    : $volume < 0.4
        ? 'low'
        : $volume < 0.6
            ? 'default'
            : $volume < 0.8
                ? 'high'
                : 'max')

export function setAllTracks(tracks = []) {
    allTracks = tracks
}

volume.subscribe(volume => {
    player.setVolume(volume)
})