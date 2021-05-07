<li>
    <slot/>
</li>

<style lang="postcss">
@import "styles/_media.pcss";

li {
    position: relative;
    margin: 0;
    cursor: pointer;
    color: white;
    background: rgb(50,50,50);

    &.active {
        grid-column-start: 1;
        grid-column-end: span 2;
        grid-row-start: 1;
        grid-row-end: span 2;

        @media (--s) {
            grid-column-end: span 3;
            grid-row-end: span 3;
        }
    }

    &:before {
        content: '';
        display: block;
        padding-bottom: 100%;
    }
}
</style>