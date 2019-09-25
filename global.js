const urlQa = 'http://123.57.92.138:5000'
const urlDev = 'http://localhost:5000'
var BASE_URL = ''
process.env.NODE_ENV === 'development'
  ? (BASE_URL = urlDev)
  : (BASE_URL = urlQa)
export default BASE_URL
