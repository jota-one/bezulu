<script>
    import { Howl } from 'howler'
    import { onMount } from 'svelte'

    export let track = undefined
    export function playPause() {
        return _playPause()
    }

    let player = undefined
    let wrapper = undefined
    let wrapperY = -1
    let progress = 0
    let sound = undefined
    let playingTrackId = undefined
    let paused = false
    const time = {
        ellapsed: 0,
        left: 0
    }

    $: playPauseButtonStyle = track ? `background-image:url(${track.coverUrl})` : ''

    function _playPause() {
        if (sound) {
            if (playingTrackId === track.id) {
                if (paused) {
                    play()
                } else {
                    pause()
                }
                return
            } else {
                progress = 0
                sound.unload()
            }
        }
        
        time.ellapsed = 0
        time.left = 0

        sound = new Howl({
            src: [track.audioUrl],
            html5: true
        })
        
        sound.once('load', () => {
            time.left = sound.duration()
        })

        sound.on('end', () => {
            stop()
        })

        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.artist,
                album: track.album,
                artwork: [{ src: track.coverUrl }]
            });

            navigator.mediaSession.setActionHandler('play', () => {
                play()
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                pause()
            });
            
            navigator.mediaSession.setActionHandler('stop', () => {
                stop()
            });

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

        play()
        
        playingTrackId = track.id
    }

    function formatTime(seconds) {
        const padStart = number => ('' + number).padStart('2', 0)

        let remaining = seconds

        const h = Math.floor(seconds / 3600)
        const hh = h > 0 ? `${padStart(h)}:` : ''
        remaining -= 3600 * h
        
        const m = Math.floor(remaining / 60)
        const mm = `${padStart(m)}:`
        remaining -= 60 * m
        
        const ss = padStart(Math.floor(remaining))
        
        return `${hh}${mm}${ss}`
    }

    function play() {
        sound.play()
        paused = false
    }

    function pause() {
        sound.pause()
        paused = true
    }

    function stop() {
        sound.stop()
        paused = true
    }

    function seek(event) {
        if (!sound) {
            playPause(track)
        }

        sound.seek(parseInt(event.target.value))
        
        if (paused) {
            play()
        }
    }

    onMount(() => {
        setTimeout(() => {
            wrapperY = player.offsetHeight - wrapper.offsetHeight
        }, 100)

        window.setInterval(() => {
            if (sound && sound.playing()) {
                time.ellapsed = sound.seek()
                time.left = sound.duration() - sound.seek()
                progress = sound.seek() / sound.duration()

            }
        }, 500)
    })
</script>

