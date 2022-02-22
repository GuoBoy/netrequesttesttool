<template>
  <el-empty
    v-if="tabs.length === 0"
    description="还没有请求，赶快新建吧~"
  >
    <el-button
      type="primary"
      @click="newRequestVisiable = true"
    >
      新建请求
    </el-button>
  </el-empty>
  <el-tabs
    v-else
    v-model="currentTabPane.name"
    @tab-add="addTab"
    @tab-remove="removeTab"
    editable
    stretch
  >
    <el-tab-pane
      v-for="(item, index) in tabs"
      :key="index"
      :label="item.name"
      :name="item.name"
    >
      {{ item }}
    </el-tab-pane>
  </el-tabs>
  <el-dialog
    title="新建请求"
    v-model="newRequestVisiable"
  >
    <el-form :model="newRequest">
      <el-form-item label="所属项目">
        <el-select
          v-model="newRequest.parentID"
          placeholder="选择所属项目"
        >
          <el-option
            v-for="(item, index) in projects"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="请求名称">
        <el-input v-model="newRequest.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="newRequestVisiable = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onSaveRequest"
        >确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref } from 'vue'
import { getRecord } from '../database'
import { ElMessageBox } from 'element-plus'
export default {
  setup () {
    // const defaultTab = {
    // 	name: "New Request",
    // 	project: "项目1",
    // };
    const currentTabPane = reactive({})

    const tabs = ref([])
    const addTab = () => {
      tabs.value.push(defaultTab)
    }
    const removeTab = (name) => {
      tabs.value = tabs.value.filter((i) => {
        return i.name != name
      })
    }

    // 新建请求
    const newRequestVisiable = ref(false)
    const newRequest = reactive({
      name: 'New Request',
      parentID: ''
    })
    const onSaveRequest = () => {
      newRequestVisiable.value = false
      console.log(newRequest)
      if (newRequest.parentID === '') {
        ElMessageBox.alert('没有选择所属项目', '创建失败')
      }
    }
    // 获取所有项目
    const projects = ref([])
    getRecord(undefined, (v) => {
      projects.value = v
    })

    return {
      currentTabPane,
      tabs,
      addTab,
      removeTab,
      newRequestVisiable,
      newRequest,
      onSaveRequest,
      projects
    }
  }
}
</script>

<style>
</style>
