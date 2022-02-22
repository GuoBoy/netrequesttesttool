import axios, { AxiosRequestConfig } from 'axios'
import { ElLoading, ElMessage } from 'element-plus'

export const service = axios.create({})

// Request interceptors
service.interceptors.request.use((config: AxiosRequestConfig) => {
  ElLoading.service()
  // config.headers['content-type'] = 'application/x-www-form-urlencoded'
  return config
}, (error: unknown) => {
  ElLoading.service().close()
  ElMessage.error(`发生错误${error}`)
  Promise.reject(error)
})
// Response interceptors
service.interceptors.response.use(
  response => {
    ElLoading.service().close()
    ElMessage.success('请求成功')
    return response.data
  },
  error => {
    ElLoading.service().close()
    ElMessage.error(`发生错误${error}`)
    return Promise.reject(error)
  })
