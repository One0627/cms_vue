import ajax from './ajax'
const role = {
  GetRoleSelect: () => {
    return ajax.get('/role/RoleSelect')
  },
  RoleInfolist: params => {
    return ajax.post('/role/RoleInfolist', params)
  },
  AddOrEditRole: params => {
    return ajax.post('/role/AddOrEditRolePermis', params)
  }
}
export default role
