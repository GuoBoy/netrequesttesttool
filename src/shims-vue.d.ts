/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare interface TabItem {
  id: number,
  title: string,
  request?: {
    method: Method
  }
}

declare interface Method {
  label: "GET" | "POST",
}
