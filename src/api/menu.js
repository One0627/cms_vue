import ajax from './ajax'
const menu = {
  MenuTree: () => {
    return ajax.get('/menu/MenuTree')
  },
  AddOrEditNode: params => {
    return ajax.post('/menu/AddOrEditNode', params)
  },
  DeleteNode: params => {
    return ajax.post('/menu/DeleteNode', params)
  },
  UpNode: params => {
    return ajax.post('/menu/UpNode', params)
  },
  DownNode: params => {
    return ajax.post('/menu/DownNode', params)
  }
}
export default menu
