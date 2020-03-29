<template>
  <a :href="url" class="Download">
    <svg
      class="icon colored fill"
      viewBox="0 0 24 24"
    >
      <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
    </svg>
  </a>
</template>

<script>
export default {
  name: 'Download',

  props: {
    url: {
      type: String,
      default:''
    }
  }
}
</script>

<style lang="postcss" scoped>
.Download {
  margin-bottom: -1vh;
  cursor: pointer;
}

.icon {
  width: 4.5vh;
  height: 4.5vh;
}
</style>