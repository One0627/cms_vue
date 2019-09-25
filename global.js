const urlQa = 'http://ip:5000'
const urlDev = 'http://localhost:5000'
var BASE_URL = ''
process.env.NODE_ENV === 'development'
  ? (BASE_URL = urlDev)
  : (BASE_URL = urlQa)
export default BASE_URL
