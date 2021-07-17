<script>
    import { onMount, createEventDispatcher } from 'svelte'
    import { formatTime } from '../helpers'
    import * as player from '../services/player'
    import { error, volume } from '../stores'

    export let track = undefined

    const dispatch = createEventDispatcher()
    const time = { ellapsed: 0, left: 0 }

    let playingTrackId = undefined
    let paused = undefined
    let progress = 0

    export function playPause() {
        if ($error) {
            return
        }

        if (player.isLoaded()) {
            if (playingTrackId === track.id) {
                if (!player.isPlaying()) {
                    player.play()
                    paused = false
                } else {
                    player.pause()
                    paused = true
                }
                return
            } else {
                progress = 0
                player.unload()
                paused = true
            }
        }

        player.playNewSound({
            url: track.audioUrl,
            volume: $volume,
            onError,
            onEnd
        })

        paused = false

        time.ellapsed = 0
        time.left = 0
        
        playingTrackId = track.id
        
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.artist,
                album: track.album,
                artwork: [{ src: track.coverUrl }]
            });

            navigator.mediaSession.setActionHandler('play', player.play)
            navigator.mediaSession.setActionHandler('pause', player.pause)
            navigator.mediaSession.setActionHandler('stop', player.stop)
            // navigator.mediaSession.setActionHandler('seekbackward', function() { /* Code excerpted. */ });
            // navigator.mediaSession.setActionHandler('seekforward', function() { /* Code excerpted. */ });
            // navigator.mediaSession.setActionHandler('seekto', function() { /* Code excerpted. */ });
            // navigator.mediaSession.setActionHandler('previoustrack', function() { /* Code excerpted. */ });
            // navigator.mediaSession.setActionHandler('nexttrack', function() { /* Code excerpted. */ });
            // navigator.mediaSession.setActionHandler('skipad', function() { /* Code excerpted. */ });navigator.mediaSession.setActionHandler('seekbackward', function() { /* Code excerpted. */ });
            // navigator.mediaSession.setActionHandler('seekforward', function() { /* Code excerpted. */ });
            // navigator.mediaSession.setActionHandler('seekto', function() { /* Code excerpted. */ });
            // navigator.mediaSession.setActionHandler('previoustrack', function() { /* Code excerpted. */ });
            // navigator.mediaSession.setActionHandler('nexttrack', function() { /* Code excerpted. */ });
            // navigator.mediaSession.setActionHandler('skipad', function() { /* Code excerpted. */ });
        }
    }

    $: playPauseButtonStyle = track ? `background-image:url(${track.coverUrl})` : ''

    onMount(() => {
        // TODO synchronize timers rendering when seeking
        window.setInterval(() => {
            if (player.isPlaying()) {
                const duration = player.getDuration()
                const ellapsed = player.getPlayingPosition()

                time.ellapsed = ellapsed
                time.left = duration - ellapsed
                progress = ellapsed / duration
            }
        }, 500)
    })

    function onEnd() {
        player.stop()
        paused = true
        dispatch('navigate')
    }

    function onError(_error) {
        player.stop()
        paused = true
        error.set(_error)
    }

    function seek(event) {
        player.seek(event.target.value)

        if (!player.isPlaying()) {
            player.play()
            paused = false
        }
    }
</script>

