import React, { Component } from 'react'
import { Input, Tree, Form } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'


const { TreeNode } = Tree;
//弹窗里面的Tree组件

export default class AuthForm extends Component {

    static propsTypes = {
        role: PropTypes.object
    }
    state={
        checkedKeys:[]
    }

    constructor(props) {
        super(props)
        // 根据传入角色的 menus 生成初始状态
        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }
    /*为父组件提交获取最新 menus 数据的方法*/
    getMenus = () => this.state.checkedKeys

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        }, [])
    }
    // 选中某个 node 时的回调
    onCheck = checkedKeys => {
        this.setState({ checkedKeys });
    };

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }
    componentWillReceiveProps(nextProps){
        const menus=nextProps.role.menus
        this.setState({checkedKeys:menus})

    }
    render() {
        const { role } = this.props
        const { checkedKeys } = this.state
        return (
            <Form>
                <Form.Item label='角色名称' labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>
                    <Input value={role.name} disabled></Input>
                </Form.Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </Form>
        )
    }
}