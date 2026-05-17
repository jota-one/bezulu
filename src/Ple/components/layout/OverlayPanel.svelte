<script lang="ts">
  import {
    artists,
    genres,
    sortKeys,
    tracksFilter,
    tracksOrder
  } from '../../stores'
  import type { SortKey } from '../../types'
  import FilterList from '../filter/FilterList.svelte'
  import SortList from '../filter/SortList.svelte'

  let visible = $state(false)
  let panelKey = $state('')
  let element: HTMLElement

  export function toggle(what: string) {
    const noToggle = visible && panelKey && panelKey !== what
    panelKey = what

    if (noToggle) return

    setTimeout(() => {
      visible = !visible
    })
  }

  export function close() {
    visible = false
  }

  export function isVisible(): boolean {
    return visible
  }

  export function getDomElement(): HTMLElement {
    return element
  }

  function sort(detail: { item: SortKey; desc: boolean }) {
    $tracksOrder = { key: detail.item.sortKey, desc: detail.desc }
  }

  function filter(key: string, value: string) {
    if ($tracksFilter[key]?.includes(value)) {
      $tracksFilter = {
        ...$tracksFilter,
        [key]: $tracksFilter[key].filter(v => v !== value)
      }
    } else {
      $tracksFilter = {
        ...$tracksFilter,
        [key]: [...($tracksFilter[key] || []), value]
      }
    }
  }
</script>

<aside class:visible bind:this={element}>
  <div class="wrapper">
    <div class="filter">
      {#if panelKey === 'artists'}
        <FilterList items={$artists} title="Artists" onFilter={(v) => filter('artist', v)} />
      {:else if panelKey === 'genres'}
        <FilterList items={$genres} title="Genres" onFilter={(v) => filter('genres', v)} />
      {/if}
      {#if panelKey === 'sort'}
        <SortList items={sortKeys} order={$tracksOrder} onSort={sort} />
      {/if}
    </div>
  </div>
</aside>

<style lang="postcss">
  @import "../../styles/_media.pcss";
  @import "../../styles/_size.pcss";
  @import "../../styles/_color.pcss";

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
    backdrop-filter: blur(0.5rem);
    transform: translateX(-100%);
    transition: transform 0.1s ease-in-out;
    pointer-events: all;

    .visible & {
      transform: translateX(0);
      box-shadow: 0 0 1rem rgba(0,0,0, 0.5);
    }
  }
</style>
