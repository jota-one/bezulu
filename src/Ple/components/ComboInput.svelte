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
        padding: 1vh;
        width: 100%;
        font-size: 1.75vh;
        color: white;
        border: none;
        border-radisu: 0.25vh;
        background: transparent;
        outline: transparent;
    }
</style>