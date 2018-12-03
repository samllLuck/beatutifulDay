export default {
  getInfos (state) {
    state.cartInfos.totalMoney = 0
    state.cartInfos.totalNumber = 0
    state.cartInfos.getTime = ''
    state.cartInfos.orderTime = ''
    state.cartInfos.weekday = ''
    state.cartInfos.getPerson = ''
    state.cartInfos.orderNumber = ''
    let list = state.cartList.list
    for (let i = 0, len = list.length; i < len; i++) {
      let price = +list[i].price
      let num = +list[i].foodSum
      state.cartInfos.totalMoney += price * num
      state.cartInfos.totalNumber += num
    }
    state.cartInfos.totalMoney = +state.cartInfos.totalMoney.toFixed(2)
    return state.cartInfos
  },
  getCartList (state) {
    return state.cartList
  }
}
