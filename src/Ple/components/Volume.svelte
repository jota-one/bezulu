<script>
  import { volume } from "../stores";

  function onInput(event) {
    $volume = event.target.value / 10;
  }

  function toggleVolume () {
    console.log('toggle volume', $volume)
  }
</script>

<div class="volume">
  <button title="Toggle volume" on:click={toggleVolume}>
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      {#if $volume === 0}
        <path
          d="M21.6896 0.66983L0.684814 21.6746L2.3104 23.3002L23.3151 2.29541L21.6896 0.66983Z"
        />
        <path
          d="M14 3.23C14.7738 3.40603 15.5101 3.68197 16.1946 4.04356L14.6988 5.53934C14.4717 5.44433 14.2385 5.36097 14 5.29V3.23Z"
        />
        <path
          d="M19.949 7.78289L18.4516 9.28033C18.8047 10.1166 19 11.0356 19 12C19 15.17 16.89 17.84 14 18.7V20.77C18 19.86 21 16.28 21 12C21 10.4759 20.6196 9.04052 19.949 7.78289Z"
        />
        <path
          d="M16.4448 11.2871L14 13.7319V16C15.5 15.29 16.5 13.76 16.5 12C16.5 11.7572 16.4812 11.5191 16.4448 11.2871Z"
        />
        <path d="M12 3.99996V8.23812L5.23816 15H3V8.99996H7L12 3.99996Z"/>
        <path d="M12 15.7319L9.86598 17.8659L12 20V15.7319Z"/>
      {:else}
        <path d="M3 9V15H7L12 20V4L7 9H3Z" />
        <path
          d="M16.5 12C16.5 10.23 15.5 8.71 14 7.97V16C15.5 15.29 16.5 13.76 16.5 12Z"
        />
        <path
          d="M14 3.23001V5.29001C16.89 6.15001 19 8.83001 19 12C19 15.17 16.89 17.84 14 18.7V20.77C18 19.86 21 16.28 21 12C21 7.72001 18 4.14001 14 3.23001Z"
        />
      {/if}
    </svg>
  </button>
  <input
    type="range"
    min="0"
    max="10"
    value={$volume * 10}
    on:input={onInput}
  />
</div>

<style lang="postcss">
  @import "../styles/_media.pcss";
  @import "../styles/_button.pcss";

  .volume {
    position: relative;
    display: flex;
    align-items: center;
  }

  input {
    -webkit-appearance: none;
    appearance: none;
    padding: 0;
    margin: 0;
    height: 4px;
    width: 10rem;
    border: none;
    border-radius: 6px;
    background: var(--ple-c-min);
    background-image: linear-gradient(
      45deg,
      var(--ple-c-min) 0%,
      var(--ple-c-low) 25%,
      var(--ple-c-default) 50%,
      var(--ple-c-high) 75%,
      var(--ple-c-max) 100%
    );
    cursor: pointer;

    @media (--s) {
      width: 15rem;
    }

    @media (--m) {
      width: 20rem;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      position: relative;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 999px;
      border: 2px solid var(--ple-c-active);
      background: rgb(20, 20, 20);
      transition: border-color var(--ple-transition-time) var(--ple-transition-type);

      @media (--m) {
        width: 1.75rem;
        height: 1.75rem;
      }
    }

    &::-moz-range-thumb {
      appearance: none;
      position: relative;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 999px;
      border: 2px solid var(--ple-c-active);
      background: rgb(20, 20, 20);
      transition: border-color var(--ple-transition-time) var(--ple-transition-type);

      @media (--m) {
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }

  button {
    color: var(--ple-c-active);
    transition: color var(--ple-transition-time) var(--ple-transition-type);
  }
</style>
