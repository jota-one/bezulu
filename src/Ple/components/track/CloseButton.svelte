
<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let isShowCase = false
</script>

<button
  class="meta-button close"
  class:showcase={isShowCase}
  title="close info panel"
  on:click={() => dispatch('click')}
/>

<style language="postcss">
  .close {
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    opacity: 0.5;
    transform: rotate(45deg) scale(0.75);
    transition: all 0.2s ease-in-out;

    &:before,
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: calc(50% - 1px);
      height: 2px;
      background: rgb(255,255,255);
    }

    &:after {
      transform: rotate(90deg);
      transform-origin: center;
    }

    &:hover {
      opacity: 1;
      transform: rotate(135deg) scale(0.75);
    }

    &.showcase {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
</style>
