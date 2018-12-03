import * as types from './mutations-type.js'
// 添加菜品到购物车          --> CREATE_DB
// 给购物车的菜品++          --> ADD_DB
// 给购物车的菜品--          --> REDUCE_DB
// 删除购物车的索引          --> DELETE_DB
// 更新当前菜品在购物车的状态 --> UPDATE_CUR_SHOP_STATUS
// 检测购物车内是否存在某菜品 --> CHECK_DB
// 更新本地数据              --> UPDATE_LOCAL
// 清空本地数据              --> CLEAR_LOCAL
export default{
  [types.CREATE_DB] (state, {shop, data2}) {
    state.cartList.id = data2.id
    state.cartList.flag = data2.flag
    state.cartList.title = data2.title
    state.cartList.list.push(shop)
    state.cartList.time = data2.time
    state.cartList.chooseSum = data2.chooseSum
    state.cartList.userId = data2.userId
  },
  [types.ADD_DB] (state, {max}) {
    state.cartList.list[state.curIndex].foodSum = +state.cartList.list[state.curIndex].foodSum
    state.cartList.list[state.curIndex].foodSum++
    if (state.cartList.list[state.curIndex].foodSum > max) {
      state.cartList.list[state.curIndex].foodSum--
    }
  },
  [types.REDUCE_DB] (state, {min}) {
    state.cartList.list[state.curIndex].foodSum = +state.cartList.list[state.curIndex].foodSum
    state.cartList.list[state.curIndex].foodSum--
    if (state.cartList.list[state.curIndex].foodSum <= min) {
      state.cartList.list.splice(state.curIndex, 1)
      if (state.cartList.list.length === 0) {
        state.cartList.title = ''
      }
    }
  },
  [types.DELETE_DB] (state) {
    if (state.curIndex >= 0) {
      state.cartList.list[state.curIndex].foodSum = 0
      state.cartList.list.splice(state.curIndex, 1)
    }
  },
  [types.UPDATE_CUR_SHOP_STATUS] (state, {index = -1}) {
    state.curIndex = index
  },
  [types.CHECK_DB] (state, {name, title}) {
    state.curIndex = -1
    let list = state.cartList.list
    if (list.length && state.cartList.title === title) {
      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i].foodName === name) {
          state.curIndex = i
          break
        }
      }
    }
  },
  [types.UPDATE_LOCAL] (state) {
    localStorage.setItem('vuex_cart', JSON.stringify(state.cartList))
  },
  [types.CLEAR_LOCAL] (state) {
    state.cartList.list.forEach(item => {
      item.foodSum = 0
    })
    state.cartList.list = []
    state.cartList.title = ''
    localStorage.removeItem('vuex_cart')
  }
}
