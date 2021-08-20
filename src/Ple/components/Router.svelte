<script>
  import { onMount, createEventDispatcher } from "svelte";

  export let basePath = "";
  export function navigate(trackId) {
    if (trackId === getTrackFromLocation()) {
      return;
    }

    window.history.pushState(null, null, `${basePath}${trackId}`);
  }

  const dispatch = createEventDispatcher();

  function getTrackFromLocation() {
    return window.location.pathname.replace(basePath, "");
  }

  function onPopState(state) {
    dispatch("navigate", getTrackFromLocation());
  }

  onMount(() => {
    dispatch("init", getTrackFromLocation());
  });
</script>

<svelte:window on:popstate={onPopState} />
