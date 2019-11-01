import ajax from './ajax'
const excel = {
  export: params => {
    return ajax.post('/Test/ExcelExport', params, {
      responseType: 'blob'
    })
  },
  import: (fileFormData, config) => {
    return ajax.post('/Test/ImportExcel', fileFormData, config)
  }
}

export default excel
