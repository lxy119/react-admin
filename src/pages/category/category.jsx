import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    Icon,
    message,
    Modal
} from 'antd'
import LinkButton from '../../components/Link-Button'
import { reqAddCategory, reqCategorys, reqUpdateCategory } from '../../api'
import AddForm from './addForm'
import UpdateForm from './update-form'
export default class category extends Component {

    state = {
        categorys: [],//一级分类列表
        subCategory: [],//二级分类列表
        loading: false,//显示加载
        parentId: '0',//当前需要显示分类列表的parentID
        parentName: '',//当前需要显示列表的父分类名称
        showStatus: 0,//是否显示对话框 0：都不显示，1显示添加，2显示更新
    }
    // 初始化Table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => {
                    return (
                        <span>
                            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                            {/* 如何向事件回调函数传递参数：先定义一个匿名函数，在函数调用处理的函数并传入数据 */}
                            {this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategory(category) }}>查看子分类</LinkButton> : null}
                        </span>
                    )
                }
            },
        ];
    }
    // 显示指定一级分类的二级列表
    showSubCategory = (category) => {
        // 更新列表
        this.setState({ parentId: category._id, parentName: category.name }, () => {
            this.getDataSource()
        })
    }
    // 异步获取一级分类或二级分类列表显示
    getDataSource = async (parentId) => {
        parentId = this.state.parentId || parentId
        this.setState({ loading: true })
        const dataSource = await reqCategorys(parentId)
        this.setState({ loading: false })
        if (dataSource.status === 0) {
            const categorys = dataSource.data

            if (parentId === '0') {
                //          更新一级分类状态
                this.setState({ categorys })
            } else {
                //          更新二级分类状态
                this.setState({ subCategory: categorys })
            }
        } else {
            message.error('获取分类列表失败！')
        }


    }
    // 显示一级列表
    showCategorys = () => {
        this.setState({
            subCategory: [],//二级分类列表
            parentId: '0',//当前需要显示分类列表的parentID
            parentName: '',//当前需要显示列表的父分类名称
        })
    }
    // 显示添加对话框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }
    //显示修改对话框 
    showUpdate = (category) => {
        // 保存 category
        this.category = category
        // 更新状态
        this.setState({
            showStatus: 2
        })
    }

    //添加分类 
    addCategory = () => {
        this.form.validateFields(async (err, val) => {
            if (!err) {
                this.setState({ showStatus: 0 })
                // 得到数据
                const { parentId, categoryName } = val
                // 关闭对话框
                this.setState({
                    showStatus: 0
                })
                // 重置表单
                this.form.resetFields()
                // 异步请求添加分类
                const result = await reqAddCategory(parentId,categoryName)
                if (result.status === 0) {
                    /*添加一级分类
                    在当前分类列表下添加
                    */
                    if (parentId === this.state.parentId) {
                        this.getDataSource()
                    } else if (parentId === '0') {
                        this.getDataSource(parentId)
                    }
                }
            }
        })
    }
    // 更新分类
    updateCategory = async () => {
        this.form.validateFields(async (err, val) => {
            if (!err) {
                this.setState({ showStatus: 0 })
                // 得到数据
                const categoryId = this.category._id
                const { categoryName } = val
                // 关闭对话框
                this.setState({
                    showStatus: 0
                })
                // 重置表单
                this.form.resetFields()
                // 异步请求更新分类
                const result = await reqUpdateCategory({ categoryId, categoryName })
                if (result.status === 0) {
                    // 重新获取列表
                    this.getDataSource()
                }
            }
        })

    }



    // 为第一次render准备数据
    componentWillMount() {
        // 初始化table所有列数据
        this.initColumns()
    }
    // 
    componentDidMount() {
        // 获取一级更新或二级更新分类列表
        this.getDataSource()
    }




    render() {
        const { categorys, loading, parentId, parentName, subCategory, showStatus } = this.state
        const category = this.category || {}
        const title = parentId === '0' ? '一级标题分类' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级标题分类</LinkButton>
                <Icon type='arrow-right' style={{ marginRight: 5 }} />
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus' />
                添加
            </Button>)

        return (
            <div>
                <Card title={title} extra={extra} >
                    <Table
                        dataSource={parentId === '0' ? categorys : subCategory}
                        bordered
                        loading={loading}
                        rowKey='_id'
                        // 表格列的配置描述
                        columns={this.columns}
                        pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                    >
                    </Table>
                    <Modal
                        title="添加分类"
                        visible={showStatus === 1}
                        onOk={this.addCategory}
                        onCancel={() => this.setState({ showStatus: 0 })}
                    >
                        <AddForm
                            categorys={categorys}
                            parentId={parentId}
                            // 添加验证属性
                            setForm={form => this.form = form}
                        />
                    </Modal>
                    <Modal
                        title="修改分类"
                        visible={showStatus === 2}
                        onOk={this.updateCategory}
                        onCancel={() => {
                            this.setState({ showStatus: 0 })
                            this.form.resetFields()
                        }}
                    >
                        <UpdateForm categoryName={category.name} setForm={(form) => { this.form = form }} />
                    </Modal>

                </Card>
            </div>
        )
    }
}
