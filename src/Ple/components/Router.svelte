<script lang="ts">
  import { onMount } from "svelte"

  let { basePath = "", oninit, onnavigate }: {
    basePath?: string
    oninit?: (trackId: string) => void
    onnavigate?: (trackId: string) => void
  } = $props()

  export function navigate(trackId: string) {
    if (trackId === getTrackFromLocation()) return
    window.history.pushState(null, '', `${basePath}${trackId}`)
  }

  function getTrackFromLocation(): string {
    return window.location.pathname.replace(basePath, "")
  }

  function onPopState() {
    onnavigate?.(getTrackFromLocation())
  }

  onMount(() => {
    oninit?.(getTrackFromLocation())
  })
</script>

<svelte:window onpopstate={onPopState} />
