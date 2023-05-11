<script>
  import { createEventDispatcher } from 'svelte'
  import { error } from '../stores'

  import TrackMetaButton from './TrackMetaButton.svelte'
  import TrackMeta from './TrackMeta.svelte'

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
      {dates}
      {duration}
      {genres}
      {title}
      isShowCase={isShowcase}
      isActive={active}
    />
  {/if}
  {#if coverUrl}
    {#if !isShowcase}
      <TrackMetaButton isInitialTrigger/>
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
    <div class="actions">
      <button class="button meta-button trigger" on:click={() => dispatch('toggleMeta')}>
        i
      </button>
      {#if downloadable}
        <a
          class="button download"
          class:active={Boolean(!$error)}
          class:disabled={Boolean($error)}
          target="_blank"
          rel="noopener"
          title="Download {title}"
          aria-label="Download {title}"
          href={audioUrl}
          on:click={(e) => e.stopPropagation()}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            filter="url(#dropshadow)"
          >
            <path d="M10.7 19.5H8L12 23.5L16 19.5H13.25V11.5H10.7V19.5Z" />
            <path
              d="M24 13C24 10.36 21.95 8.22 19.35 8.04C18.67 4.59 15.64 2 12 2C9.11 2 6.6 3.64 5.35 6.04C2.34 6.36 0 8.91 0 12C0 13.5913 0.632141 15.1174 1.75736 16.2426C2.88258 17.3679 4.4087 18 6 18H9V16H6C4.93913 16 3.92172 15.5786 3.17157 14.8284C2.42143 14.0783 2 13.0609 2 12C2 9.95 3.53 8.24 5.56 8.03L6.63 7.92L7.13 6.97C8.08 5.14 9.94 4 12 4C14.62 4 16.88 5.86 17.39 8.43L17.69 9.93L19.22 10.04C20.78 10.14 22 11.45 22 13C22 13.7956 21.6839 14.5587 21.1213 15.1213C20.5587 15.6839 19.7956 16 19 16H15V18H19C19.6566 18 20.3068 17.8707 20.9134 17.6194C21.52 17.3681 22.0712 16.9998 22.5355 16.5355C22.9998 16.0712 23.3681 15.52 23.6194 14.9134C23.8707 14.3068 24 13.6566 24 13Z"
            />
            <path
              opacity="0.15"
              d="M24 13C24 10.36 21.95 8.22 19.35 8.04C18.67 4.59 15.64 2 12 2C9.11 2 6.6 3.64 5.35 6.04C2.34 6.36 0 8.91 0 12C0 13.5913 0.632141 15.1174 1.75736 16.2426C2.88258 17.3679 4.4087 18 6 18C7.74362 18 7.06681 18 8.09299 18V17C10.25 17 14.9564 17 15.9512 17V18C16.6498 18 17.6024 18 19 18C19.6566 18 20.3068 17.8707 20.9134 17.6194C21.52 17.3681 22.0712 16.9998 22.5355 16.5355C22.9998 16.0712 23.3681 15.52 23.6194 14.9134C23.8707 14.3068 24 13.6566 24 13Z"
            />
          </svg>
        </a>
      {/if}
    </div>
  {/if}
</div>

<style lang="postcss">
  @import "../styles/_media.pcss";
  @import "../styles/_color.pcss";
  @import "../styles/_button.pcss";

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

  .actions {
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
  }

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
