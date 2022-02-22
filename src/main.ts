import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import elementui from './common/elementui'
import 'element-plus/dist/index.css'
import './assets/global.css'

import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

// 加载elementui组件
elementui.forEach(component => {
  app.use(component)
})
app.use(createPinia()).use(router).mount('#app')