<div class="player">
    <button class="playpause" style="{playPauseButtonStyle}" on:click={playPause}>
        {#if track.id}
            <svg viewBox="0 0 60 60" width="60" height="60" fill="currentColor" filter="url(#dropshadow)">
            {#if paused || !playingTrackId}                
                <path d="M18.2874 47.335V12.6651L44.5939 29.9493L18.2874 47.335Z"/>
            {:else}
                <path d="M26.6002 12.4242H16.4615V47.5758H26.6002V12.4242Z"/>
                <path d="M43.5385 12.4242H33.3998V47.5758H43.5385V12.4242Z"/>
            {/if}
            </svg>
        {/if}
    </button>
    <div class="progress">
        <div
            class="bar"
            class:paused
            style="width: {progress * 100}%"
        >
            {#if time.ellapsed}
                <div class="time ellapsed">{formatTime(time.ellapsed)}</div>
            {/if}
        </div>
        <input type=range min=0 max={time.ellapsed + time.left} value={time.ellapsed} on:input={seek} />
        {#if track.id}
        <div class="text">
            <h2>
                <b>{track.title}</b> by <b>{track.artist}</b>
            </h2>
            {#if time.left}
                <div class="time left">-{formatTime(time.left)}</div>
            {/if}
        </div>
        {/if}
    </div>
</div>

<style lang="postcss">
    @import "../styles/_media.pcss";
    @import "../styles/_size.pcss";
    @import "../styles/_button.pcss";

    .player {
        width: 100%;
        display: flex;
        align-items: flex-end;
    }

    .playpause {
        position: absolute;
        top: 0;
        left: 0;
        height: var(--ple-s-player-height);
        width: var(--ple-s-player-height);
        color: var(--ple-c-active);
        border: none;
        background-color: rgba(128,128,128, 0.2);
        background-size: cover;
        background-repeat: no-repeat;
        z-index: 1;
        transition: color var(--ple-transition-time) var(--ple-transition-type);

        &:after {
            content: '';
            width: 0;
            padding-left: 100%;
        }

        svg {
            position: absolute;
            width: 5vh;
            height: 5vh;
            pointer-events: none;
        }
    }

    .progress {
        position: relative;
        width: calc(100% - var(--ple-s-player-height) - 1px);
        margin-left: var(--ple-s-player-height);
    }

    input[type="range"],
    .bar {
        width: 100%;
    }

    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        display: block;
        height: 5vh;
        margin: 0;
        padding: 0;
        background: rgba(20,20,20, 0.85);
        background-image: linear-gradient(
            135deg,
            rgba(255,255,255, .025) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255,255,255, .025) 50%,
            rgba(255,255,255, .025) 75%,
            transparent 75%,
            transparent 100%
        );
        background-size: 1vh 1vh;
        background-position: 0 0;
        border: none;
        outline: none;
        overflow: visible;
        cursor: pointer;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            position: relative;
            top: 0;
            width: 1px;
            height: 5vh;
            background: var(--ple-c-active);
            transition: background var(--ple-transition-time) var(--ple-transition-type);
        }

        &::-moz-range-thumb {
            appearance: none;
            position: relative;
            top: 0;
            width: 1px;
            height: 5vh;
            background: var(--ple-c-active);
            transition: background var(--ple-transition-time) var(--ple-transition-type);
        }
    }

    .bar {
        position: absolute;
        top: 0;
        bottom: 0;
        background: var(--ple-c-active);
        background-image: linear-gradient(
            135deg,
            rgba(0,0,0, .2) 25%,
            transparent 25%,
            transparent 50%,
            rgba(0,0,0, .2) 50%,
            rgba(0,0,0, .2) 75%,
            transparent 75%,
            transparent 100%
        );
        background-size: 1vh 1vh;
        background-position: 0 0;
        transition: background var(--ple-transition-time) var(--ple-transition-type);
        pointer-events: none;
        z-index: 1;
        
        &:not(.paused) {
            animation: playing 1s linear infinite;
        }

        &:after {
            content: '';
            position: absolute;
            top: 0;
            right: -1px;
            width: 3px;
            height: var(--ple-s-player-height);
            background: var(--ple-c-active);
            box-shadow: 0 0 5px rgba(0,0,0, 0.95);
            transition: background var(--ple-transition-time) var(--ple-transition-type);
            z-index: 1;
        }

        .time {
            position: absolute;
            bottom: -3.2vh;
            right: 0;
            padding: 0.45vh 0.85vh;
            background: rgba(0,0,0, 0.5);
        }
    }

    .text {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;
        padding: 0 1.25vh;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 400;
        color: white;
        text-shadow: 0 0 10px black;
        pointer-events: none;
        z-index: 2;
    }

    h2 {
        font-size: 2vh;
        line-height: 1;
        font-weight: 400;
    }

    .time {
        font-size: 1.8vh;
        font-weight: 500;
        color: white;
        text-shadow: 1px 1px 3px black;
    }
</style>