import ajax from './ajax'
const order = {
  OrderList: params => {
    return ajax.post('/order/QueryOrder', params)
  }
}
export default order
