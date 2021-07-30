import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { connect } from 'react-redux'

import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole,reqUpdateRole } from '../../api'
import AddForm from './addForm'
import AuthForm from './authForm'
import { formateDate } from '../../utils/dataUtils'
import {logout} from '../../redux/actions'
/**
 角色路由
 */
 class Role extends Component {

    state = {
        roles: [],
        role: {},
        showAdd: false,
        showAuth: false,
    }
    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }
    //初始化表格的列
    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }
    //
    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({ role })
            },
        }
    }
    //发送请求得到roles数据
    getRoles = async () => {
        const result = await reqRoles()
        let roles
        if (result.status === 0) {
            roles = result.data
            this.setState({ roles })
        }
    }
    //添加角色
    addRole = () => {
        this.form.validateFields(async (error, values) => {
            if (!error) {
                const { roleName } = values
                this.form.resetFields()
                this.setState({showAdd: false })
                const result = await reqAddRole(roleName)
                if (result.status === 0) {
                    message.success('添加角色成功！')
                    // this.getRoles()

                    this.setState((state) => ({
                        roles: [...state.roles, result.data]
                    })
                    )

                } else {
                    message.error('添加角色失败！')
                }
            }
        })
    }
    /*更新角色*/
    updateRole = async () => {
        // 隐藏确认框
        this.setState({
            showAuth: false
        })
        const role = this.state.role
        // 得到最新的 menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = this.props.user.username
        // 请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            // this.getRoles()
            if(role._id===this.props.user.role_id){
                this.props.logout()
                message.success('设置当前角色权限成功，请重新登录')
            }else{
                this.setState({roles: [...this.state.roles]})
                message.success('设置角色权限成功')
            }
        }
    }


    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getRoles()
    }

    render() {
        const { roles, role, showAdd, showAuth } = this.state

        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({ showAdd: true })}>创建角色</Button>
                <Button type='primary' disabled={!role._id} style={{ marginLeft: 20 }} onClick={() => this.setState({ showAuth: true })}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title} >
                <Table
                    bordered
                    dataSource={roles}
                    columns={this.columns}
                    rowKey='_id'
                    pagination={{ defaultPageSize: PAGE_SIZE + 2, }}
                    rowSelection={{ type: 'radio',selectedRowKeys: [role._id],onSelect:(role)=>{this.setState({role})} }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={showAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({showAdd: false })
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={showAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({showAuth : false })
                    }}
                >
                    <AuthForm role={role} ref={this.auth} />
                </Modal>
            </Card>
        )
    }
}
export default connect(state=>({user:state.user}),{logout})(Role)