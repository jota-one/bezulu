<svg>
  <defs>
    <filter id="dropshadow" x="0" y="0" width="150%" height="150%">
      <feOffset result="offOut" in="SourceAlpha" dx="1" dy="1" />
      <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
      <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.95" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
</svg>

<style lang="postcss">
  svg {
    position: fixed;
    z-index: -1;
    visibility: hidden;
  }
</style>
