import Vue from 'vue'
import router from '@/router'
import constantRoutes from '@/router/constantRoutes'
import { getToken, setToken } from '@/utils/auth'
import { projectName } from '@/config'
import { filterAsyncRouter, getterTreeArray } from '@/utils/permission'

const user = {
  state: {
    token: getToken(),
    roles: [],
    routes: [],
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null // 登录用户信息
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token)
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROUTES: (state, routes) => {
      state.routes = routes
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
  },

  actions: {
    // 登录获取token
    Login({ commit }, { account, pwd }) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$post("/account/login", {
          account: account,
          pwd: Vue.prototype.$base64.encode(pwd)
        }).then(res => {
          // console.log(res)
          localStorage.setItem("importSpuData", JSON.stringify({}));
          commit('SET_USER_INFO', res)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    generateRoutes({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (!state.userInfo.menuList || !state.userInfo.menuList.length || !state.userInfo.menuList.find(key => key.name.localeCompare(projectName) === 0)) {
          commit('SET_ROUTES', constantRoutes)
          resolve([])
          return
        }
        try {
          const treeArray = getterTreeArray('id', 'pid', state.userInfo.menuList)
          const customerArray = treeArray.find(key => key.name.localeCompare(projectName) === 0)
          const accessedRoutes = filterAsyncRouter(customerArray.children)
          const concatRouter = constantRoutes.concat(accessedRoutes)
          commit('SET_ROUTES', concatRouter)
          resolve(accessedRoutes)
        } catch (error) {
          console.log(error)
          commit('SET_ROUTES', constantRoutes)
          resolve([])
        }
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$put('/account/logout')
          .then(res => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_USER_INFO', null)
            resolve()
          }).catch(error => {
            reject(error)
          })
      })
    },
    ClearUserData({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_USER_INFO', null)
        resolve()
      })
    }
  }
}

export default user
