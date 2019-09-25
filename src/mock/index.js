const Mock = require('mockjs')
// 格式： Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/user/login', 'post', require('./json/login'))

Mock.mock('/user/CurrentUserInfo', 'get', require('./json/userinfo'))
