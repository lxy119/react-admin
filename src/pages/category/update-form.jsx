import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

class UpdateForm extends Component {

    static propsTypes = {
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }


    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const {categoryName}=this.props
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Form.Item>
                    {getFieldDecorator('categoryName', {
                    initialValue: categoryName,
                    rules:[{required:true,message:'分类名必须输入'}]
                })
                    (<Input placeholder='请输入分类名字'></Input>
                    )
                }
                </Form.Item>
            </Form>
        )
    }
}


export default Form.create()(UpdateForm)