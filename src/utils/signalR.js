import * as signalR from '@aspnet/signalr'
import { getToken } from '../common/auth'
import BASE_URL from '../../global'
const signal = new signalR.HubConnectionBuilder()
  .withUrl(BASE_URL + '/chathub', {
    accessTokenFactory: () => getToken()
  })
  .build()

/* const signalr = function () {
  var hub
  if (hub === undefined) {
    hub = signal
  }
  return hub
} */
//  自动重连
/* async function start () {
  try {
    await signal.start()
    console.log('connected')
  } catch (err) {
    console.log(err)
    setTimeout(() => start(), 5000)
  }
}

signal.onclose(async () => {
  await start()
}) */
export default {
  // Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
  install: function (Vue) {
    Vue.prototype.signal = signal
  }
}
