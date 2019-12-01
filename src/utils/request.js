import axios from 'axios'

import JSONBIGINT from 'json-bigint'

import store from '@/store'
import router from '@/router'

const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [data => {
    try {
      return JSONBIGINT.parse(data)
    } catch (error) {
      return data
    }
  }]
})

instance.interceptors.request.use(config => {
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  try {
    return response.data.data
  } catch (e) {
    return response
  }
}, async error => {
  const loginConfig = { path: '/login', query: { redirectUrl: router.currentRoute.path } }
  try {
    if (error.response && error.response.status === 401) {
      const { user } = store.state
      if (!user.token || !user.refresh_token) {
        router.push(loginConfig)
        return Promise.reject(error)
      }
      // 刷新token发请求
      const res = await axios({
        method: 'put',
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      store.commit('setUser', {
        token: res.data.data.token,
        refresh_token: user.refresh_token
      })
      return instance(error.config)
    }
  } catch (e) {
    router.push(loginConfig)
    return Promise.reject(e)
  }
  return Promise.reject(error)
})

export default (url, method, data) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
