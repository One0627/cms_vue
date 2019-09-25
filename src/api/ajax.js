import axios from 'axios'
import router from '../router'
import BASE_URL from '../../global'
import { getToken, removeToken } from '@/common/auth'
axios.defaults.withCredentials = true
const ajax = axios.create({
  baseURL: BASE_URL, // 'http://localhost:5000',
  timeout: 3000000,
  responseType: 'json', // 响应数据格式
  responseEncoding: 'utf8' // 响应数据编码
})

ajax.interceptors.request.use(
  request => {
    // Do something before request is sent
    if (getToken()) {
      request.headers['Authorization'] = 'Bearer ' + `${getToken()}`
    }
    return request // 这里经常搭配token使用，将token值配置到tokenkey中，将tokenkey放在请求头中
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)
ajax.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          error.message = '未经授权：访问由于凭据无效被拒绝。'
          break
        case 403:
          error.message = '当前账户被登出，请重新登录。'
          break
        case 404:
          error.message =
            process.env.NODE_ENV === 'production'
              ? `请求地址出错`
              : `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP版本不受支持'
          break
        default:
      }
      if (getToken()) {
        removeToken()
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)
export default ajax
