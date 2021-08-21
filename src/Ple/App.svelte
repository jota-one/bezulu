<script>
  import { createEventDispatcher } from 'svelte'
  import {
    activeTrackId,
    setAllTracks,
    volumeLevel,
  } from './stores'
  import Grid from './components/Grid.svelte'
  import Player from './components/Player.svelte'
  import Controls from './components/Controls.svelte'
  import Router from './components/Router.svelte'
  import Footer from './components/Footer.svelte'
  import SvgFilters from './components/SvgFilters.svelte'
  import Volume from './components/Volume.svelte'
  import OverlayPanel from './components/OverlayPanel.svelte'

  export let tracks = []
  export let basePath

  const dispatch = createEventDispatcher()

  let app
  let router
  let player
  let controls
  let panel

  $: {
    setAllTracks(tracks)
    dispatch('colorChanged', $volumeLevel)
  }

  function onRouterInit(event) {
    setActiveTrackId(event.detail || tracks[0].id)
  }

  function onRouterNavigate(event) {
    setActiveTrackId(event.detail || tracks[0].id)
    playActiveTrack()
  }

  function navigate(event) {
    setActiveTrackId(event.detail.id)
    router.navigate($activeTrackId)
    playActiveTrack()
  }

  function setActiveTrackId(trackId) {
    $activeTrackId = trackId
  }

  function playActiveTrack() {
    window.setTimeout(() => {
      player.playPause()
    });
  }

  function toggleFilter(event) {
    panel.toggle(event.detail)
  }

  function onClickInApp(event) {
    const isBody = element => element.tagName.toLowerCase() === 'body'
    let target = event.target
    
    while (
      !isBody(target) &&
      target !== panel.getDomElement() &&
      !Object.values(controls.getDomFilterButtons())
        .some(button => button === target)
    ) {
      target = target.parentNode
    }

    if (isBody(target) && panel.isVisible()) {
      panel.close()
      controls.clearFilter()
    }
  }
</script>

<div
  class="ple-app volume-{$volumeLevel}"
  bind:this={app}
  on:click={onClickInApp}
>
  <SvgFilters />
  <Router
    {basePath}
    bind:this={router}
    on:init={onRouterInit}
    on:navigate={onRouterNavigate}
  />
  <header>
    <Player bind:this={player} on:navigate={navigate} />
  </header>
  <main>
    <Controls
      bind:this={controls}
      on:navigate={navigate}
      on:toggleFilter={toggleFilter}
    />
    <div class="grid">
      <slot />
      <OverlayPanel bind:this={panel}/>
      <Grid on:navigate={navigate} />
      <div style="flex:1" />
      <div class="secondary-controls">
        <Volume/>
        <button
          class="active"
          title="Scroll to top of page"
          on:click={() => {
            app.scrollIntoView();
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            filter="url(#dropshadow)"
          >
            <path
              d="M14,20H10V11L6.5,14.5L4.08,12.08L12,4.16L19.92,12.08L17.5,14.5L14,11V20Z"
            />
          </svg>
        </button>
      </div>
      <Footer />
    </div>
  </main>
</div>

<style global lang="postcss">
  /* Don't remove these imports as the variables they contain
       (colors, transition, size, etc.) can be used by the app/page
       embedding Ple.
    */
  @import "styles/_media.pcss";
  @import "styles/_transition.pcss";
  @import "styles/_font.pcss";
  @import "styles/_button.pcss";

  @keyframes playing {
    100% {
      /* background-position: 4vh 0, 4vh 0, 4vh 0; */
      transform: translate3d(4vh, 0, 0)
    }
  }

  * {
    box-sizing: border-box;
  }

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
      bottom: 1rem;
      display: flex;
      justify-content: space-between;
      padding: 1rem 1.5rem 0 0;
      pointer-events: none;
      z-index: 1;

      & > * {
        pointer-events: all;
      }

      button {
        transition: color var(--ple-transition-time) var(--ple-transition-type);
      }

      svg {
        width: 3rem;
        height: 3rem;
      }
    }

    .scrollable {
      &::-webkit-scrollbar {
        width: 0.5rem;
      }

      &::-webkit-scrollbar-track {
        background: rgba(128,128,128, 0.35);
      }

      &::-webkit-scrollbar-thumb {
        background-color: rgba(255,255,255, 0.25);
        border: none;
      }
    }
  }
</style>
