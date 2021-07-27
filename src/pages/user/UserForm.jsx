import React, { PureComponent } from 'react'
import { Form,Input,Select } from 'antd'
import PropTypes from 'prop-types'



//用于添加用户填写的表单
 class UserForm extends PureComponent {

    static propsTypes = {
        setForm:PropTypes.func.isRequired,
        roles:PropTypes.array.isRequired,
        user:PropTypes.object
    }
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
            const {getFieldDecorator}=this.props.form
            const {roles,user}=this.props
        return (
           <Form>
               <Form.Item label='用户名' labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>
               {getFieldDecorator('username',{
                       initialValue:user.username,
                       rules:[{required:true,message:'用户名必须输入'}]
                    })
                   (<Input placeholder='请输入用户名字'></Input>)
               }
               </Form.Item>
               {user._id?null:<Form.Item label='密码' labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>
               {getFieldDecorator('password',{
                       initialValue:'',
                       rules:[{required:true,message:'密码必须输入'}]
                    })
                   (<Input type='password'></Input>)
                }
               </Form.Item>}
               <Form.Item label='电话' labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>
               {getFieldDecorator('phone',{
                       initialValue:user.phone,
                       rules:[{required:true,message:'电话必须输入'}]
                    })
                   (<Input placeholder='请输入电话号码'></Input>)
                }
               </Form.Item>
               <Form.Item label='邮箱' labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>
               {getFieldDecorator('email',{
                       initialValue:user.email,
                       rules:[{required:true,message:'邮箱必须输入'}]
                    })
                   (<Input placeholder='请输入邮箱'></Input>)
                }
               </Form.Item>
               <Form.Item label='角色' labelCol={{ span: 4 }} wrapperCol={{ span: 15 }}>
               {getFieldDecorator('role_id',{
                       initialValue:user.role_id,
                       rules:[{required:true}]
                    })
                   (
                       <Select  placeholder="Select a role">
                           {
                           roles.reduce((pre,role)=>{
                               pre.push(<Select.Option value={role._id} key={role._id}>{role.name}</Select.Option>)
                               return pre
                           },[])
                           }
                       </Select>
                   )
                }
               </Form.Item>
           </Form>
        )
    }
}
export default Form.create()(UserForm)