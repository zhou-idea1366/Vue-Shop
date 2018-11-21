/*
 Vuex最核心的管理对象
 */
import {
  reqAddress,
  reqFoodCategorys,
  reqShops,
  reqUserInfo,
  reqLogout,
  reqShopRatings,
  reqShopInfo,
  reqShopGoods
} from '../api'

import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_INFO,
  RECEIVE_RATINGS,
  RECEIVE_GOODS
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
  },

  //保存user的同步action
  saveUser ({commit}, user) {
    commit(RECEIVE_USER, {user})
  },

  //获取当前用户信息的都异步action
  async getUserInfo ({commit}) {
    const result = await reqUserInfo()
    if(result.code===0) {
      const user = result.data
      commit(RECEIVE_USER, {user})
    }
  },

  //退出登录的异步action
  async logout ({commit}) {
    const result = await reqLogout()
    if(result.code===0) {
      commit(RESET_USER)
    }
  },

  // 异步获取商家信息
  async getShopInfo ({commit}) {
    const result = await reqShopInfo()
    if(result.code===0) {
      const info = result.data
      // info.score = 3.5
      commit(RECEIVE_INFO, {info})
    }
  },

  // 异步获取商家评价列表
  async getShopRatings ({commit}) {
    const result = await reqShopRatings()
    if(result.code===0) {
      const ratings = result.data
      commit(RECEIVE_RATINGS, {ratings})
    }
  },

  //异步获取商家商品列表
  async getShopGoods({commit}, callback) {
    const result = await reqShopGoods()
    if(result.code===0) {
      const goods = result.data
      commit(RECEIVE_GOODS, {goods})
      // 提交mutation, 更新状态之后, 调用回调函数
      typeof callback==='function' && callback()
    }
  },




}
