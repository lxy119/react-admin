import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'


import store from './redux/store'
import App from "./App";

// 如果 local 中保存了 data, 将 data 保存到内存中

ReactDOM.render(<Provider store={store}>
    <App/>
    </Provider>,document.getElementById("root"))