//入口JS

import Vue from 'vue'
import {Button} from 'mint-ui'
import App from './App.vue'

import router from './router'
import store from './store'
import TopHeader from './components/TopHeader/TopHeader.vue'

//註冊全局組件
Vue.component('TopHeader', TopHeader)
Vue.component(Button.name, Button)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})





