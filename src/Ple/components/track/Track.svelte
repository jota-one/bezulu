<script>
  import { createEventDispatcher } from 'svelte'
  import { error } from '../../stores'

  import InfoButton from './button/Info.svelte'
  import TrackMeta from './Meta.svelte'

  const dispatch = createEventDispatcher()

  export let active = undefined
  export let album = undefined
  export let artist = undefined
  export let audioUrl = undefined
  export let coverUrl = undefined
  export let thumbnailUrl = undefined
  export let dates = {
    added: undefined,
    released: undefined,
    updated: undefined,
  }
  export let downloadable = false
  export let duration = undefined
  export let genres = []
  export let id = undefined
  export let isShowcase = false
  export let selected = undefined
  export let title = undefined
  export let isNew = false
  export let showMeta = false
</script>

<div {id} class:active class:selected class:new={isNew} class:error={$error}>
  {#if active || showMeta}
    <TrackMeta
      {album}
      {artist}
      {audioUrl}
      {dates}
      {duration}
      {error}
      {genres}
      {title}
      {downloadable}
      isShowCase={isShowcase}
      isActive={active}
    />
  {/if}
  {#if coverUrl}
    {#if !isShowcase}
      <InfoButton/>
    {/if}
    <img
      src={(isShowcase ? coverUrl : thumbnailUrl).replace("/public", "")}
      width="100%"
      height="100%"
      loading="lazy"
      alt={title}
    />
  {/if}
  {#if isShowcase}
    {#if !id}
      <div class="message">Track not found...</div>
    {/if}
    {#if $error}
      <div class="message">
        {$error}
      </div>
    {/if}
    <InfoButton isShowCase/>
  {/if}
</div>

<style lang="postcss">
  @import "../../styles/_media.pcss";
  @import "../../styles/_color.pcss";
  @import "../../styles/_button.pcss";

  div {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;

    &.active,
    .error {
      img {
        filter: grayscale(1);
      }
    }

    &.new:after {
      content: "new";
      position: absolute;
      top: 0;
      left: 0;
      width: 6rem;
      height: 6rem;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      color: black;
      background: yellow;
      transform-origin: 0 0;
      transform: rotate(-45deg) translate3d(-3rem, -3.5rem, 0);
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
    }
  }

  /* .actions {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
  }

  .button {
    width: 6rem;
    height: 6rem;
    padding: 0;
    transition: color var(--ple-transition-time) var(--ple-transition-type);

    svg {
      width: 2.25rem;
      height: 2.25rem;

      @media (--m) {
        width: 2.75rem;
        height: 2.75rem;
      }
    }
  }

  .meta-button {
    font-family: monospace;
    font-size: 2rem;
    font-weight: 900;
    color: var(--ple-c-active);
    cursor: pointer;
  } */

  .message {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    font-weight: 500;
    color: rgb(200, 200, 200);
    background: rgba(80, 80, 80, 0.85);

    @media (--m) {
      font-size: 1.5rem;
    }
  }
</style>
