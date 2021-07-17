<script>
    import { onMount, createEventDispatcher } from 'svelte'
    // import VirtualScroller from "../VirtualScroller/VirtualScroller.svelte";
    import Slot from './Slot.svelte'
    import Track from './Track.svelte'

    export let tracks = []
    export let activeTrack = undefined

    let container = null
    const dispatch = createEventDispatcher()

    $: items = [
        activeTrack,
        ...tracks.map(track => ({ ...track, active: track.id === activeTrack?.id }))
    ]

    function renderSlot({ index, container }) {
        new Slot({ target: container });
    }

    function renderItem({ index, container }) {
        const props = items[index];
        new Track({ target: container, props });

        if (props.active) {
            container.classList.add("active");
        } else {
            container.classList.remove("active");
        }
    }

    function onClick(event) {
        let slot = event.target

        while (slot.tagName.toLowerCase() !== 'li') {
            slot = slot.parentElement
        }

        const selectedTrack = tracks
            .find(track => track.id === slot.firstElementChild.id)
        
        dispatch('navigate', selectedTrack)
    }

    onMount(() => {
        container.querySelector('li:first-child').classList.add('active')
    })
</script>

<ul bind:this={container} on:click={onClick}>
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
    @import "../styles/_media.pcss";

    ul {
        list-style-type: none;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        margin: 0;
        padding: 0;
        width: 100%;
        gap: 1px;

        @media (--v65) {
            grid-template-columns: repeat(3, 1fr);
        }

        @media (--v75) {
            grid-template-columns: repeat(4, 1fr);
        }

        @media (--square) {
            grid-template-columns: repeat(5, 1fr);
        }

        @media (--h125) {
            grid-template-columns: repeat(6, 1fr);
        }

        @media (--h150) {
            grid-template-columns: repeat(7, 1fr);
        }

        @media (--h200) {
            grid-template-columns: repeat(8, 1fr);
        }

        @media (--h225) {
            grid-template-columns: repeat(9, 1fr);
        }

        @media (--h250) {
            grid-template-columns: repeat(10, 1fr);
        }

        @media (--h275) {
            grid-template-columns: repeat(11, 1fr);
        }

        @media (--h300) {
            grid-template-columns: repeat(12, 1fr);
        }
    }
</style>
