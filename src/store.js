import Vue from 'vue'
import Vuex from 'vuex'
import _set from 'lodash/set'
import merge from 'lodash/merge'
import { getItem, setItem } from '@/helpers/storage'
import config from '../config.json'

Vue.use(Vuex)

const STORAGE_KEY = config.storageKey

let stored

try {
  stored = getItem(STORAGE_KEY) || {}
} catch (e) {
  stored = {}
}

// initial state
const state = merge({
  favorites: [],
  played: []
}, stored)

// actions
const actions = {
  set ({ commit, state }, { key, value }) {
    commit('SET', { key, value })
    setItem(STORAGE_KEY, state)
  }
}

// mutations
const mutations = {
  SET (state, { key, value }) {
    state = _set(state, key, value)
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
