// 封装axios库
// 能发送异步ajax请求的函数模块

import axios  from "axios"
import { message } from "antd"

export default function ajax(url,data={},method = "GET"){
  
   return new Promise((resolve)=>{
    let promise
    if(method === "GET"){
        promise=axios.get(url,{params:data})
    }else{
        promise=axios.post(url,data)
    }
    promise.then(response => {
        resolve(response.data)
    }).catch(error => {
        message.error("请求出错"+error.message)
    })
   })

}