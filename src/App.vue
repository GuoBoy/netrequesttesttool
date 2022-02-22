<template>
  <!-- <router-view></router-view> -->
  <ul class="tabs">
    <li
      :class="['tab-item', store.currentActivatedId === item.id ? 'tab-item-activated' : '']"
      v-for="item in store.tabs"
      :key="item.id"
    >
      <span @click="switchTab(item.id)">{{ item.title }}</span>
      <i class="bi-x" @click="removeTab(item.id)"></i>
    </li>
    <!-- 添加按钮 -->
    <li class="tab-item">
      <i class="bi-plus" @click="addTab"></i>
    </li>
  </ul>
  <div class="pane">
    <RequestPane :self="currentTab" v-if="store.tabs.length !== 0"></RequestPane>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { mainStore } from "./store";
import RequestPane from "./views/views/RequestPane.vue";
const store = mainStore()
// tab相关
const switchTab = (id: number) => {
  store.currentActivatedId = id
}
const removeTab = (id: number) => {
  if (store.tabs.length === 1) return
  var idx = store.tabs.findIndex((e) => e.id === id)
  store.currentActivatedId = store.tabs[idx - 1]?.id || store.tabs[idx + 1]?.id
  store.tabs = store.tabs.filter((e) => {
    if (e.id !== id) return e
  })
}
const addTab = () => {
  var leg = store.tabs.length, nid = leg + 1
  while (true) {
    if (store.tabs.findIndex(e => e.id === nid) === -1) {
      break
    }
    nid++
  }
  store.tabs.push({
    id: nid,
    title: `new ${nid}`,
    request: {
      method: {
        label: "GET"
      }
    }
  })
  store.currentActivatedId = nid
}

const currentTab = computed(() => {
  return store.tabs.find(e => e.id === store.currentActivatedId) as TabItem
})
onMounted(() => {
  if (store.tabs.length === 0) addTab()
})

</script>

<style lang="less" scoped>
.tabs {
  background-color: #f3d1d1;
  overflow: auto;
  white-space: nowrap;
  .tab-item {
    display: inline;
    font-size: large;
    margin: 0 1vw;
  }
  .tab-item:hover {
    cursor: pointer;
  }
}
.tab-item-activated {
  background-color: #a8d4fa;
}
</style>
