<script>
  import { createEventDispatcher } from 'svelte'
  import {
    loop,
    nextDisabled,
    nextTrack,
    prevDisabled,
    prevTrack,
    random,
  } from '../stores'

  const dispatch = createEventDispatcher()
  let asideOpen = false

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

  function toggleSearchFilter() {
    dispatch('toggleFilter', 'search')
  }

  function toggleArtistsFilter() {
    dispatch('toggleFilter', 'artists')
  }

  function toggleGenresFilter() {
    dispatch('toggleFilter', 'genres')
  }

  function toggleAlbumsFilter() {
    dispatch('toggleFilter', 'albums')
  }

  function toggleCratesFilter() {
    dispatch('toggleFilter', 'crates')
  }
</script>

<div class="controls" class:asideOpen>
  <div class="buttons">
    <!-- <button
      class="search"
      on:click={toggleSearchFilter}
      title="Filter list"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          d="M10.7679 4.26788C12.4918 4.26788 14.1451 4.9527 15.3641 6.17169C16.5831 7.39068 17.2679 9.04398 17.2679 10.7679C17.2679 12.0053 17.0958 12.9228 16.054 14.554C16.054 14.6534 19.7321 18.2321 19.7321 18.2321L18.2321 19.7321L14.554 16.054C13.5126 16.8228 12.0053 17.2679 10.7679 17.2679C9.04398 17.2679 7.39068 16.5831 6.17169 15.3641C4.9527 14.1451 4.26788 12.4918 4.26788 10.7679C4.26788 9.04398 4.9527 7.39068 6.17169 6.17169C7.39068 4.9527 9.04398 4.26788 10.7679 4.26788ZM10.7679 6.26788C8.26788 6.26788 6.26788 8.26788 6.26788 10.7679C6.26788 13.2679 8.26788 15.2679 10.7679 15.2679C13.2679 15.2679 15.2679 13.2679 15.2679 10.7679C15.2679 8.26788 13.2679 6.26788 10.7679 6.26788Z"
        />
      </svg>
    </button> -->
    <button
      class="next"
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
      class="previous"
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
      class="loop"
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
      class="random"
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
      class="artists"
      title="Filter list on Artists"
      on:click={toggleArtistsFilter}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          d="M17.3873 16.0573C17.0268 16.85 15.0607 18.7157 11.9804 18.7157C8.88839 18.7157 7.00541 16.8391 6.60369 16.0573C6.60369 16.0573 4.98044 13.9083 11.9804 13.9083C18.9804 13.9083 17.3873 16.0573 17.3873 16.0573Z"
        />
        <path
          d="M14.5509 8.31989C14.888 8.8244 15.0679 9.41755 15.0679 10.0243C15.0679 10.838 14.7447 11.6183 14.1694 12.1937C13.594 12.769 12.8137 13.0922 12 13.0922C11.3933 13.0922 10.8001 12.9123 10.2956 12.5752C9.79108 12.2381 9.39786 11.7589 9.16566 11.1984C8.93346 10.6378 8.8727 10.0209 8.99108 9.4258C9.10945 8.83069 9.40164 8.28404 9.8307 7.85499C10.2598 7.42594 10.8064 7.13375 11.4015 7.01537C11.9966 6.897 12.6135 6.95775 13.1741 7.18995C13.7346 7.42215 14.2138 7.81537 14.5509 8.31989Z"/>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.0031 22.0075C17.5378 22.0075 22.0245 17.5207 22.0245 11.9861C22.0245 6.45139 17.5378 1.96466 12.0031 1.96466C6.46848 1.96466 1.98175 6.45139 1.98175 11.9861C1.98175 17.5207 6.46848 22.0075 12.0031 22.0075ZM12.0031 20.534C16.724 20.534 20.551 16.7069 20.551 11.9861C20.551 7.26517 16.724 3.43814 12.0031 3.43814C7.28223 3.43814 3.4552 7.26517 3.4552 11.9861C3.4552 16.7069 7.28223 20.534 12.0031 20.534Z"
          />
      </svg>
    </button>
    <button
      class="genres"
      title="Filter list on Genres"
      on:click={toggleGenresFilter}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          d="M19.59 3H22V5H20.41L16.17 9.24C15.8 8.68 15.32 8.2 14.76 7.83L19.59 3ZM12 8C13.0609 8 14.0783 8.42143 14.8284 9.17157C15.5786 9.92172 16 10.9391 16 12C16 13.82 14.77 15.42 13 15.87V16C13 17.3261 12.4732 18.5979 11.5355 19.5355C10.5979 20.4732 9.32608 21 8 21C6.67392 21 5.40215 20.4732 4.46447 19.5355C3.52678 18.5979 3 17.3261 3 16C3 14.6739 3.52678 13.4021 4.46447 12.4645C5.40215 11.5268 6.67392 11 8 11H8.13C8.58 9.24 10.17 8 12 8ZM12 10.5C11.6022 10.5 11.2206 10.658 10.9393 10.9393C10.658 11.2206 10.5 11.6022 10.5 12C10.5 12.3978 10.658 12.7794 10.9393 13.0607C11.2206 13.342 11.6022 13.5 12 13.5C12.3978 13.5 12.7794 13.342 13.0607 13.0607C13.342 12.7794 13.5 12.3978 13.5 12C13.5 11.6022 13.342 11.2206 13.0607 10.9393C12.7794 10.658 12.3978 10.5 12 10.5ZM6.94 14.24L6.23 14.94L9.06 17.77L9.77 17.06L6.94 14.24Z"
        />
      </svg>
    </button>
    <!-- <button
      class="albums"
      title="Filter list on Albums"
      on:click={toggleAlbumsFilter}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22.0634 1.93658H1.93658V22.0634H22.0634V1.93658ZM20.3658 3.63428H5.02533V20.3657H20.3658V3.63428Z"
        />
        <circle cx="12.7886" cy="12" r="6.61951" fill-opacity="0.15"/>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.7886 18.6195C16.4444 18.6195 19.4081 15.6559 19.4081 12C19.4081 8.34415 16.4444 5.38049 12.7886 5.38049C9.13272 5.38049 6.16907 8.34415 6.16907 12C6.16907 15.6559 9.13272 18.6195 12.7886 18.6195ZM12.7886 16.8821C15.4849 16.8821 17.6707 14.6963 17.6707 12C17.6707 9.30372 15.4849 7.11795 12.7886 7.11795C10.0923 7.11795 7.90654 9.30372 7.90654 12C7.90654 14.6963 10.0923 16.8821 12.7886 16.8821Z"
        />
        <circle cx="12.7886" cy="12" r="1.80158"/>
      </svg>
    </button>
    <button
      class="crates"
      title="Choose crate"
      on:click={toggleCratesFilter}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path
          d="M15.5438 3.60582L13.1206 4.1705L16.9013 20.3942L19.3245 19.8295L15.5438 3.60582Z"
        />
        <path
          d="M15.5438 3.60582L13.1206 4.1705L16.9013 20.3942L19.3245 19.8295L15.5438 3.60582Z"
        />
        <path
          d="M15.5438 3.60582L13.1206 4.1705L16.9013 20.3942L19.3245 19.8295L15.5438 3.60582Z"
        />
        <path
          d="M15.5438 3.60582L13.1206 4.1705L16.9013 20.3942L19.3245 19.8295L15.5438 3.60582Z"
        />
        <path d="M4.44421 3.64524H6.93233V20.3036H4.44421V3.64524Z"/>
        <path d="M4.44421 3.64524H6.93233V20.3036H4.44421V3.64524Z"/>
        <path d="M4.44421 3.64524H6.93233V20.3036H4.44421V3.64524Z"/>
        <path d="M4.44421 3.64524H6.93233V20.3036H4.44421V3.64524Z"/>
        <path d="M8.78253 3.64524H11.2706V20.3036H8.78253V3.64524Z"/>
        <path d="M8.78253 3.64524H11.2706V20.3036H8.78253V3.64524Z"/>
        <path d="M8.78253 3.64524H11.2706V20.3036H8.78253V3.64524Z"/>
        <path d="M8.78253 3.64524H11.2706V20.3036H8.78253V3.64524Z"/>
      </svg>
    </button> -->
  </div>
  <button class="hamburger">
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
    height: calc(100vh - var(--ple-s-player-height));
    width: var(--ple-s-player-height);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    overflow: auto;
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

  button {
    width: 100%;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    transition: color var(--ple-transition-time) var(--ple-transition-type);
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
