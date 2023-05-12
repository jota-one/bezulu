<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let isShowCase = false
  export let dir = 'top'
</script>

<button
  class="meta-button arrow"
  class:top={dir === 'top'}
  class:bottom={dir === 'bottom'}
  class:showcase={isShowCase}
  title="scroll to next panel"
  on:click={() => dispatch('click')}
>
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path
      d="M12.9971 3.09753H11.0031V18.074L6.34323 13.4142L4.92901 14.8284L12.0001 21.8995L19.0711 14.8284L17.6569 13.4142L12.9971 18.074V3.09753Z"
    />
  </svg>
</button>

<style language="postcss">
  .arrow {
    margin-top: 0.125rem;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    fill: white;
    opacity: 0.5;
    transition: transform 0.2s ease-in-out;

    &.top {
      transform: rotateX(180deg);
    }

    &.showcase {
      width: 2.5rem;
      height: 2.5rem;
    }

    &:hover {
      opacity: 1;
    }

    svg {
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  }
</style>
