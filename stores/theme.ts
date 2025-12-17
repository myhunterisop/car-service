import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isChecked: false
  }),
  actions: {
    toggle() {
      this.isChecked = !this.isChecked
    }
  }
})
