const KEY = 'userinfo'

// 获取
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(KEY) || '{}')
}
// 设置
export const setUser = user => {
  window.localStorage.setItem(KEY, JSON.stringify(user))
}
// 删除
export const delUser = () => {
  window.localStorage.removeItem(KEY)
}
