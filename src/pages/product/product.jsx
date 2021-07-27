import React, { Component } from 'react'
import { Route,Switch,Redirect } from 'react-router-dom'
import AddUpdate from './Addupdate'
import Detail from './Detail'
import Home from './Home'
import './product.less' 
export default class Product extends Component {
    render() {
        return (
            // 注册路由
               <Switch>
                   <Route path='/product' component={Home} exact></Route>
                   <Route path='/product/addupdate' component={AddUpdate} ></Route>
                   <Route path='/product/detail' component={Detail} ></Route>
                   <Redirect to='/product'/>{/*重定向*/}
               </Switch>
        )
    }
}
