<script lang="ts">
  import { onMount } from "svelte"
  import {
    activeTrackId,
    activeTrack,
    ellapsed,
    filteredTracks,
    showMeta
  } from "../../stores"
  import type { Track } from "../../types"
  import Slot from "./Slot.svelte"
  import TrackComponent from "../track/Track.svelte"

  let { onnavigate, onToggleMeta }: {
    onnavigate?: (track: Track) => void
    onToggleMeta?: (track: Track) => void
  } = $props()

  let container: HTMLUListElement

  let items = $derived([
    { ...$activeTrack, showMeta: $showMeta.includes($activeTrack.id ?? '') },
    ...$filteredTracks.map((track) => ({
      ...track,
      active: track?.id === $activeTrack?.id,
      showMeta: $showMeta.includes(track.id)
    })),
  ])

  function onClick(event: MouseEvent) {
    let slot = event.target as Element | null

    while (slot && !["li", "body"].includes(slot.tagName.toLowerCase())) {
      slot = slot.parentElement
    }

    if (!slot || slot.tagName.toLowerCase() === "body") return

    const selectedTrack = $filteredTracks.find(
      (track) => track.id === slot!.firstElementChild?.id
    )

    if (!selectedTrack) return

    const buttonClasses = (event.target as Element).classList
    const isToggleMeta = buttonClasses.contains('trigger') || buttonClasses.contains('close')

    if (buttonClasses.contains('meta-button') && !isToggleMeta) return

    if ($activeTrackId !== selectedTrack.id) {
      $ellapsed = 0
    }

    if (isToggleMeta) {
      onToggleMeta?.(selectedTrack)
    } else {
      onnavigate?.(selectedTrack)
    }
  }

  onMount(() => {
    container.querySelector("li:first-child")?.classList.add("active")
  })
</script>

<ul bind:this={container} onclick={onClick}>
  {#each items as item}
    <Slot>
      <TrackComponent {...item} />
    </Slot>
  {/each}
</ul>

<style lang="postcss">
  @import "../../styles/_media.pcss";

  ul {
    list-style-type: none;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 0;
    padding: 0;
    width: 100%;
    gap: 1px;

    @media (--xs) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (--xs) and (orientation: landscape) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (--s) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (--s) and (orientation: landscape) {
      grid-template-columns: repeat(5, 1fr);
    }

    @media (--m) {
      grid-template-columns: repeat(5, 1fr);
    }

    @media (--l) {
      grid-template-columns: repeat(6, 1fr);
    }

    @media (--xl) {
      grid-template-columns: repeat(7, 1fr);
    }

    @media (--xl2) {
      grid-template-columns: repeat(8, 1fr);
    }

    @media (--xl3) {
      grid-template-columns: repeat(9, 1fr);
    }

    @media (--xl4) {
      grid-template-columns: repeat(10, 1fr);
    }

    @media (--xl5) {
      grid-template-columns: repeat(11, 1fr);
    }
  }
</style>
