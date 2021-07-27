import React, { Component } from 'react';
import {Redirect, Route, Switch} from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils';
import { Layout } from 'antd';

import Header from '../../components/Header';
import LeftNav from '../../components/left-nav';
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout;
//管理界面的组件
class Ademin extends Component {
    render() {

        if (!memoryUtils.data || !memoryUtils.data._id) {
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{ width: '100%', minHeight: '100%' }}>
                <Sider style={{ backgroundColor: 'black' }}>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{ backgroundColor: '#FFF',margin:20 }}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#cccccc' }}>推荐使用谷歌浏览器，可以获得更好的体验</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Ademin;