<script>
    import Grid from './Grid.svelte'
    import Player from './Player.svelte'

    export let tracks = [];

    let player = undefined
    let selectedTrack = undefined

    $: activeTrack = {
        ...tracks.find((track) => track.active),
        isPlayer: true
    }

    function playPause (event) {
        selectedTrack = event.detail

        tracks = tracks.map((track, index) => ({
            ...track,
            active: track.id === selectedTrack.id
        }))

        window.setTimeout(() => {
            player.playPause()
        })
    }
</script>

<div class="plé-app">
    <Player track={selectedTrack || activeTrack} bind:this={player} />
    <Grid {tracks} {activeTrack} on:playPause={playPause} />
</div>

<style global lang="postcss">
    @import "styles/_media.pcss";
    @import "styles/_fonts.pcss";

    @keyframes playing {
        100% {
            background-position: 4vh 0, 4vh 0, 4vh 0;
        }
    }

    * {
        box-sizing: border-box;
    }

    .plé-app {
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

        @media (--s) {
            max-width: 75vh;
        }

        @media (--m) {
            max-width: 100vh;
        }

        @media (--l) {
            max-width: 125vh;
        }

        @media (--xl) {
            max-width: 150vh;
        }
    }
</style>
