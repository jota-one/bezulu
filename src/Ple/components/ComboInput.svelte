<script>
    let input = undefined

    export function focus() {
        input.focus()
    }
</script>

<div class="combo-input">
    <input type="text" bind:this={input}>
</div>

<style lang="postcss">
    .combo-input {
        background: rgba(255,255,255, 0.2);
    }

    input {
        padding: 1rem;
        width: 100%;
        font-size: 1.1rem;
        color: white;
        border: none;
        border-radius: 0.5rem;
        background: transparent;
        outline: transparent;
    }
</style>