// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible.js'
import store from './store/store.js'
import axios from 'axios'
import Qs from 'qs'
import 'vue2-toast/lib/toast.css'
import Toast from 'vue2-toast'
import 'swiper/dist/css/swiper.css'
// import layer from 'vue-layer'
import 'mint-ui/lib/style.css'
import {Loadmore} from 'mint-ui'
import {Alert} from 'vux'
Vue.use(Toast, {
  type: 'center',
  duration: 3000,
  wordWrap: true,
  width: '150px'
})
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.qs = Qs
// Vue.prototype.$layer = layer(Vue)
Vue.component(Loadmore.name, Loadmore)
Vue.component('alert', Alert)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
