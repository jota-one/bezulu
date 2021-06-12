<script>
    import VirtualScroller from "../VirtualScroller/VirtualScroller.svelte";
    import Slot from "./Slot.svelte";
    import Track from "./Track.svelte";

    export let tracks = [];

    $: activeTrack = {
        ...tracks.find((track) => track.selected),
        id: "active",
        active: true,
        selected: undefined,
    };

    $: items = [activeTrack, ...tracks];

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
</script>

<VirtualScroller {items} {renderSlot} {renderItem}>
    <ul slot="container" />
</VirtualScroller>

<style lang="postcss">
    @import "styles/_media.pcss";

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1px;

        @media (--s) {
            grid-template-columns: repeat(3, 1fr);
        }

        @media (--m) {
            grid-template-columns: repeat(4, 1fr);
        }

        @media (--l) {
            grid-template-columns: repeat(5, 1fr);
        }

        @media (--xl) {
            grid-template-columns: repeat(6, 1fr);
        }
    }
</style>
