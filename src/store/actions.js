/*
 Vuex最核心的管理对象
 */
import {
  reqAddress,
  reqFoodCategorys,
  reqShops
} from '../api'

import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS
} from './mutation-types'

export default {
  //异步获取地址信息的异步action
  async getAddress ({commit,state}) {
    //发ajax请求
    const {longitude, latitude} = state
    const result = await reqAddress(longitude, latitude)
    //根据结果提交mutation
    if(result.code === 0) {
      const address = result.data
      commit(RECEIVE_ADDRESS, {address})
    }
  },
  // 异步获取分类列表
  async getFoodCategorys ({commit}) {
    //发ajax请求
    const result = await reqFoodCategorys()
    // 根据结果提交mutation
    if(result.code===0) {
      const footCategorys = result.data
      commit(RECEIVE_CATEGORYS,{categorys:footCategorys})
    }
  },
  // 异步获取商家列表的异步action
  async getShops ({commit, state}) {
    //发ajax请求
    const {longitude, latitude} = state
    const result = await reqShops(longitude, latitude)
    // 根据结果提交mutation
    if(result.code===0) {
      const shops = result.data
      commit(RECEIVE_SHOPS, {shops})
    }
  }

}
