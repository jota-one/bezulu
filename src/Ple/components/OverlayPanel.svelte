<script>
  import { artists, genres, tracksFilter } from '../stores'
  import FilterList from './FilterList.svelte'

  let visible = false
  let filterKey
  let element

  export function toggle(what) {
    const noToggle = visible && filterKey && filterKey !== what
    filterKey = what
    
    if (noToggle) {
      return
    }

    setTimeout(() => {
      visible = !visible
    })
  }

  export function close() {
    visible = false
  }

  export function isVisible() {
    return visible
  }

  export function getDomElement() {
    return element
  }

  function filter(key, value) {
    if ($tracksFilter[key]?.includes(value)) {
      $tracksFilter = {
        ...$tracksFilter,
        [key]: $tracksFilter[key].filter(v => v !== value)
      }
    } else {
      $tracksFilter = {
        ...$tracksFilter,
        [key]: [
          ...($tracksFilter[key] || []),
          ...[value]
        ]
      }
    }
  }

  function filterArtists(event) {
    filter('artist', event.detail)
  }

  function filterGenres(event) {
    filter('genres', event.detail)
  }
</script>

<aside class:visible bind:this={element}>
  <div class="wrapper">
    <div class="filter">
    {#if filterKey === 'artists'}
      <FilterList items={$artists} title="Artists" on:filter={filterArtists} />
    {:else if filterKey === 'genres'}
      <FilterList items={$genres} title="Genres" on:filter={filterGenres} />
    {/if}
    </div>
  </div>
</aside>

<style lang="postcss">
  @import "../styles/_media.pcss";
  @import "../styles/_size.pcss";
  @import "../styles/_color.pcss";

  aside {
    position: fixed;
    top: 0;
    width: calc(var(--ple-s-max-width) - var(--ple-s-player-height));
    height: 100%;
    overflow: hidden;
    z-index: 4;
    pointer-events: none;
  }

  .wrapper {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    padding-top: calc(var(--ple-s-player-height) / 1.5);
    color: white;
    font-weight: 500;
    font-size: 1.2rem;
  }

  .filter {
    display: inline-flex;
    flex-direction: column;
    height: 100%;
    min-width: 20rem;
    transform: translateX(-100%);
    transition: transform 0.2s linear;
    pointer-events: all;

    .visible & {
      transform: translateX(0);
    }
  }
</style>