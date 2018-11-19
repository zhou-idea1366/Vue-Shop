//能发送ajax请求的模块
//包装axios
//函数的返回值是promise对象

import axios from 'axios'

export default function ajax(url, data={}, method='GET') {
  return new Promise((resolve, reject) => {

    let promise
    if(method=== 'GET') {
      //准备url query参数数据
      let queryStr = ''
      Object.keys(data).forEach(key => {
        const value = data[key]
        // queryStr += key + '=' + data[key] + '&'
        queryStr += `${key}=${value}&`
      })

      if (queryStr !== '') {
        queryStr = queryStr.substring(0, queryStr.length-1)
        // url = url + '?' + queryStr
        url += '?' + queryStr
      }

      //发送get请求
      promise = axios.get(url)

    } else {
      //发送post请求
      promise = axios.post(url, data)
    }

    promise
      .then((response) => {
      resolve(response.data)
    })
      .catch(error => {
        reject(error)
      })
  })


}
