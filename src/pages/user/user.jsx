import React, { Component } from 'react'
import { Card, Table, Modal, Button, message } from 'antd'
import { connect } from 'react-redux'

import {logout} from '../../redux/actions'
import { PAGE_SIZE } from '../../utils/constants'
import { formateDate } from '../../utils/dataUtils'
import LinkButton from '../../components/Link-Button'
import { reqAddOrUpdateUser, reqDeleteuser, reqUsers } from '../../api'
import UserForm from './UserForm'

class user extends Component {

    state = {
        users: [],
        isShow: false,
        roles: []
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>

                )
            },
        ]
    }
    //修改用户
    showUpdate = (user) => {
        this.user = user
        this.setState({ isShow: true })
    }

    //删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                const result = await reqDeleteuser(user._id)
                if (result.status === 0) {
                    message.success('删除出错!')
                } else {
                    message.error('删除出错!')
                }
                this.getUsers()
            },
            onCancel() {

            },
        })

    }


    //添加用户
    addOrUpdateUser = async () => {
        this.setState({ isShow: false })
        const user = this.form.getFieldsValue()
        this.form.resetFields()
        if (this.user) {
            user._id = this.user._id
        }

        const result = await reqAddOrUpdateUser(user)

        if (result.status === 0) {
            if(user._id===this.props.user._id){
                this.props.logout()
                message.success('修改成功，请重新登录')
            }else{
                message.success(`${this.user ? '修改成功' : '添加成功'}！`)
                this.getUsers()
            }
        }

    }

    //根据roles数组生成包含所有角色的对象
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }


    //获取用户列表
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                roles,
                users
            })
        }
    }


    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }


    render() {
        const { isShow, users, roles } = this.state
        const user = this.user || {}
        const title = <Button type="primary" onClick={() => {
            this.user = null
            this.setState({ isShow: true })
        }}>添加用户</Button>

        return (
            <Card title={title}>
                <Table
                    bordered
                    dataSource={users}
                    columns={this.columns}
                    rowKey='_id'
                    pagination={{ defaultPageSize: PAGE_SIZE + 2 }}
                />
                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({ isShow: false })
                    }}
                >
                    {/*得到表单里面填的信息*/}
                    <UserForm setForm={form => this.form = form} roles={roles} user={user} />
                </Modal>
            </Card>
        )
    }
}

export default connect(state=>({user:state.user}),{logout})(user)