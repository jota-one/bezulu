export interface TrackDates {
  added: string
  released: string
  updated?: string
}

export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  audioUrl: string
  coverUrl?: string
  thumbnailUrl?: string
  dates: TrackDates
  downloadable?: boolean
  duration: number
  genres: string[]
  isNew?: boolean
  isShowcase?: boolean
  active?: boolean
  showMeta?: boolean
  _pos?: number
}

export interface SortKey {
  id: string
  value: string
  sortKey: string
}

export interface FilterItem {
  id: string
  value: string
  checked: boolean
}

export interface TracksOrder {
  key?: string
  desc?: boolean
}

export interface TracksFilter {
  [key: string]: string[]
}

export interface AppState {
  activeTrackId?: string
  duration?: number
  ellapsed?: number
  loop?: number
  tracksFilter?: TracksFilter
  tracksOrder?: TracksOrder
  volume?: number
}
