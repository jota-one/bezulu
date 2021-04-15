<script>
    export let id
    export let artist
    export let title
    export let duration
    export let albumId
    export let dates = { added, updated }
    export let coverUrl
    export let audioUrl
</script>

<li>
    {artist} - {title}
</li>

<style lang="postcss">
li {
    margin: 0;
    cursor: pointer;
    color: white;
    background: rgb(50,50,50);

    &:before {
        content: '';
        display: block;
        padding-bottom: 100%;
    }
}
</style>