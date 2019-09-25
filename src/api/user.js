import ajax from './ajax'
const user = {
  login: params => {
    return ajax.post('/user/login', params)
  },

  userInfo: () => {
    return ajax.get('/user/CurrentUserInfo')
  },

  logout: () => {
    return ajax.get('/user/logout')
  },
  changePwd: params => {
    return ajax.post('/user/ChangePwd', params)
  },
  UserInfoList: params => {
    return ajax.post('/user/UserInfoList', params)
  },
  AddOrEditUser: params => {
    return ajax.post('/user/AddOrEditUser', params)
  },
  DeleteUser: params => {
    return ajax.post('/user/DeleteUser', params)
  }
}
export default user
