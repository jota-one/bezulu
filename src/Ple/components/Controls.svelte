<script>
  import { createEventDispatcher } from 'svelte'
  import {
    loop,
    nextDisabled,
    nextTrack,
    prevDisabled,
    prevTrack,
    random,
    tracksFilter,
    tracksOrder
  } from '../stores'

  let panelButtons = {
    sort: undefined,
    artists: undefined,
    genres: undefined
  }

  export function getDomPanelButtons() {
    return panelButtons
  }

  export function clearActivePanel() {
    activePanel = ''
  }

  const dispatch = createEventDispatcher()
  let activePanel

  function navigatePrev() {
    dispatch('navigate', $prevTrack)
  }

  function navigateNext() {
    dispatch('navigate', $nextTrack)
  }

  function toggleRandom() {
    $random = !$random
  }

  function toggleLoop() {
    const value = $loop === -1 ? 1 : $loop === 0 ? -1 : 0
    $loop = value
  }

  function togglePanel(key) {
    activePanel = activePanel === key ? '' : key
    dispatch('togglePanel', key)
  }
</script>

<div class="controls scrollable">
  <div class="buttons">
    <!-- <button
      class="button search"
      title="Filter list"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          d="M10.7679 4.26788C12.4918 4.26788 14.1451 4.9527 15.3641 6.17169C16.5831 7.39068 17.2679 9.04398 17.2679 10.7679C17.2679 12.0053 17.0958 12.9228 16.054 14.554C16.054 14.6534 19.7321 18.2321 19.7321 18.2321L18.2321 19.7321L14.554 16.054C13.5126 16.8228 12.0053 17.2679 10.7679 17.2679C9.04398 17.2679 7.39068 16.5831 6.17169 15.3641C4.9527 14.1451 4.26788 12.4918 4.26788 10.7679C4.26788 9.04398 4.9527 7.39068 6.17169 6.17169C7.39068 4.9527 9.04398 4.26788 10.7679 4.26788ZM10.7679 6.26788C8.26788 6.26788 6.26788 8.26788 6.26788 10.7679C6.26788 13.2679 8.26788 15.2679 10.7679 15.2679C13.2679 15.2679 15.2679 13.2679 15.2679 10.7679C15.2679 8.26788 13.2679 6.26788 10.7679 6.26788Z"
        />
      </svg>
    </button> -->
    <button
      class="button next"
      title="Skip to next track"
      disabled={$nextDisabled}
      on:click={navigateNext}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          d="M11.25 13.0588L4.25 18V6L11.25 10.9412V6L19.75 12L11.25 18V13.0588Z"
        />
      </svg>
    </button>
    <button
      class="button previous"
      title="Skip to previous track"
      disabled={$prevDisabled}
      on:click={navigatePrev}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          d="M12.75 13.0588L19.75 18V6L12.75 10.9412V6L4.25 12L12.75 18V13.0588Z"
        />
      </svg>
    </button>
    <button
      class="button loop"
      class:active={$loop !== 0}
      on:click={toggleLoop}
      title="Repeat list"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        {#if $loop !== 1}
          <path d="M10 3L10 11L14 7L10 3Z" />
          <path
            d="M9 18C5.68629 18 3 15.3137 3 12C3 8.68629 5.68629 6 9 6H11L11 8H9C6.79086 8 5 9.79086 5 12C5 14.2091 6.79086 16 9 16H15C17.2091 16 19 14.2091 19 12C19 9.79086 17.2091 8 15 8H14L15 7L14 6L15 6C18.3137 6 21 8.68629 21 12C21 15.3137 18.3137 18 15 18H9Z"
          />
        {:else}
          <path d="M10 3L10 11L14 7L10 3Z" />
          <path
            d="M9 18C5.68629 18 3 15.3137 3 12C3 8.68629 5.68629 6 9 6H11L11 8H9C6.79086 8 5 9.79086 5 12C5 14.2091 6.79086 16 9 16H15C17.2091 16 19 14.2091 19 12H21C21 15.3137 18.3137 18 15 18H9Z"
          />
          <circle cx="19.3504" cy="6.47108" r="4.64958" />
          <path
            d="M19.9964 8.92173H19.1028V5.17688L18.0359 5.53657V4.74659L19.9006 4.02048H19.9964V8.92173Z"
            fill="black"
          />
        {/if}
      </svg>
    </button>
    <button
      class="button random"
      class:active={$random}
      on:click={toggleRandom}
      title="Randomize list"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          d="M21 7L17 4V6H16C13.8197 6 12.5604 7.29874 11.5268 9.04169L11.6443 9.28052C11.7617 9.51932 11.8798 9.75966 12 10C12.1115 10.223 12.2169 10.4366 12.3175 10.6407C12.3784 10.764 12.4375 10.8839 12.4953 11.0004C13.5981 8.77341 14.0572 8 16 8H17V10L21 7ZM17 18V20L21 17L17 14V16H16C13.9745 16 13.4285 14.893 12.3175 12.6407C12.2169 12.4366 12.1115 12.223 12 12C11.8798 11.7597 11.7617 11.5193 11.6443 11.2805C10.2963 8.53857 9.04825 6 6 6H3V8H6C8.02328 8 8.43747 8.83882 9.64523 11.2847C9.75616 11.5094 9.87381 11.7476 10 12C10.1261 12.2522 10.2494 12.5028 10.3711 12.7502C11.7601 15.5743 12.9533 18 16 18H17M6 16C7.91464 16 8.50729 15.0109 9.5047 13.0004L9.64523 13.2847C9.75616 13.5094 9.87381 13.7476 10 14C10.1261 14.2522 10.2494 14.5028 10.3711 14.7502L10.4757 14.9629C9.43631 16.7323 8.20248 18 6 18H3V16H6Z"
        />
      </svg>
    </button>
    <button
      class="button sort"
      title="Sort list"
      class:active={activePanel === 'sort'}
      bind:this={panelButtons.sort}
      on:click={() => togglePanel('sort')}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M14.6792 15.5H11.9792L15.9792 19.5L19.9792 15.5H17.2292V6.5H14.6792V15.5Z"/>
        <path d="M9.32075 8.5L12.0208 8.5L8.02075 4.5L4.02075 8.5L6.77075 8.5L6.77075 17.5L9.32075 17.5L9.32075 8.5Z"/>
      </svg>
    </button>
    <button
      class="button artists"
      title="Filter list by Artists"
      class:active={activePanel === 'artists'}
      data-count-filters={$tracksFilter.artist?.length > 0 ? $tracksFilter.artist?.length : undefined}
      bind:this={panelButtons.artists}
      on:click={() => togglePanel('artists')}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M16.5441 15.4361C16.2399 16.1051 14.5805 17.6797 11.9808 17.6797C9.3712 17.6797 7.782 16.0959 7.44295 15.4361C7.44295 15.4361 6.07296 13.6223 11.9808 13.6223C17.8887 13.6223 16.5441 15.4361 16.5441 15.4361Z"
      />
      <path
        d="M14.1503 8.90581C14.4348 9.33161 14.5866 9.83221 14.5866 10.3443C14.5866 11.031 14.3139 11.6896 13.8283 12.1752C13.3427 12.6608 12.6841 12.9336 11.9974 12.9336C11.4853 12.9336 10.9847 12.7817 10.5589 12.4972C10.1331 12.2127 9.80121 11.8083 9.60524 11.3352C9.40926 10.8621 9.35799 10.3414 9.45789 9.83918C9.5578 9.33692 9.8044 8.87555 10.1665 8.51344C10.5286 8.15133 10.99 7.90473 11.4923 7.80482C11.9945 7.70491 12.5151 7.75619 12.9883 7.95216C13.4614 8.14814 13.8658 8.48001 14.1503 8.90581Z"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 20.4579C16.6712 20.4579 20.4579 16.6712 20.4579 12C20.4579 7.32884 16.6712 3.54211 12 3.54211C7.32884 3.54211 3.54211 7.32884 3.54211 12C3.54211 16.6712 7.32884 20.4579 12 20.4579ZM12 19.2143C15.9843 19.2143 19.2143 15.9843 19.2143 12C19.2143 8.01565 15.9843 4.78571 12 4.78571C8.01563 4.78571 4.78568 8.01565 4.78568 12C4.78568 15.9843 8.01563 19.2143 12 19.2143Z"
      />
      </svg>
    </button>
    <button
      class="button genres"
      title="Filter list by Genres"
      class:active={activePanel === 'genres'}
      data-count-filters={$tracksFilter.genres?.length > 0 ? $tracksFilter.genres?.length : undefined}
      bind:this={panelButtons.genres}
      on:click={() => togglePanel('genres')}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          d="M18.9837 3.13487H21.3576V5.1049H19.7914L15.615 9.28136C15.2505 8.72976 14.7777 8.25695 14.2261 7.89249L18.9837 3.13487ZM11.5075 8.05995C12.5524 8.05995 13.5546 8.47506 14.2935 9.21396C15.0324 9.95287 15.4475 10.955 15.4475 12C15.4475 13.7927 14.236 15.3688 12.4925 15.812V15.9401C12.4925 17.2463 11.9736 18.499 11.05 19.4226C10.1263 20.3462 8.87362 20.8651 7.56741 20.8651C6.2612 20.8651 5.00849 20.3462 4.08485 19.4226C3.16122 18.499 2.64233 17.2463 2.64233 15.9401C2.64233 14.6339 3.16122 13.3811 4.08485 12.4575C5.00849 11.5339 6.2612 11.015 7.56741 11.015H7.69546C8.13872 9.28136 9.70489 8.05995 11.5075 8.05995ZM11.5075 10.5225C11.1156 10.5225 10.7398 10.6782 10.4627 10.9552C10.1856 11.2323 10.0299 11.6081 10.0299 12C10.0299 12.3919 10.1856 12.7677 10.4627 13.0448C10.7398 13.3219 11.1156 13.4775 11.5075 13.4775C11.8993 13.4775 12.2751 13.3219 12.5522 13.0448C12.8293 12.7677 12.985 12.3919 12.985 12C12.985 11.6081 12.8293 11.2323 12.5522 10.9552C12.2751 10.6782 11.8993 10.5225 11.5075 10.5225ZM6.52329 14.2064L5.82393 14.8959L8.61152 17.6835L9.31089 16.9842L6.52329 14.2064Z"
        />
      </svg>
    </button>
    <!-- <button
      class="button albums"
      title="Filter list on Albums"
      class:active={activePanel === 'albums'}
      on:click={() => togglePanel('albums')}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M19.8496 4.15045H4.15045V19.8496H19.8496V4.15045ZM18.5254 5.47468H6.5597V18.5253H18.5254V5.47468Z"
        />
        <circle cx="12.5425" cy="12" r="4.91698" fill-opacity="0.15"/>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.5425 16.917C15.2581 16.917 17.4595 14.7156 17.4595 12C17.4595 9.28444 15.2581 7.08304 12.5425 7.08304C9.82695 7.08304 7.62555 9.28444 7.62555 12C7.62555 14.7156 9.82695 16.917 12.5425 16.917ZM12.5418 15.6257C14.5446 15.6257 16.1681 14.0021 16.1681 11.9993C16.1681 9.99652 14.5446 8.37292 12.5418 8.37292C10.539 8.37292 8.91536 9.99652 8.91536 11.9993C8.91536 14.0021 10.539 15.6257 12.5418 15.6257Z"
        />
        <circle cx="12.5425" cy="12" r="1.33821"/>
      </svg>
    </button>
    <button
      class="button crates"
      title="Choose crate"
      class:active={activePanel === 'crates'}
      on:click={() => togglePanel('crates')}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          d="M17.5438 4.20335L15.1206 4.72354L18.9013 19.6687L21.3245 19.1486L17.5438 4.20335Z"
        />
          <path d="M6.44421 4.23966H8.93233V19.5853H6.44421V4.23966Z" />
          <path d="M10.7825 4.23966H13.2706V19.5853H10.7825V4.23966Z" />
      </svg>
    </button> -->
  </div>
  <button class="button hamburger">
    <span />
    <span />
    <span />
  </button>
</div>

<style lang="postcss">
  @import "../styles/_media.pcss";
  @import "../styles/_size.pcss";
  @import "../styles/_button.pcss";

  .controls {
    position: sticky;
    top: var(--ple-s-player-height);
    height: calc(100vh - var(--ple-s-player-height) - 1px);
    width: var(--ple-s-player-height);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    overflow: auto;
    overflow-x: hidden;
    z-index: 2;
  }

  .controls,
  .buttons {
    background: inherit;
  }

  .buttons,
  .hamburger {
    z-index: 1;
  }

  .buttons {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .button {
    position: relative;
    width: 100%;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    transition: color var(--ple-transition-time) var(--ple-transition-type);

    &[data-count-filters]:after {
      content: attr(data-count-filters);
      position: absolute;
      top: 5px;
      right: 6px;
      padding: 5px;
      min-width: 12px;
      font-size: 11px;
      font-weight: 600;
      color: black;
      background: var(--ple-c-active);
      border-radius: 999px;
    }
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0.5rem;
    display: none;

    span {
      display: block;
      width: 2rem;
      height: 2px;
      margin: 2px 0;
      background: var(--ple-c-inactive);
    }
  }
</style>
