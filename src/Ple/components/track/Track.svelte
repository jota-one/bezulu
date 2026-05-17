<script lang="ts">
  import { error } from '../../stores'
  import type { TrackDates } from '../../types'

  import InfoButton from './button/Info.svelte'
  import TrackMeta from './Meta.svelte'

  let { active, album, artist, audioUrl, coverUrl, thumbnailUrl,
    dates = {}, downloadable = false, duration, genres = [],
    id, isShowcase = false, selected, title, isNew = false, showMeta = false
  }: {
    active?: boolean
    album?: string
    artist?: string
    audioUrl?: string
    coverUrl?: string
    thumbnailUrl?: string
    dates?: Partial<TrackDates>
    downloadable?: boolean
    duration?: number
    genres?: string[]
    id?: string
    isShowcase?: boolean
    selected?: boolean
    title?: string
    isNew?: boolean
    showMeta?: boolean
  } = $props()
</script>

<div {id} class:active class:selected class:new={isNew} class:error={$error}>
  {#if active || showMeta}
    <TrackMeta
      {album}
      {artist}
      {audioUrl}
      {dates}
      {duration}
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
      src={(isShowcase ? coverUrl : thumbnailUrl)?.replace("/public", "")}
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
    &.error {
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
