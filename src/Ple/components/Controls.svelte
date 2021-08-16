<script>
    import { createEventDispatcher } from 'svelte'
    import {
        loop,
        nextDisabled,
        nextTrack,
        prevDisabled,
        prevTrack,
        random
    } from '../stores'
    import ComboInput from './ComboInput.svelte'
    import Volume from './Volume.svelte'

    const dispatch = createEventDispatcher()
    let asideOpen = false
    let comboInput = undefined

    function navigatePrev() {
        dispatch('navigate', $prevTrack)
    }

    function navigateNext() {
        dispatch('navigate', $nextTrack)
    }

    function toggleRandom() {
        $random = !$random
    }

    function toggleLoop() {
        const value = $loop === -1
            ? 1
            : $loop === 0
                ? -1
                : 0
        
        $loop = value
    }

    function toggleSearch() {
        asideOpen = !asideOpen
        comboInput.focus()
    }
</script>
<div class="controls" class:asideOpen>
    <div class="buttons">
        <button class="search" on:click={toggleSearch}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M10.7679 4.26788C12.4918 4.26788 14.1451 4.9527 15.3641 6.17169C16.5831 7.39068 17.2679 9.04398 17.2679 10.7679C17.2679 12.0053 17.0958 12.9228 16.054 14.554C16.054 14.6534 19.7321 18.2321 19.7321 18.2321L18.2321 19.7321L14.554 16.054C13.5126 16.8228 12.0053 17.2679 10.7679 17.2679C9.04398 17.2679 7.39068 16.5831 6.17169 15.3641C4.9527 14.1451 4.26788 12.4918 4.26788 10.7679C4.26788 9.04398 4.9527 7.39068 6.17169 6.17169C7.39068 4.9527 9.04398 4.26788 10.7679 4.26788ZM10.7679 6.26788C8.26788 6.26788 6.26788 8.26788 6.26788 10.7679C6.26788 13.2679 8.26788 15.2679 10.7679 15.2679C13.2679 15.2679 15.2679 13.2679 15.2679 10.7679C15.2679 8.26788 13.2679 6.26788 10.7679 6.26788Z"/>
            </svg>
        </button>
        <button class="next" disabled={$nextDisabled} on:click={navigateNext}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M11.25 13.0588L4.25 18V6L11.25 10.9412V6L19.75 12L11.25 18V13.0588Z" />
            </svg>
        </button>
        <button class="previous" disabled={$prevDisabled} on:click={navigatePrev}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12.75 13.0588L19.75 18V6L12.75 10.9412V6L4.25 12L12.75 18V13.0588Z" />
            </svg>
        </button>
        <button class="loop" class:active={$loop !== 0} on:click={toggleLoop}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                {#if $loop !== 1}
                <path d="M10 3L10 11L14 7L10 3Z"/>
                <path d="M9 18C5.68629 18 3 15.3137 3 12C3 8.68629 5.68629 6 9 6H11L11 8H9C6.79086 8 5 9.79086 5 12C5 14.2091 6.79086 16 9 16H15C17.2091 16 19 14.2091 19 12C19 9.79086 17.2091 8 15 8H14L15 7L14 6L15 6C18.3137 6 21 8.68629 21 12C21 15.3137 18.3137 18 15 18H9Z"/>
                {:else}
                    <path d="M10 3L10 11L14 7L10 3Z"/>
                    <path d="M9 18C5.68629 18 3 15.3137 3 12C3 8.68629 5.68629 6 9 6H11L11 8H9C6.79086 8 5 9.79086 5 12C5 14.2091 6.79086 16 9 16H15C17.2091 16 19 14.2091 19 12H21C21 15.3137 18.3137 18 15 18H9Z"/>
                    <circle cx="19.3504" cy="6.47108" r="4.64958"/>
                    <path d="M19.9964 8.92173H19.1028V5.17688L18.0359 5.53657V4.74659L19.9006 4.02048H19.9964V8.92173Z" fill="black"/>
                {/if}
            </svg>
        </button>
        <button class="random" class:active={$random} on:click={toggleRandom}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M21 7L17 4V6H16C13.8197 6 12.5604 7.29874 11.5268 9.04169L11.6443 9.28052C11.7617 9.51932 11.8798 9.75966 12 10C12.1115 10.223 12.2169 10.4366 12.3175 10.6407C12.3784 10.764 12.4375 10.8839 12.4953 11.0004C13.5981 8.77341 14.0572 8 16 8H17V10L21 7ZM17 18V20L21 17L17 14V16H16C13.9745 16 13.4285 14.893 12.3175 12.6407C12.2169 12.4366 12.1115 12.223 12 12C11.8798 11.7597 11.7617 11.5193 11.6443 11.2805C10.2963 8.53857 9.04825 6 6 6H3V8H6C8.02328 8 8.43747 8.83882 9.64523 11.2847C9.75616 11.5094 9.87381 11.7476 10 12C10.1261 12.2522 10.2494 12.5028 10.3711 12.7502C11.7601 15.5743 12.9533 18 16 18H17M6 16C7.91464 16 8.50729 15.0109 9.5047 13.0004L9.64523 13.2847C9.75616 13.5094 9.87381 13.7476 10 14C10.1261 14.2522 10.2494 14.5028 10.3711 14.7502L10.4757 14.9629C9.43631 16.7323 8.20248 18 6 18H3V16H6Z"/>
            </svg>
        </button>
        <Volume />
    </div>
    <aside>
        <section>
            <ComboInput bind:this={comboInput}/>
        </section>
    </aside>
    <button class="hamburger">
        <span/>
        <span/>
        <span/>
    </button>
</div>

<style lang="postcss">
    @import "../styles/_media.pcss";
    @import "../styles/_size.pcss";
    @import "../styles/_button.pcss";
    
    .controls {
        position: sticky;
        top: var(--ple-s-player-height);
        height: 100%;
        width: var(--ple-s-player-height);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        z-index: 2;
    }

    .controls,
    .buttons {
        background: inherit;
    }

    .buttons,
    .hamburger {
        z-index: 1;
    }

    .buttons {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    button {
        width: 100%;
        padding-top: 1.75vh;
        padding-bottom: 1.75vh;
        transition: color var(--ple-transition-time) var(--ple-transition-type);
    }

    .hamburger {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 4vh;
        margin-bottom: 1.5vh;
        
        display: none;
        
        span {
            display: block;
            width: 3.5vh;
            height: 0.2vh;
            background: var(--ple-c-inactive);
        }
    }

    aside {
        position: absolute;
        top: calc(0px - var(--ple-s-player-height));
        left: var(--ple-s-player-height);
        bottom: 0;
        padding-top: calc(var(--ple-s-player-height) - 3vh);
        min-width: 50vw;
        font-size: 2vh;
        font-weight: 400;
        color: white;
        transform: translate3d(-100%, 0, 0);
        z-index: 0;
        transition: transform 0.3s ease;
        pointer-events: none;

        .asideOpen & {
            transform: translate3d(0, 0, 0);
        }
    }

    section {
        padding: 3vh;
        background: rgba(255,0,0, 0.95);
        pointer-events: all;
    }
</style>