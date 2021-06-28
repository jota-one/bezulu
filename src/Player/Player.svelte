<script>
    import { Howl, Howler } from 'howler'
    import { onMount } from 'svelte'

    export let track = undefined
    export function playPause() {
        if (sound) {
            if (playingTrackId === track.id) {
                if (paused) {
                    sound.play()
                    paused = false
                } else {
                    sound.pause()
                    paused = true
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

        sound.play()
        sound.once('load', () => {
            time.left = sound.duration()
        })
        
        paused = false
        playingTrackId = track.id
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

    $: buttonStyle = track ? `background-image:url(${track.coverUrl})` : ''

    function toggleFixed() {
        if (window.scrollY >= wrapperY) {
            wrapper.classList.add('fixed')
        } else {
            wrapper.classList.remove('fixed')
        }
    }

    function seek(event) {
        if (!sound) {
            playPause(track)
        }

        progress = event.target.value / event.target.max
        
        sound.seek(progress * sound.duration())
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

    onMount(() => {
        setTimeout(() => {
            wrapperY = player.offsetHeight - wrapper.offsetHeight
        }, 100)

        window.setInterval(() => {
            if (sound && sound.playing()) {
                progress = sound.seek() / sound.duration()
                time.ellapsed = sound.seek()
                time.left = sound.duration() - sound.seek()
            }
        }, 500)
    })
</script>

<div class="player" bind:this={player}>
    <div class="wrapper" bind:this={wrapper}>
        <button class="playpause" style="{buttonStyle}"></button>
        <div class="progress">
            <div class="title">
                <b>{track.artist}</b>&nbsp;- {track.title}
            </div>
            <div
                class="bar"
                class:paused
                style="clip-path: polygon(0 0, {progress * 100}% 0, {progress * 100}% 100%, 0% 100%);"
            />
            <input type=range min=0 max=1000 value={progress * 1000} on:input={seek}/>
            {#if time.left > 0}
            <div class="time">
                <div class="ellapsed">{formatTime(time.ellapsed)}</div>
                <div class="left">-{formatTime(time.left)}</div>
            </div>
            {/if}
        </div>
        <button class="volume"></button>
        <button class="download"></button>
    </div>
</div>

<svelte:window on:scroll={toggleFixed} />

<style lang="postcss">
    @import "styles/_media.pcss";

    .player {
        position: absolute;
        top: 0;
        min-width: 320px;
        max-width: 100%;
        width: 100%;
        display: flex;
        align-items: flex-end;
        pointer-events: none;
        z-index: 3;

        @media (--s) {
            width: 75vh;
        }

        @media (--m) {
            left: calc(50% - 50vh);
        }

        @media (--l) {
            left: calc(50% - 62.5vh);
        }

        @media (--xl) {
            left: calc(50% - 75vh);
        }

        &:after {
            content: '';
            height: 0;
            padding-bottom: 100%;
        }
    }

    .wrapper {
        position: absolute;
        display: flex;
        align-items: center;
        width: 100%;
        pointer-events: all;
        background-image: linear-gradient(transparent, rgba(0,0,0, 0.75) 100%);

        :global &.fixed {
            position: fixed;
            top: 0;
            background-image: linear-gradient(rgba(0,0,0, 0.75), transparent 100%);

            @media (--s) {
                width: 75vh;
            }

            @media (--m) {
                left: calc(50% - 50vh);
            }

            @media (--l) {
                left: calc(50% - 62.5vh);
            }

            @media (--xl) {
                left: calc(50% - 75vh);
            }
        }
    }

    .playpause {
        margin: 2vh;
        width: 7vh;
        height: 7vh;
        border: none;
        border-radius: 50%;
        border: 0.4vh solid var(--c-default);
        background-size: cover;
        background-repeat: no-repeat;
        box-shadow: 0 0 1vh rgba(0,0,0, 0.5);
    }

    .progress {
        position: relative;
        flex: 1;
        margin: 0 2vh 0 1vh;
        display: flex;
        align-items: center;
    }

    input[type="range"] {
        appearance: none;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 1.8vh;
        border-radius: 1vh;
        background: rgba(0,0,0, 0.5);
        border: 2px solid rgba(200,200,200, 0.2);
        outline: none;
        box-shadow: 0 0 0.5vh rgba(0,0,0, 0.3);

        &::-webkit-slider-thumb {
            position: relative;
            appearance: none;
            width: 2.75vh;
            height: 2.75vh;
            border: 2px solid var(--c-default);
            background: rgb(30,30,30);
            border-radius: 50%;
            z-index: 1;
        }

        &::-moz-range-thumb {
            position: relative;
            appearance: none;
            width: 2.75vh;
            height: 2.75vh;
            border: 2px solid var(--c-default);
            background: rgb(30,30,30);
            border-radius: 50%;
            z-index: 1;
        }
    }

    .bar {
        position: absolute;
        width: 100%;
        height: 1.8vh;
        border-radius: 1vh;
        background: var(--c-default);
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
        
        &:not(.paused) {
            animation: playing 1s linear infinite;
        }
    }

    .title,
    .time {
        font-size: 1.75vh;
        color: white;
        text-shadow: 1px 1px 3px black;

        @media (--s) {
            font-size: 1.5vh;
        }
    }

    .title {
        position: absolute;
        top: -3vh;
        width: 100%;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 400;
        z-index: 1;


        @media (--s) {
            top: -2.875vh;
        }
    }

    .time {
        position: absolute;
        bottom: -3.25vh;
        width: calc(100% - 0.5vh);
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        font-weight: 600;
        color: white;
        text-shadow: 1px 1px 3px black;
        z-index: 1;

        @media (--s) {
            bottom: -2.875vh;
        }
    }
</style>