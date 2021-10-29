<script>
  import { createEventDispatcher } from 'svelte'
  export let items = []
  export let order = {}

  const dispatch = createEventDispatcher()

  $: direction = Object.keys(order).length
    ? order.desc ? 'asc' : 'desc'
    : 'asc'

  function sort(item, desc) {
    dispatch('sort', { item, desc })
  }
</script>

<ul class="scrollable">
  <li>Sort list by:</li>
  {#each items as item}
    <li>
      <label for={`${item.id}.${direction}`}>
        <input
          type="radio"
          aria-label="Sort list by {item.id}, ascending"
          id={`${item.id}.asc`}
          name="sort"
          checked={item.sortKey === order.key && !order.desc}
          on:change={() => sort(item, false)}
        >
        <input
          type="radio"
          aria-label="Sort list by {item.id}, descending"
          id={`${item.id}.desc`}
          name="sort"
          checked={item.sortKey === order.key && order.desc}
          on:change={() => sort(item, true)}
        >
        {item.value}
        {#if item.sortKey === order.key}
          <div class="direction">
            {order.desc ? '(Descending)' : '(Ascending)'}
          </div>
        {/if}
      </label>
    </li>
  {/each}
</ul>

<style lang="postcss">
  @import "../styles/optionlist.pcss";

  input[type=radio] {
    pointer-events: none;
    appearance: none;
    width: 2rem;
    height: 2rem;
    background-size: 2rem;
    opacity: 0.35;
    transition: opacity 0.15s ease;

    &:checked {
      opacity: 1;
    }

    &[id$="asc"] {
      margin-right: -1.75rem;
      background-position: -1rem 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.6792 15.5H11.9792L15.9792 19.5L19.9792 15.5H17.2292V6.5H14.6792V15.5Z' fill='white' %3E%3C/path%3E%3C/svg%3E");
    }

    &[id$="desc"] {
      margin-right: -0.25rem;
      background-position: 0 0.1rem;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.32075 8.5L12.0208 8.5L8.02075 4.5L4.02075 8.5L6.77075 8.5L6.77075 17.5L9.32075 17.5L9.32075 8.5Z' fill='white' %3E%3C/path%3E%3C/svg%3E");
    }
  }

  .direction {
    padding-left: 0.5rem;
    font-size: 0.9rem;
    opacity: 0.7;
  }
</style>