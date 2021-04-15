<script>
    import Track from './Track.svelte'

    export let tracks = []
</script>

<ul>
    {#each tracks as track}
        <Track {...track}/>
    {/each}
</ul>

<style lang="postcss">
@import "styles/_media.pcss";

ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1px;

    /* grid-template-columns: repeat(2, 50vh);
    grid-auto-rows: minmax(50vh, auto);

    @media (--s) {
        grid-template-columns: repeat(3, 25vh);
        grid-auto-rows: minmax(25vh, auto);
    }

    @media (--m) {
        grid-template-columns: repeat(4, 25vh);
    }

    @media (--l) {
        grid-template-columns: repeat(5, 25vh);
    }

    @media (--xl) {
        grid-template-columns: repeat(6, 25vh);
    } */
}
</style>