export default {
  generateQRCodePath (value: any) {
    return `${value}?_wx_tpl=${value}`
  },
  getFirstPathNameWord (value: any) {
    let array = value.split('/')
    return array[array.length - 1].slice(0,1).toUpperCase()
  },
  getPathName (value: any) {
    let array = value.split('/')
    return array[array.length - 1]
  }
}
