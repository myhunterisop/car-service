import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isChecked: false,
    soundAllowed: false
  }),
  actions: {
    toggle() {
      this.isChecked = !this.isChecked
    },
    allowSound() {
      this.soundAllowed = true
    }
  }
})
