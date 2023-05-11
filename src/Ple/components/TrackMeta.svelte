<script>
  import dayjs from 'dayjs'
  import { formatTime } from '../helpers'

  import TrackMetaButton from './TrackMetaButton.svelte'

  export let isActive
  export let isShowCase
  export let album = undefined
  export let artist = undefined
  export let dates = {
    added: undefined,
    updated: undefined,
  }
  export let duration = undefined
  export let genres = []
  export let title = undefined

  const DATE_FORMAT = 'DD.MM.YYYY'
  let slide = false
</script>

<div
  class="meta"
  class:slide={slide}
  class:active={isActive}
  class:showcase={isShowCase}
>
  <div class="content">
    <div class="main">
      <h3>{artist}</h3>
      <h4>{title}</h4>
      <ul>
        {#each genres as genre}
          <li>{genre}</li>
        {/each}
      </ul>
    </div>

    <div class="additional">
      <dl>
        <dt>duration</dt>
        <dd>{formatTime(duration)}</dd>
        <dt>released</dt>
        <dd>{dayjs(dates.released).format(DATE_FORMAT)}</dd>
        <dt>added</dt>
        <dd>{dayjs(dates.added).format(DATE_FORMAT)}</dd>
        {#if dates.updated !== dates.added}
          <dt>updated</dt>
          <dd>{dayjs(dates.updated).format(DATE_FORMAT)}</dd>
        {/if}
      </dl>
    </div>
  </div>

  <div class="actions">
    {#if !isActive}
      <TrackMetaButton isClose />
    {/if}
    <TrackMetaButton
      isActiveTrack={isActive}
      dir={slide ? 'top' : 'bottom'}
      on:click={() => slide = !slide}
    />
  </div>
</div>

<style language="postcss">
  @import "../styles/_media.pcss";
  @import "../styles/_color.pcss";
  @import "../styles/_button.pcss";

  .meta {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 0.75rem;
    display: flex;
    z-index: 1;

    &.showcase {
      padding: 2rem;
    }

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgb(50,50,50);
      opacity: 0.97;
      z-index: -1;
    }

    &.active,
    &.showcase {
      &:before {
        background: var(--ple-c-active);
        opacity: 0.97;
        transition: background var(--ple-transition-time)
          var(--ple-transition-type);
      }
    }
  }

  .actions {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;

    .showcase & {
      top: 2rem;
      right: 2rem;
    }
  }

  .content {
    flex: 1;
    overflow: auto;
    margin: 0.25rem;
    height: calc(200% + 1.5rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;
    font-size: 1rem;
    transform: translateY(-0.25rem);
    transition: transform 0.2s ease-in-out;

    .showcase & {
      font-size: 1.3rem;
    }

    .slide & {
      transform: translateY(calc(-50% - 1.25rem));
    }
  }

  .main,
  .additional {
    flex-basis: 50%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .dates {
    display: flex;
    flex-direction: column;
    font-weight: 500;
  }

  h3,
  h4,
  h5,
  ul {
    margin: 0.2rem 0;
    padding: 0;
  }

  h3,
  h4 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  h3 {
    font-size: 0.9em;
    font-weight: 600;

    @media (--xs) {
      font-size: 1em;
    }
  }

  h4 {
    font-size: 1em;
    font-weight: 400;
    opacity: 0.75;

    @media (--xs) {
      font-size: 1.2em;
    }

    @media (--m) {
      font-size: 1.3em;
    }
  }

  h5 {
    font-size: 1em;
    margin-top: 1rem;
  }

  ul {
    list-style: none;
    display: flex;
    margin-top: 0.5rem;
  }

  li {
    margin: 1px 3px 1px 0;
    padding: 4px;
    font-size: 0.7em;
    line-height: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    border-radius: 0.25rem;
    background: rgba(0, 0, 0, 0.2);
  }

  dl, dt, dd {
    margin: 0;
    padding: 0;
  }

  dl {
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 0.5rem;
    row-gap: 0.2rem;
    font-weight: 300;
  }

  dt {
    grid-column: 1;

    &:first-child {
      padding-bottom: 0.5rem;
    }

    &:after {
      content: ':';
    }
  }

  dd {
    grid-column: 2;
    font-weight: 500;
    text-align: right;
  }
</style>
