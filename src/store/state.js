const state = {
  // cartList: localStorage.getItem('vuex_cart') ? JSON.parse(localStorage.getItem('vuex_cart')) : {},
  // 购物车列表
  cartList: {
    // id: localStorage.getItem('vuex_cart') ? JSON.parse(localStorage.getItem('vuex_cart')).id : '',
    // flag: localStorage.getItem('vuex_cart') ? JSON.parse(localStorage.getItem('vuex_cart')).flag : '',
    // title: localStorage.getItem('vuex_cart') ? JSON.parse(localStorage.getItem('vuex_cart')).title : '',
    // list: localStorage.getItem('vuex_cart') ? JSON.parse(localStorage.getItem('vuex_cart')).list : [],
    // time: localStorage.getItem('vuex_cart') ? JSON.parse(localStorage.getItem('vuex_cart')).time : '',
    // chooseSum: localStorage.getItem('vuex_cart') ? JSON.parse(localStorage.getItem('vuex_cart')).chooseSum : '',
    // userId: localStorage.getItem('vuex_cart') ? JSON.parse(localStorage.getItem('vuex_cart')).userId : ''
    id: '',
    flag: '',
    title: '',
    list: [],
    time: '',
    chooseSum: '',
    userId: ''
  },
  // 当前购物车信息
  cartInfos: {
    totalMoney: 0,
    totalNumber: 0,
    getTime: '',
    orderTime: '',
    getPerson: '',
    orderNumber: ''
  },
  // 当前日期的菜品是否在购物车的状态，在则是对应的索引，否则是-1
  curIndex: -1
}
export default state
