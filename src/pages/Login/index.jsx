import React, { Component } from 'react';
import './index.less'
import logo from '../../assets/images/logo.png'
import { Form, Input, Button, Icon,message } from 'antd';
import { reqLogin } from '../../api';
import memoryUtils from "../../utils/memoryUtils"
import storageUtils from '../../utils/storageUtils';
import { Redirect } from 'react-router-dom';
//登录的路由组件
class Login extends Component {

    // 提交校验
    handleSubmit = (event) => {
        event.preventDefault()
        // 进行表单所有控件的校验
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // 校验成功
                const { username, password } = values             
                    const result =await reqLogin( username, password)
                    const {status,msg,data} = result
                    // console.log(result);
                    if (status === 0){
                        message.success("登录成功")
                        storageUtils.saveUser(data)
                        memoryUtils.data = data
                        this.props.history.replace('/')
                    }else{
                        message.error(msg)
                    }
            } else {
                // 校验失败
                console.log("校验出错")
            }
        })
    }
    // 自定义表单规则
    validator = (rule, value, callback) => {
        // console.log(rule, value)
        const length = value && value.length
        const pwdReg = /^[a-zA-Z0-9_]+$/
        if (!value) {
            // callback 如果不传参代表校验成功，如果传参代表校验失败，并且会提示错误
            callback('必须输入密码')
        } else if (length < 4) {
            callback('密码必须大于 4 位')
        } else if (length > 12) {
            callback('密码必须小于 12 位')
        } else if (!pwdReg.test(value)) {
            callback('密码必须是英文、数组或下划线组成')
        } else {
            callback() // 必须调用 callback
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form
        if (memoryUtils.data&&memoryUtils.data._id){
            return <Redirect to = '/'/>
        }
        return (
            <div className="login">
                
                <header className="login-header">
                    <img src={logo} alt="" />
                    <h1>React项目:后台管理系统</h1>
                </header>
               
                <section className="login-content">
                    <h1>用户登录</h1>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {
                                getFieldDecorator("username",
                                    {
                                        rules: [
                                            { required: true, message: 'Please input your username!' },
                                            { min: 4, message: '用户名至少4位' },
                                            { max: 12, message: '用户名最大12位' },
                                            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数组或下划线组成' }
                                        ]
                                    })
                                    (<Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                        placeholder="用户名"
                                    />)
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator("password",
                                    {
                                        rules: [
                                            { validator: this.validator }
                                        ]
                                    })
                                    (<Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />)
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        );
    }
}

export default Form.create()(Login)