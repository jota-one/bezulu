<script>
    export let id;
    export let active = undefined;
    export let selected = undefined;
    export let artist;
    export let title;
    export let duration;
    export let albumId = undefined;
    export let dates = {
        added: undefined,
        updated: undefined,
    };
    export let coverUrl = undefined;
    export let audioUrl;
</script>

<div class:active class:selected {id}>
    <div />
</div>

<style lang="postcss">
    @import "styles/_media.pcss";
    div {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        &.selected {
            background: rgb(80, 80, 80);
        }

        &:after {
            content: attr(id);
            position: absolute;
            bottom: 0;
            right: 0;
            padding: 0.5rem;
            font-size: 1.5vh;
            opacity: 0.5;
        }
    }
</style>
