<script>
    import { createEventDispatcher } from 'svelte'
    // import VirtualScroller from "../VirtualScroller/VirtualScroller.svelte";
    import Slot from './Slot.svelte'
    import Track from './Track.svelte'

    export let tracks = []
    export let activeTrack = undefined

    let container = null
    const dispatch = createEventDispatcher()

    $: items = [
        activeTrack,
        ...tracks.map(track => ({ ...track, active: track.id === activeTrack.id }))
    ]

    function renderSlot({ index, container }) {
        new Slot({ target: container });
    }

    function renderItem({ index, container }) {
        const props = items[index];
        new Track({ target: container, props });
    }

    function onClick(event) {
        let slot = event.target

        while (slot.tagName.toLowerCase() !== 'li') {
            slot = slot.parentElement
        }

        if (slot.classList.contains('active')) {
            return
        }

        const selectedTrack = tracks
            .find(track => track.id === slot.firstElementChild.id)
        
        dispatch('navigate', selectedTrack)
    }
</script>

<ul class="grid" bind:this={container} on:click={onClick}>
    {#each items as item}
        <Slot>
            <Track {...item}/>
        </Slot>
    {/each}
</ul>

<!-- <VirtualScroller {items} {renderSlot} {renderItem}>
    <ul slot="container" />
</VirtualScroller> -->

<style lang="postcss">
    @import "../styles/_grid.pcss";

    .grid {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
</style>
