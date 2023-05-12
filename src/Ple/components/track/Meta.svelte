<script>
  import dayjs from 'dayjs'
  import { formatTime } from '../../helpers'

  import ArrowButton from './ArrowButton.svelte'
  import CloseButton from './CloseButton.svelte'

  export let isActive
  export let isShowCase
  export let album = undefined
  export let audioUrl = undefined
  export let artist = undefined
  export let dates = {
    added: undefined,
    updated: undefined,
  }
  export let error = undefined
  export let downloadable = false
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
      <CloseButton {isShowCase} />
    {/if}

    <ArrowButton
      isShowCase={isShowCase}
      dir={slide ? 'top' : 'bottom'}
      on:click={() => slide = !slide}
    />

    {#if isShowCase && downloadable}
      <a
        class="download"
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
</div>

<style language="postcss">
  @import "../../styles/_media.pcss";
  @import "../../styles/_color.pcss";
  @import "../../styles/_button.pcss";

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
    bottom: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;

    .showcase & {
      top: 1.5rem;
      right: 1.5rem;
      bottom: 1.5rem;
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

  .download {
    margin-top: 0.5rem;
    display: block;
    width: 2.5rem;
    height: 2.5rem;
    color: rgb(255,255,255);
    opacity: 0.6;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }
</style>
