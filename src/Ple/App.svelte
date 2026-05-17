<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import {
    activeTrackId,
    allTracks,
    setAllTracks,
    showMeta,
    tracksOrder,
    volumeLevel
  } from './stores'
  import Grid from './components/layout/Grid.svelte'
  import OverlayPanel from './components/layout/OverlayPanel.svelte'
  import Footer from './components/layout/Footer.svelte'
  import PlayerComponent from './components/Player.svelte'
  import Controls from './components/Controls.svelte'
  import Router from './components/Router.svelte'
  import SvgFilters from './components/SvgFilters.svelte'
  import Volume from './components/Volume.svelte'
  import BackToTop from './components/BackToTop.svelte'
  import type { Track } from './types'

  let { tracks = [], basePath, onColorChanged, children }: {
    tracks?: Track[]
    basePath: string
    onColorChanged?: (level: string) => void
    children?: Snippet
  } = $props()

  const IS_NEW_TIMERANGE = 2505600000

  let appEl: HTMLDivElement
  let router: { navigate: (id: string) => void }
  let playerComp: { playPause: () => void }
  let controls: { getDomPanelButtons: () => Record<string, HTMLElement | undefined>; clearActivePanel: () => void }
  let panel: { toggle: (key: string) => void; close: () => void; isVisible: () => boolean; getDomElement: () => HTMLElement }
  let showBackToTop = $state(false)

  $effect.pre(() => {
    setAllTracks(tracks.map(track => ({ ...track, isNew: isNew(track) })))
  })

  $effect(() => {
    setTimeout(() => onColorChanged?.($volumeLevel), 0)
  })

  function isNew(track: Track): boolean {
    return Date.now() - new Date(track.dates.added).getTime() < IS_NEW_TIMERANGE
  }

  function onRouterInit(trackId: string) {
    $tracksOrder = $tracksOrder || { key: 'dates.added', desc: true }
    setActiveTrackId(trackId || $activeTrackId || $allTracks[0]?.id)
  }

  function onRouterNavigate(trackId: string) {
    setActiveTrackId(trackId)
    playActiveTrack()
  }

  function navigate(track: Track) {
    setActiveTrackId(track.id)
    router.navigate($activeTrackId)
    playActiveTrack()
  }

  function setActiveTrackId(trackId: string | undefined) {
    $activeTrackId = trackId || tracks[0]?.id || ''
  }

  function playActiveTrack() {
    window.setTimeout(() => playerComp.playPause())
  }

  function togglePanel(key: string) {
    panel.toggle(key)
  }

  function toggleMeta(track: Track) {
    const trackId = track?.id
    if (!trackId) return

    if ($showMeta.includes(trackId)) {
      $showMeta = $showMeta.filter(id => id !== trackId)
    } else {
      $showMeta = [...$showMeta, trackId]
    }
  }

  function onClickInApp(event: MouseEvent) {
    const isBody = (el: Element | null) => el?.tagName.toLowerCase() === 'body'
    let target = event.target as Element | null

    while (
      !isBody(target) &&
      target !== panel.getDomElement() &&
      !Object.values(controls.getDomPanelButtons()).some(btn => btn === target)
    ) {
      if (!target) break
      target = target.parentNode as Element | null
    }

    if (isBody(target) && panel.isVisible()) {
      panel.close()
      controls.clearActivePanel()
    }
  }

  onMount(() => {
    const target = document.querySelector('.grid .active')
    if (!target) return

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        showBackToTop = !entry.isIntersecting
      })
    })

    observer.observe(target)
  })
</script>

<div
  class="ple-app volume-{$volumeLevel}"
  bind:this={appEl}
  onclick={onClickInApp}
>
  <SvgFilters />
  <Router
    {basePath}
    bind:this={router}
    oninit={onRouterInit}
    onnavigate={onRouterNavigate}
  />
  <header>
    <PlayerComponent bind:this={playerComp} onnavigate={navigate} />
  </header>
  <main>
    <Controls
      bind:this={controls}
      onnavigate={navigate}
      onTogglePanel={togglePanel}
    />
    <div class="grid">
      {@render children?.()}
      <OverlayPanel bind:this={panel} />
      <Grid onnavigate={navigate} onToggleMeta={toggleMeta} />
      <div style="flex:1"></div>
      <div class="secondary-controls">
        <Volume />
        <div class="back-to-top" class:show={showBackToTop}>
          <BackToTop onScrollTop={() => appEl.scrollIntoView()} />
        </div>
      </div>
      <Footer />
    </div>
  </main>
</div>

<style lang="postcss">
  @import "styles/_media.pcss";

  .ple-app {
    position: relative;
    margin: 0 auto;
    min-width: 320px;
    display: flex;
    flex-direction: column;
    max-width: var(--ple-s-max-width);
    font-family: var(--ple-f-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    background: inherit;

    &.volume-off {
      --ple-c-active: var(--ple-c-off);
    }

    &.volume-min {
      --ple-c-active: var(--ple-c-min);
    }

    &.volume-low {
      --ple-c-active: var(--ple-c-low);
    }

    &.volume-default {
      --ple-c-active: var(--ple-c-default);
    }

    &.volume-high {
      --ple-c-active: var(--ple-c-high);
    }

    &.volume-max {
      --ple-c-active: var(--ple-c-max);
    }

    header {
      position: sticky;
      top: 0;
      width: 100%;
      max-width: 100%;
      margin-bottom: 1px;
      background: rgba(0, 0, 0, 0.75);
      z-index: 3;
    }

    main,
    .grid {
      display: flex;
    }

    main {
      min-height: calc(100vh - var(--ple-s-player-height) / 1.5);
      background: inherit;
    }

    .grid {
      flex-grow: 1;
      flex-direction: column;
      min-height: calc(100vh - var(--ple-s-player-height));
      z-index: 0;
    }

    .secondary-controls {
      position: sticky;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      padding: 2rem 1.5rem 0 0;
      pointer-events: none;
      z-index: 1;
    }

    .back-to-top {
      opacity: 0.3;
      transform: translateY(5rem);
      transition: all var(--ple-transition-time) var(--ple-transition-type);

      &.show {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
</style>
