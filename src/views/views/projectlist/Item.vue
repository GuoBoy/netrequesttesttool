<template>
  <div
    class="item"
    @click="openRequest"
  >
    <el-icon
      :class="pitem.isFolder ? 'el-icon-connection' : 'el-icon-position'"
    />{{ pitem.name }}
  </div>
  <ul
    v-show="showChild"
    v-for="(child, index) in pitem.children"
    :key="index"
  >
    <item :item="child" />
  </ul>
</template>

<script>
import { computed, ref, toRefs } from 'vue'
export default {
  name: 'Item',
  props: {
    item: Object
  },
  setup (props) {
    const { item } = toRefs(props)
    const pitem = computed(() => {
      return item.value
    })
    const showChild = ref(false)
    const openRequest = () => {
      showChild.value = !showChild.value
      if (pitem.value.isFolder === false) {
        console.log('这是文件')
      }
    }
    return {
      pitem,
      showChild,
      openRequest
    }
  }
}
</script>

<style lang="less" scoped>
.item {
	display: flex;
}
</style>
