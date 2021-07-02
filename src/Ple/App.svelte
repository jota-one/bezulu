<script>
    import Grid from './components/Grid.svelte'
    import Player from './components/Player.svelte'
    import Router from './components/Router.svelte'
    import Footer from './components/Footer.svelte'

    export let tracks = []
    export let basePath = undefined

    let router = undefined
    let player = undefined
    let activeTrackId = undefined

    $: activeTrack = tracks.find(track => track.id === activeTrackId)

    function onRouterInit(event) {
        activeTrackId = event.detail || tracks[0].id
    }

    function onRouterNavigate(event) {
        activeTrackId = event.detail || tracks[0].id
        playActiveTrack()
    }

    function onGridNavigate(event) {
        activeTrackId = event.detail.id
        router.navigate(activeTrackId)
        playActiveTrack()
    }

    function playActiveTrack() {
        window.setTimeout(() => { player.playPause() })
    }
</script>

<div class="ple-app">
    <Router
        {basePath}
        bind:this={router}
        on:init={onRouterInit}
        on:navigate={onRouterNavigate}
    />
    {#if (activeTrack)}
        <header class="grid">
            <Player track={activeTrack} bind:this={player} />
        </header>
        <Grid {tracks} {activeTrack} on:navigate={onGridNavigate} />
    {/if}
    <Footer/>
</div>

<style global lang="postcss">
    @import "styles/_media.pcss";
    @import "styles/_fonts.pcss";
    @import "styles/_grid.pcss";

    @keyframes playing {
        100% {
            background-position: 4vh 0, 4vh 0, 4vh 0;
        }
    }

    * {
        box-sizing: border-box;
    }

    .ple-app {
        margin: 0 auto;
        min-width: 320px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        background: black;
        font-family: var(--f-sans);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;

        @media (--h300) {
            max-width: 300vh;
        }

        --c-active: var(--c-max);
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
</style>
