import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig';
import './index.less'
import logo from '../../assets/images/logo.png'
import memoryUtils from '../../utils/memoryUtils';
const { SubMenu } = Menu;
class LeftNav extends Component {


    
    //判断当前用户对item是否有权限
    hasAuth=(item)=>{
        const {key,isPublic} =item
        const menus=memoryUtils.data.role.menus
        const username=memoryUtils.data.username

        if(username==='admin'||isPublic||menus.indexOf(key)!==-1){
            return true
        }else if(item.children){
           return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
        }
        return false
    }
    // map+递归
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    // reduce++递归
    getMenuNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            
            if(this.hasAuth(item)){
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>))
                } else {
                    // 查找当前路径是否有子列表
                    const path = this.props.location.pathname
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                    
                    // 如果有存起来
                    if (cItem) {
                        this.openKey = item.key
                    }
                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre
        }, [])
    }

    // 在第一次render()之前执行一次
    // 为第一个render准备数据(必须同步)
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {

        let path = this.props.location.pathname
        let openKey = this.openKey
        if(path.indexOf('/product')===0){
             path='/product'
        }
        return (
            <div className="left-nav">
                {/* logo部分 */}
                <Link to="/home" className='left-nav-header'>
                    <img src={logo} alt="lgo" />
                    <h1>商品管理后台</h1>
                </Link>

                {/* menu菜单部分 */}
                <Menu
                    selectedKeys={[path]}
                    mode="inline"
                    theme="dark"
                    defaultOpenKeys={[openKey]}
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>


        )
    }
}

export default withRouter(LeftNav);