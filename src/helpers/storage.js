let fallbackStorage = (function () {
  let storage = {}
  return {
    setItem (key, item) {
      storage[key] = item
    },

    getItem (key) {
      return storage[key]
    }
  }
}())

const getStorage = () => {
  return window.localStorage || fallbackStorage
}

export const setItem = (key, item) => {
  getStorage().setItem(key, JSON.stringify(item))
}

export const getItem = key => {
  return JSON.parse(getStorage().getItem(key))
}
