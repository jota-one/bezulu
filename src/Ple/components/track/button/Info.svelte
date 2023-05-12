<script>
  export let isShowCase = false
</script>

<button
  class="meta-button trigger"
  class:showcase={isShowCase}
  title="open info panel"
>
  <img src="/info-button.svg"/>
</button>

<style lang="postcss">
  .trigger {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 1.75rem;
    height: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: 0.35rem;
    color: rgba(255,255,255, 0.8);
    background: rgba(128,128,128, 0.5);
    opacity: 0.5;

    &.showcase {
      top: 1.5rem;
      right: 1.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    &:hover {
      background: var(--ple-c-active);
      opacity: 1;
    }

    img {
      display: block;
      width: 80%;
      height: 80%;
      pointer-events: none;
    }
  }
</style>
