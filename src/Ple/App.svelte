<script>
    import { createEventDispatcher } from 'svelte'
    import {
        activeTrack,
        activeTrackId,
        filteredTracks,
        setAllTracks,
        volumeLevel
    } from './stores'
    import Grid from './components/Grid.svelte'
    import Player from './components/Player.svelte'
    import Controls from './components/Controls.svelte'
    import Router from './components/Router.svelte'
    import Footer from './components/Footer.svelte'
    import SvgFilters from './components/SvgFilters.svelte'

    export let tracks = []
    export let basePath = undefined

    const dispatch = createEventDispatcher()

    let app = undefined
    let router = undefined
    let player = undefined

    $: { setAllTracks(tracks) }
    $: { dispatch('colorChanged', $volumeLevel) }

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
        window.setTimeout(() => { player.playPause() })
    }
</script>

<div class="ple-app volume-{$volumeLevel}" bind:this={app}>
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
        <Controls on:navigate={navigate} />
        <div class="grid">
            <slot></slot>
            <Grid on:navigate={navigate} />
            <div style="flex:1"></div>
            <div class=" to-top">
                <button class="active" on:click={() => { app.scrollIntoView() }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" filter="url(#dropshadow)">
                        <path d="M14,20H10V11L6.5,14.5L4.08,12.08L12,4.16L19.92,12.08L17.5,14.5L14,11V20Z" />
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
            background-position: 4vh 0, 4vh 0, 4vh 0;
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
        font-family: var(--ple-f-sans);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        background: inherit;

        @media (--h300) {
            max-width: 300vh;
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
            background: rgba(0,0,0, 0.75);
            z-index: 3;
        }

        main,
        .grid {
            display: flex;
        }

        main {
            background: inherit;
        }

        .grid {
            flex-grow: 1;
            flex-direction: column;
            min-height: calc(100vh - var(--ple-s-player-height));
            z-index: 0;
        }

        .to-top {
            position: sticky;
            bottom: 2vh;
            display: flex;
            justify-content: flex-end;
            padding: 0 2vh;
            pointer-events: none;

            button {
                pointer-events: all;
            }

            svg {
                width: 5vh;
                height: 5vh;
            }
        }
    }
</style>
