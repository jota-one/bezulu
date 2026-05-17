<script lang="ts">
  import type { Snippet } from 'svelte'

  let { children }: { children?: Snippet } = $props()
</script>

<li>
  {@render children?.()}
</li>

<style lang="postcss">
  @import "../../styles/_media.pcss";

  li {
    position: relative;
    margin: 0;
    color: white;
    background: rgba(50, 50, 50, 0.5);
    cursor: pointer;

    &:global(.active) {
      grid-column-end: span 2;
      grid-row-end: span 2;

      @media (--xs) {
        grid-column-end: span 3;
        grid-row-end: span 3;
      }

      @media (--xl2) {
        grid-column-end: span 4;
        grid-row-end: span 4;
      }
    }

    &:before {
      content: "";
      display: block;
      padding-bottom: 100%;
    }
  }
</style>