<div class="player" bind:this={player}>
    <svg class="svg-filters">
        <defs>
            <filter id="dropshadow" x="0" y="0" width="200%" height="200%">
                <feOffset result="offOut" in="SourceAlpha" dx="1" dy="1" />
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5"/>
                </feComponentTransfer>
                <feMerge> 
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/> 
                </feMerge>
            </filter>
        </defs>
    </svg>
    <div class="wrapper" bind:this={wrapper}>
        <button class="playpause" style="{playPauseButtonStyle}" on:click={playPause}>
            <svg viewBox="0 0 60 60" width="60" height="60" filter="url(#dropshadow)">
            {#if paused || !playingTrackId}                
                <path d="M18.2874 47.335V12.6651L44.5939 29.9493L18.2874 47.335Z"/>
            {:else}
                <path d="M26.6002 12.4242H16.4615V47.5758H26.6002V12.4242Z"/>
                <path d="M43.5385 12.4242H33.3998V47.5758H43.5385V12.4242Z"/>
            {/if}
            </svg>
        </button>
        <div class="track">
            <div class="header">
                <h2>
                    <b>{track.artist}</b>&nbsp;- {track.title}
                </h2>
            </div>
            <div class="progress">
                <div
                    class="bar"
                    class:paused
                    style="width: {progress * 100}%"
                />
                <input type=range min=0 max={time.ellapsed + time.left} value={time.ellapsed} on:input={seek}/>
            </div>
            <div class="time">
                <div class="ellapsed">{formatTime(time.ellapsed)}</div>
                <div class="left">-{formatTime(time.left)}</div>
            </div>
        </div>
        <div class="actions">
            <!-- <button class="volume">
                <svg viewBox="0 0 24 24" width="24" height="24" filter="url(#dropshadow)">
                    <path d="M3 9V15H7L12 20V4L7 9H3Z"/>
                    <path d="M16.5 12C16.5 10.23 15.5 8.71 14 7.97V16C15.5 15.29 16.5 13.76 16.5 12Z"/>
                    <path d="M14 3.23001V5.29001C16.89 6.15001 19 8.83001 19 12C19 15.17 16.89 17.84 14 18.7V20.77C18 19.86 21 16.28 21 12C21 7.72001 18 4.14001 14 3.23001Z"/>
                </svg>
            </button> -->
            <button class="download">
                <svg viewBox="0 0 24 24" width="24" height="24" filter="url(#dropshadow)">
                    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                </svg>
            </button>
        </div>
    </div>
</div>

<style lang="postcss">
    @import "../styles/_media.pcss";

    .player {
        display: flex;
        align-items: flex-end;
    }

    .svg-filters {
        position: absolute;
    }

    .wrapper {
        display: flex;
        align-items: center;
        width: 100%;        
    }

    button {
        flex-shrink: 0;
        margin: 0;
        padding: 1vh;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: none;
        cursor: pointer;

        svg {
            fill: var(--c-active);
            width: 4vh;
            height: 4vh;
        }
    }

    .playpause {
        position: relative;
        height: 11vh;
        width: 11vh;
        border: none;
        background-size: cover;
        background-repeat: no-repeat;
        z-index: 1;

        &:after {
            content: '';
            width: 0;
            padding-left: 100%;
        }

        svg {
            position: absolute;
            width: 4vh;
            height: 4vh;
            pointer-events: none;
        }
    }

    .track {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-left: 3vh;
    }

    .actions {
        padding: 0 1vh;
    }

    .progress {
        position: relative;
        height: 3vh;
    }

    h2,
    .time {
        font-size: 1.75vh;
        color: white;
        text-shadow: 1px 1px 3px black;
    }

    h2 {
        padding: 0;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 400;
    }

    input[type="range"],
    .bar {
        position: absolute;
        top: 1.25vh;
        left: 0;
        width: 100%;
    }

    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 0.5vh;
        border-radius: 1vh;
        background: rgba(255,255,255, 0.25);
        border: none;
        outline: none;
        cursor: pointer;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 1px;
            height: 2vh;
            background: var(--c-active);
        }

        &::-moz-range-thumb {
            appearance: none;
            width: 1px;
            height: 2vh;
            background: var(--c-active);
        }
    }

    .bar {
        position: relative;
        height: 0.5vh;
        border-radius: 1vh;
        background: var(--c-active);
        background-image: linear-gradient(
            135deg,
            rgba(0,0,0, .25) 25%,
            transparent 25%,
            transparent 50%,
            rgba(0,0,0, .25) 50%,
            rgba(0,0,0, .25) 75%,
            transparent 75%,
            transparent 100%
        );
        background-size: 1vh 1vh;
        background-position: 0 0;
        pointer-events: none;
        z-index: 1;
        
        &:not(.paused) {
            animation: playing 1s linear infinite;
        }

        &:after {
            content: '';
            position: absolute;
            top: calc(50% - 1vh - 2px);
            right: calc(-1vh - 2px);
            width: 2vh;
            height: 2vh;
            border-radius: 50%;
            background: rgba(30,30,30, 0.9);
            border: 2px solid var(--c-active);
        }
    }

    .time {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        font-weight: 600;
        color: white;
        text-shadow: 1px 1px 3px black;
    }
</style>