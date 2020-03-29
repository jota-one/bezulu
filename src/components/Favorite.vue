<template>
  <button class="Favorite" @click="toggle">
    <svg
      :class="['icon', 'colored', 'fill', { isMain }]"
      viewBox="0 0 24 24"
    >
      <path
        v-if="isFavorite"
        d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
      />
      <path
        v-if="isMain && !isFavorite"
        d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" />
    </svg>
  </button>
</template>

<script>
import config from '../../config.json'
import { getItem, setItem } from '@/helpers/storage'

const STORAGE_KEY = `${config.storagePrefix}.favorites`

export default {
  name: 'Favorite',

  props: {
    id: {
      type: String,
      default: ''
    },

    isMain: Boolean
  },

  data: () => ({
    favorites: getItem(STORAGE_KEY) || []
  }),

  computed: {
    isFavorite () {
      return this.favorites.includes(this.id)
    }
  },

  methods: {
    toggle () {
      let favorites = this.favorites

      if (this.isFavorite) {
        favorites = favorites.filter(f => f !== this.id)
      } else {
        favorites.push(this.id)
      }

      this.favorites = favorites

      setItem(STORAGE_KEY, this.favorites)
    }
  }
}
</script>

<style lang="postcss" scoped>
.Favorite {
  margin: 0;
  padding: 0;
  border: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
}

.icon {
  width: 3.5vh;
  height: 3.5vh;

  &.isMain {
    width: 4.5vh;
    height: 4.5vh;
  }
}
</style>