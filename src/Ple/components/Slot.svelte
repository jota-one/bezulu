<li>
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

        &:before {
            content: "";
            display: block;
            padding-bottom: 100%;
        }
    }
</style>
