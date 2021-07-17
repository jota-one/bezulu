<script>
    const active = false;
</script>

<li class:active>
    <slot />
</li>

<style lang="postcss">
    @import "../styles/_media.pcss";

    li {
        position: relative;
        margin: 0;
        color: white;
        background: rgb(50, 50, 50);
        cursor: pointer;

        &.active {
            grid-column-end: span 2;
            grid-row-end: span 2;

            @media (--v65) {
                grid-column-end: span 3;
                grid-row-end: span 3;
            }
        }

        &:before {
            content: "";
            display: block;
            padding-bottom: 100%;
        }
    }
</style>
