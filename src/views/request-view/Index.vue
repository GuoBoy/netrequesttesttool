<template>
  <!-- 输入链接区域 -->
  <div class="base">
    <!-- 选择请求方式 -->
    <el-select v-model="currentRequestMethod" class="base-select">
      <el-option v-for="m in requestMethods" :key="m" :label="m" :value="m" />
    </el-select>
    <el-input placeholder="输入请求路径" v-model="requestUrl" class="request-url" />
    <el-button @click="onRequest">发送</el-button>
  </div>
  <!-- 设置区域 -->
  <el-tabs v-model="currentRequestTabName">
    <!-- params区域 -->
    <el-tab-pane label="params" name="0">
      <el-table :data="params" border size="mini">
        <el-table-column v-for="item in paramsTable" :key="item.label" :label="item.label">
          <template #default="scope">
            <el-input
              v-model="scope.row[item.label]"
              :placeholder="item.placeholder"
              size="mini"
              clearable
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="del">
          <template #default="scope">
            <el-button type="danger" size="mini" @click="deleteParam(scope.row.name)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加按钮 -->
      <el-button type="primary" size="mini" @click="addParam" class="add-item-btn">
        <i class="bi bi-plus"></i>
      </el-button>
    </el-tab-pane>
    <!-- headers区域 -->
    <el-tab-pane label="headers" name="1">
      <el-table :data="headers" border size="mini">
        <el-table-column v-for="item in headersTable" :key="item.label" :label="item.label">
          <template #default="scope">
            <el-input
              v-model="scope.row[item.label]"
              :placeholder="item.placeholder"
              size="mini"
              clearable
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="del">
          <template #default="scope">
            <el-button type="danger" size="mini" @click="deleteHeader(scope.row.name)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="mini" @click="addHeader" class="add-item-btn">
        <i class="bi bi-plus"></i>
      </el-button>
    </el-tab-pane>
  </el-tabs>
  <!-- 响应区域 -->
  <response :response="responseData"></response>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useParams, checkUrl, useHeaders, listToObject, requestConfig } from './sc'
import Response from '@/components/response/Index.vue'
import { ElMessage, ElLoading } from 'element-plus'
import { Request } from '@/service/index'
const { ipcRenderer } = window.require('electron')

const requestMethods = ref(['GET', 'POST'])
const currentRequestMethod = ref(requestMethods.value[0])
const requestUrl = ref('')

const currentRequestTabName = ref('0')
const { params, deleteParam, addParam, paramsTable } = useParams()
const { headers, deleteHeader, addHeader, headersTable } = useHeaders()

const responseData = ref('')

ipcRenderer.on('response-data', (_, data) => {
  responseData.value = data
  ElLoading.service().close()
})

ipcRenderer.on('response-error', (_, e) => {
  ElMessage.error(e)
  ElLoading.service().close()
})

const onRequest = () => {
  responseData.value = ''
  if (!checkUrl(requestUrl.value)) {
    ElMessage.warning('请输入正确地址再试！')
    return
  }

  var requestConfig: requestConfig = {
    url: requestUrl.value
  }
  if (params.value.length !== 0) {
    requestConfig.params = listToObject(params.value)
  }
  if (headers.value.length !== 0) {
    requestConfig.headers = listToObject(headers.value)
    if (headers.value.filter(e => e.name.toLowerCase() === 'user-agent').length !== 0) {
      ElLoading.service()
      switch (currentRequestMethod.value) {
        case requestMethods.value[0]:
          ipcRenderer.send('send-get-request', requestConfig)
          break

        case requestMethods.value[1]:
          ipcRenderer.send('send-post-request', requestConfig)
          break
      }
      return
    }
  }
  switch (currentRequestMethod.value) {
    case requestMethods.value[0]:
      Request.get(requestUrl.value, listToObject(params.value), listToObject(headers.value)).then(r => {
        if (typeof r === 'object') r = JSON.stringify(r)
        responseData.value = r
      })
      break

    case requestMethods.value[1]:
      Request.post(requestUrl.value, listToObject(params.value), listToObject(headers.value)).then(r => {
        if (typeof r === 'object') r = JSON.stringify(r)
        responseData.value = r
      })
      break
  }
}
</script>

<style lang="less" scoped>
.base {
  display: flex;
  align-items: center;
  padding-right: 1rem;
  .base-select {
    width: 7rem;
  }
  .request-url {
    margin-right: 0.5rem;
  }
}
.add-item-btn {
  width: 100%;
}
</style>
