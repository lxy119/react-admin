import React, { Component } from 'react'
import { Form,Select,Input } from 'antd'
import PropTypes from 'prop-types'

 class AddForm extends Component {

    static propsTypes = {
        categorys:PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired,
    }
    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render() {
        const {getFieldDecorator}=this.props.form
        const {categorys,parentId}=this.props

        return (
           <Form>
               <Form.Item label='所属分类'>
                   {getFieldDecorator('parentId',{ initialValue:parentId,})
                   ( <Select>
                    <Select.Option value='0' key='0'>一级分类列表</Select.Option>
                    {
                        categorys.map((c)=><Select.Option value={c._id} key={c._id}>{c.name}</Select.Option>)
                    }     
                     </Select>
                    )}
               </Form.Item>
               <Form.Item label='分类名称'>
               {getFieldDecorator('categoryName',{
                       rules:[{required:true,message:'分类名必须输入'}]
                    })
                   (  <Input placeholder='请输入分类名字'></Input>
               )
                   }
              
               </Form.Item>
           </Form>
        )
    }
}
export default Form.create()(AddForm)