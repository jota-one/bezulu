<script>
    export let active = undefined
    export let album = undefined
    export let artist
    export let audioUrl
    export let coverUrl = undefined
    export let dates = {
        added: undefined,
        updated: undefined,
    };
    export let duration
    export let genres = []
    export let id
    export let isPlayer = false
    export let selected = undefined
    export let title
</script>

<div class:active class:selected class:isPlayer {id}>
    {#if active && !isPlayer}
        <div class="meta">
            <h3>{artist}</h3>
            <h4>{title}</h4>
            <h5>{dates.added}</h5>
            <h5>{dates.updated}</h5>
            <ul>
                {#each genres as genre}
                    <li>{genre}</li>
                {/each}
            </ul>
        </div>
    {/if}
    {#if coverUrl}
        <img
            src="{coverUrl.replace('/public', '')}"
            width="100%"
            height="100%"
            loading="lazy"
            alt="{title}"
        />
    {/if}
</div>

<style lang="postcss">
    @import "../styles/_media.pcss";
    @import "../styles/_colors.pcss";

    div {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .meta {
        padding: 1.85vh;
        z-index: 2;
    }

    h3, h4, h5, ul {
        margin: 0.2vh 0;
        padding: 0;
    }

    h3 {
        font-size: 1.7vh;
        font-weight: 600;
    }

    h4 {
        font-size: 2.1vh;
        font-weight: 300;
        opacity: 0.75;
    }

    h5 {
        font-size: 1.2vh;
        margin-top: 1.2vh;
        display: none;
    }

    ul {
        list-style: none;
        display: flex;
        margin-top: 1.5vh;
    }

    li {
        margin-right: 0.6vh;
        padding: .6vh;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3vh;
        font-weight: 500;
        text-transform: uppercase;
        border-radius: 0.5vh;
        border: 1px solid rgba(255,255,255, 0.5);
        background: rgba(0,0,0, 0.2);
    }

    .active:not(.isPlayer) {
        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: var(--c-active);
            opacity: 0.95;
            z-index: 1;
        }
    }
</style>
