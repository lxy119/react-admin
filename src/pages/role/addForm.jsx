import React, { Component } from 'react'
import { Form,Input } from 'antd'
import PropTypes from 'prop-types'
//弹窗里面的表单组件
 class AddForm extends Component {

    static propsTypes = {
        setForm:PropTypes.func.isRequired,
    }
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator}=this.props.form

        return (
           <Form>
               <Form.Item label='角色名称' labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>
               {getFieldDecorator('roleName',{
                       rules:[{required:true,message:'角色名必须输入'}]
                    })
                   (<Input placeholder='请输入角色名字'></Input>)
                }
               </Form.Item>
           </Form>
        )
    }
}
export default Form.create()(AddForm)