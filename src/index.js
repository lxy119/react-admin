import React from 'react'
import ReactDOM from 'react-dom'
import App from "./App";
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
// 如果 local 中保存了 data, 将 data 保存到内存中
const data = storageUtils.getUser()
if(data && data._id) {
memoryUtils.data = data
}
ReactDOM.render(<App/>,document.getElementById("root"))