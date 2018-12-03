import * as types from './mutations-type.js'
// 添加菜品到购物车          --> CREATE_DB
// 给购物车的菜品++          --> ADD_DB
// 给购物车的菜品--          --> REDUCE_DB
// 删除购物车的索引          --> DELETE_DB
// 更新当前菜品在购物车的状态 --> UPDATE_CUR_SHOP_STATUS
// 检测购物车内是否存在某菜品 --> CHECK_DB
// 更新本地数据              --> UPDATE_LOCAL
// 清空本地数据              --> CLEAR_LOCAL
export default {
  // nameAsyn ({commit}, {age, name}) {
  //   commit(types.SET_NAME, name)
  //   commit(types.SET_AGE, age)
  // }
  create_db: ({commit}, {shop, data2}) => {
    commit(types.CREATE_DB, {shop, data2})
    commit(types.UPDATE_LOCAL)
  },
  add_db: ({commit}, {max}) => {
    commit(types.ADD_DB, {max})
    commit(types.UPDATE_LOCAL)
  },
  reduce_db: ({commit}, {min}) => {
    commit(types.REDUCE_DB, {min})
    commit(types.UPDATE_LOCAL)
  },
  delete_db: ({commit}) => {
    commit(types.DELETE_DB)
    commit(types.UPDATE_LOCAL)
  },
  update_cur_shop_status: ({commit}, obj) => {
    commit(types.UPDATE_CUR_SHOP_STATUS, obj)
  },
  check_db: ({commit}, obj) => {
    commit(types.CHECK_DB, obj)
  },
  update_local: ({commit}) => {
    commit(types.UPDATE_CUR_SHOP_STATUS)
  },
  clear_local: ({commit}) => {
    commit(types.CLEAR_LOCAL)
  }
}
