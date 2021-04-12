import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    },
    loading: false,
    loadingText: '加载中'
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    },
    SHOW_LOADING: (state, param) => {
      if (param === undefined) {
        state.loading = true
        state.loadingText = '加载中'
      } else {
        if (typeof param === 'string') {
          state.loading = true
          state.loadingText = param
        } else if (param === false) {
          state.loading = false
        }
      }
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    }
  }
}

export default app
