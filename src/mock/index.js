import BASE_URL from '../../global'
const Mock = require('mockjs')
// 格式： Mock.mock( url, post/get , 返回的数据)；
Mock.mock(BASE_URL + '/user/login', 'post', require('./json/login'))

Mock.mock(BASE_URL + '/user/CurrentUserInfo', 'get', require('./json/userinfo'))

Mock.mock(
  BASE_URL + '/user/UserInfoList',
  'post',
  require('./json/userInfoList')
)

Mock.mock(BASE_URL + '/menu/MenuTree', 'get', require('./json/menu'))

Mock.mock(BASE_URL + '/order/QueryOrder', 'post', require('./json/order'))
