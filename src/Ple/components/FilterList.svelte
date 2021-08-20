<script>
  import { createEventDispatcher } from 'svelte'
  export let items = []
  export let title

  const dispatch = createEventDispatcher()

  function filter(value) {
    dispatch('filter', value)
  }
</script>

<ul class="scrollable">
  <li>Filter list by {title}</li>
  {#each items as item}
    <li>
      <label for={item.id}>
        <input
          type="checkbox"
          id={item.id}
          checked={item.checked}
          on:change={() => filter(item.value)}
        >
        {item.value}
      </label>
    </li>
  {/each}
</ul>

<style lang="postcss">
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    border-left: 1px solid rgba(255,255,255, 0.2);
    border-right: 1px solid rgba(255,255,255, 0.2);
    background: rgba(0,0,0, 0.9); 
    overflow: auto;
  }

  li {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255, 0.2);
    background: rgba(128,128,128, 0.2);

    &:first-of-type {
      padding: 0.5rem 1.5rem;
      font-size: 1rem;
      color: rgba(255,255,255, 0.65);
    }
  }

  input[type=checkbox] {
    appearance: none;
    width: 1.2rem;
    height: 1.2rem;
    margin: 0.35rem .35rem 0 0;
    border: 1px solid rgba(255,255,255,.5);
    border-radius: .15rem;
    cursor: pointer;
    opacity: 0.75;

    &:checked {
      border: none;
      background-image: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTE4IDExOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTA3LjI3MSAyOS40NzY4IDEwMC44MzYgMjMuMDQyNCA0MS41NTkgODIuMzE5OSAxNy4xNjM2IDU3LjkyNDUgMTAuNzI5MSA2NC4zNTg5IDQxLjMyNzggOTQuOTU3NiA0MS41NTkgOTQuNzI2NCA0MS43OTAyIDk0Ljk1NzYgMTA3LjI3MSAyOS40NzY4eiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=);
    }
  }

  label {
    display: block;
    width: 100%;
    padding: 1rem 1.5rem 1rem 0.5rem;
    font-size: 1.2rem;
    font-weight: 500;
    color: rgba(255,255,255, 0.85);
    cursor: pointer;
  }
</style>