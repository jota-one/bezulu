<script>
  export let isShowCase = false
</script>

<button
  class="meta-button trigger"
  class:showcase={isShowCase}
  title="open info panel"
>
  i
</button>

<style lang="postcss">
  @import "../../styles/_button.pcss";

  .trigger {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    font-family: monospace;
    font-weight: 900;
    font-size: 1.3rem;
    border-radius: 0.35rem;
    color: rgba(255,255,255, 0.8);
    background: rgba(128,128,128, 0.5);
    opacity: 0.5;

    &.showcase {
      top: 1.5rem;
      right: 1.5rem;
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.8rem;
    }

    &:hover {
      background: var(--ple-c-active);
      opacity: 1;
    }
  }
</style>
