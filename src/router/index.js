import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import foodList from '@/views/order/foodList'
import orderSure from '@/views/order/orderSure'
import orderList from '@/views/order/orderList'
import myOrder from '@/views/home/myOrder'
Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    {
      path: '/',
      name: 'foodList',
      component: foodList
    },
    {
      path: '/orderSure',
      name: 'orderSure',
      component: orderSure
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: orderList
    },
    {
      path: '/myOrder',
      name: 'myOrder',
      component: myOrder
    }
  ]
})
