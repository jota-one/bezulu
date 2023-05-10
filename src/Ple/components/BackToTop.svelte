<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
</script>

<button
  class="active"
  title="Scroll to top of page"
  on:click={() => dispatch('scrollTop')}
>
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    filter="url(#dropshadow)"
  >
    <path
      d="M14,20H10V11L6.5,14.5L4.08,12.08L12,4.16L19.92,12.08L17.5,14.5L14,11V20Z"
    />
  </svg>
</button>
