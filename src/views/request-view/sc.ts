import { ref, Ref } from 'vue'

interface Param {
  name: string
  value?: string
  description?: string
}

interface Params {
  params: Ref<Param[]>
  deleteParam(x: string): void
  addParam(): void
  paramsTable: { label: string, placeholder: string }[]
}

export function useParams(): Params {
  const params = ref<Param[]>([])

  const deleteParam = (name: string) => {
    params.value = params.value.filter((p) => p.name !== name)
  }

  const addParam = () => {
    params.value.push({
      name: '',
      value: '',
      description: ''
    })
  }

  const paramsTable = [{
    label: 'name',
    placeholder: '参数名称'
  }, {
    label: 'value',
    placeholder: '参数值'
  }, {
    label: 'description',
    placeholder: '参数描述'
  }]

  return {
    params,
    deleteParam,
    addParam,
    paramsTable
  }
}

interface Headers {
  headers: Ref<Param[]>
  deleteHeader(x: string): void
  addHeader(): void
  headersTable: { label: string, placeholder: string }[]
}

export function useHeaders(): Headers {
  const headers = ref<Param[]>([])

  const deleteHeader = (name: string) => {
    headers.value = headers.value.filter((p) => p.name !== name)
  }

  const addHeader = () => {
    headers.value.push({
      name: '',
      value: '',
      description: ''
    })
  }

  const headersTable = [{
    label: 'name',
    placeholder: '参数名称'
  }, {
    label: 'value',
    placeholder: '参数值'
  }, {
    label: 'description',
    placeholder: '参数描述'
  }]

  return {
    headers,
    deleteHeader,
    addHeader,
    headersTable
  }
}

// interface ResponseHeaders {
//   name: string
//   value?: string
// }

// export function useResponse() {
//   const responseHeaders = ref<ResponseHeaders[]>([])
//   return {
//     responseHeaders
//   }
// }

interface HeaderOrParamObject {
  [index: string]: string
}
export interface requestConfig {
  url: string
  headers?: HeaderOrParamObject
  params?: HeaderOrParamObject
}

export function listToObject(params: Param[]): HeaderOrParamObject {
  const result: HeaderOrParamObject = {}
  params.forEach((element) => {
    result[element.name as string] = element.value as string
  })
  return result
}

export function checkUrl(url: string): boolean {
  const regx = /https?:\S+/g
  if (regx.test(url)) return true
  return false
}
