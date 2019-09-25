// import Cookies from 'js-cookie'
// import Mock from 'mockjs'

const TokenKey = 'Vue-cms'

function getToken () {
  return sessionStorage.getItem(TokenKey)
}

function setToken (token) {
  return sessionStorage.setItem(TokenKey, token)
}

function removeToken () {
  sessionStorage.clear()
  return sessionStorage.removeItem(TokenKey)
}

export { getToken, setToken, removeToken }
