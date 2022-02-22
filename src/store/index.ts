import { defineStore } from 'pinia'

export const mainStore = defineStore("main", {
  state: () => {
    return {
      tabs: <TabItem[]>[],
      currentActivatedId: 1
    }
  }
})