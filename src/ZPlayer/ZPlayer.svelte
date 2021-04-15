<script>
    import Grid from './Grid.svelte'
    
    export let tracks = []
</script>

<div class="zplayer">
    <Grid {tracks} />
</div>

<style global lang="postcss">
@import "styles/_media.pcss";

.zplayer {
    margin: 0 auto;
    height: 100vh;
    min-width: 320px;

    /* @media (--s) {
        max-width: 75vh;
    }

    @media (--m) {
        max-width: 100vh;
    }

    @media (--l) {
        max-width: 125vh;
    }

    @media (--xl) {
        max-width: 150vh;
    } */
}
</style>