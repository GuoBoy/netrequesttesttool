<template>
  <el-tabs v-model="currentResponseTabName" style="margin-top: .5rem;">
    <el-tab-pane name="0" :label="currentResponseType">
      <div :id="cid" style="height: 300px"></div>
    </el-tab-pane>
    <!-- 响应头 -->
    <el-tab-pane label="headers" name="1">
      <el-table :data="respHeaders" border size="mini">
        <el-table-column label="name">
          <template #default="scope">
            <input type="text" v-model="scope.row.name" />
          </template>
        </el-table-column>
        <el-table-column label="value">
          <template #default="scope">
            <input type="text" v-model="scope.row.value" />
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane name="2" disabled>
      <template v-slot:label>
        <el-select v-model="currentResponseType" size="mini">
          <el-option v-for="m in responseTypes" :key="m" :label="m" :value="m" />
        </el-select>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref, defineProps, computed, onMounted, watch } from 'vue'
import * as monaco from 'monaco-editor'
const props = defineProps<{
  // response: Record<string, unknown> | string,
  response: string,
  responseHeaders?: unknown
}>()

const respHeaders = computed(() => props.responseHeaders)

const currentResponseTabName = ref('0')

const responseTypes = ref(['plaintext', 'javascript', 'html', 'json'])
const currentResponseType = ref(responseTypes.value[0])

const cid = ref('container-' + Math.random().toString(36).substr(2))

var mon: monaco.editor.IStandaloneCodeEditor
onMounted(() => {
  mon = monaco.editor.create(document.getElementById(cid.value) as HTMLElement, {
    language: 'javascript'
  })
})

watch(props, ({ response }) => {
  console.log('收到响应', cid.value)

  mon.setValue(response)
})

watch(currentResponseType, (n, o) => {
  if (n === o) return
  monaco.editor.setModelLanguage(mon.getModel() as monaco.editor.ITextModel, n)
  console.log('修改语言')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var _ = mon.getAction('editor.action.formatDocument').run()
  // console.log(mon.getSupportedActions())
})
</script>
<style lang="less">
.response {
  width: 98%;
  height: auto;
  min-height: 200px;
}
.r-text {
  resize: none;
}
</style>
