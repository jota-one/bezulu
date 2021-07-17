<script>
    import { volume } from '../stores'

    function onInput(event) {
        $volume = event.target.value / 10
    }
</script>

<div class="volume">
    <input type=range min=0 max=10 value={$volume * 10}
        on:input={onInput}
    />
    <button>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M3 9V15H7L12 20V4L7 9H3Z"/>
            <path d="M16.5 12C16.5 10.23 15.5 8.71 14 7.97V16C15.5 15.29 16.5 13.76 16.5 12Z"/>
            <path d="M14 3.23001V5.29001C16.89 6.15001 19 8.83001 19 12C19 15.17 16.89 17.84 14 18.7V20.77C18 19.86 21 16.28 21 12C21 7.72001 18 4.14001 14 3.23001Z"/>
        </svg>
    </button>
</div>

<style lang="postcss">
    @import '../styles/_button.pcss';

    .volume {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 27vh;
        width: 100%;
    }

    input {
        -webkit-appearance: none;
        appearance: none;
        position: absolute;
        top: 0;
        padding: 0;
        margin: 0;
        height: 3px;
        width: 20vh;
        border: none;
        background: var(--ple-c-min);
        background-image: linear-gradient(
            45deg,
            var(--ple-c-min) 0%,
            var(--ple-c-low) 25%,
            var(--ple-c-default) 50%,
            var(--ple-c-high) 75%,
            var(--ple-c-max) 100%
        );
        transform: rotate(-90deg) translateX(-12vh);
        cursor: pointer;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            position: relative;
            top: 0;
            width: 2.5vh;
            height: 2.5vh;
            border-radius: 50%;
            border: 2px solid var(--ple-c-active);
            background: rgb(20,20,20);
            transition: border-color var(--ple-transition-time) var(--ple-transition-type);
        }

        &::-moz-range-thumb {
            appearance: none;
            position: relative;
            top: 0;
            width: 3px;
            height: 3vh;
            width: 2.5vh;
            height: 2.5vh;
            border-radius: 50%;
            border: 2px solid var(--ple-c-active);
            background: rgb(20,20,20);
            transition: border-color var(--ple-transition-time) var(--ple-transition-type);
        }
    }

    button {
        position: absolute;
        bottom: 0;
        color: var(--ple-c-active);
        transition: color var(--ple-transition-time) var(--ple-transition-type);

        svg {
            width: 2.5vh;
            height: 2.5vh;
        }
    }
</style>