import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/index.scss' // global css
import '@/assets/icons' // icon
import './router/permission' // permission control
import VueBus from '@/utils/bus'
import importDirective from '@/directives'
import comp from './components'

/**
 * 注册指令
 */
importDirective(Vue)
Vue.config.productionTip = false
Vue.use(Element, {
  size: 'mini',
})
// register global utility filters.
import * as filters from './filters' // global filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
import lodash from 'lodash'
Vue.prototype.$lodash = lodash
import '@/utils/request'
import config from './config'
Vue.prototype.$config = config
import instantCompt from './utils/instantComponent'
Vue.prototype.$instantCompt = instantCompt
Vue.prototype.$store = store
let Base64 = require('js-base64').Base64
Vue.prototype.$base64 = Base64
let dayjs = require('dayjs')
Vue.prototype.$dayjs = dayjs
import { formatDate, formatFileSize } from './utils'
Vue.prototype.$formatDate = formatDate
Vue.prototype.$formatFileSize = formatFileSize
Vue.prototype.$maxNumber = 2147483647
Vue.prototype.$eventHub = new Vue();
Vue.use(comp)
Vue.use(VueBus)

new Vue({
  el: '#app',
  router,
  // store,
  render: h => h(App)
})
