<script>
  import { createEventDispatcher } from 'svelte'

  export let isActiveTrack = false
  export let isInitialTrigger = false
  export let isClose = false
  export let dir = undefined

  const dispatch = createEventDispatcher()
</script>

<button
  class="meta-button"
  class:trigger={isInitialTrigger}
  class:close={isClose}
  class:active-track={isActiveTrack}
  on:click={() => dispatch('click')}
>
{#if isClose}
  <div class="x"/>
{:else}
  {#if isInitialTrigger}
    i
  {:else}
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      class="arrow"
      class:top={dir === 'top'}
      class:bottom={dir === 'bottom'}
    >
      <path
        d="M14,20H10V11L6.5,14.5L4.08,12.08L12,4.16L19.92,12.08L17.5,14.5L14,11V20Z"
      />
    </svg>
  {/if}
{/if}
</button>

<style language="postcss">
  @import "../styles/_media.pcss";

  .meta-button {
    width: 1.75rem;
    height: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-family: monospace;
    font-size: 1.3rem;
    font-weight: 900;
    cursor: pointer;

    &.top {
      transform: rotate(90deg);
    }

    &.bottom {
      transform: rotate(270deg);
    }

    &.trigger {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 1.75rem;
      height: 1.75rem;
      opacity: 0.5;
    }

    &:not(.trigger) {
      color: rgba(255,255,255, 0.7);
    }

    &:not(.close) {
      color: rgba(255,255,255, 0.8);
      background: rgba(128,128,128, 0.5);
      box-shadow: 0 0.125rem 0.125rem rgba(0,0,0, 0.2);
      border-radius: 0.35rem;

      &:hover {
        opacity: 1;
        color: rgb(255,255,255, 0.8);
        background: var(--ple-c-active);

        &:not(.trigger) {
          color: rgb(255,255,255, 1);
          background: rgba(255,255,255, 0.3);
        }
      }
    }

    &.active-track {
      background: rgba(50,50,50, 0.2);
    }

    &.close {
      position: relative;
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
    }
  }

  .arrow {
    width: 1.25rem;
    height: 1.25rem;
    fill: currentColor;
    transition: transform 0.2s ease-in-out;
    pointer-events: none;

    &.bottom {
      transform: rotate(180deg);
    }
  }
</style>
