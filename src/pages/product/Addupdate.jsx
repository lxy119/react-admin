import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button, Icon, message } from 'antd'
import LinkButton from '../../components/Link-Button'
import { reqAddUpdateProduct, reqCategorys } from '../../api';
import PicturesWall from './PicturesWall'
import RichTextEditor from './rich-text-editor';
class AddUpdate extends Component {

    constructor(props){
        super(props)
        this.rw=React.createRef()
        this.editor=React.createRef()
    }
    
    state = {
        options: [],
    };

    


    submit = () => {
        // 进行表单验证如果通过了在发送ajax请求
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                const {name,desc,price,categoryIds}=values
                let pCategoryId,categoryId
                if(categoryIds.length===1){
                    pCategoryId='0'
                    categoryId=categoryIds[0]
                }else{
                    pCategoryId=categoryIds[0]
                    categoryId=categoryIds[1]
                }
            const  imgs=this.rw.current.getImages()
            const  detail=this.editor.current.getDetail()
            const product={name,desc,price,categoryId,pCategoryId,imgs,detail}
            if(this.isUpdate){
                product._id=this.product._id
            }
            const result=await reqAddUpdateProduct(product)
            if(result.status===0){
                message.success(`${this.isUpdate?'更新':'添加'}商品成功`)
                this.props.history.goBack()
            }else{
            message.error(`${this.isUpdate?'更新':'添加'}商品失败`)
            }
        }
    })
    }
    // 验证价格的自定义函数
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            callback()
        } else {
            callback('价格必须大于0')
        }
    }
    //下拉选择数据
    loadData = async selectedOptions => {
        // 得到选择的Option对象
        const targetOption = selectedOptions[0];
        // 显示loading
        targetOption.loading = true;
        //获取二级列表数据
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        if (subCategorys && subCategorys.length > 0) {
          const   childOptions=subCategorys.map((c) => ({
                label: c.name,
                value: c._id,
                isLeaf: true,
            }))
            targetOption.children=childOptions
        } else {
            targetOption.isLeaf = true
        }
       
        this.setState({
            options: [...this.state.options],
        });
       
    };
    // 
    initOptions =async (Categorys) => {
        const options = Categorys.map((c) => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
        const {isUpdate,product}=this
        const {pCategoryId}=product
        if(isUpdate&&pCategoryId!=='0'){
            // 获取对应的二级列表
            const subCategorys= await this.getCategorys(pCategoryId)
            const childOptions=subCategorys.map(c=>({
                label: c.name,
                value: c._id,
                isLeaf: true,
            }))
            const targetOption=options.find(option=>option.value===pCategoryId)

            targetOption.children=childOptions
        }


        this.setState({ options })
    }
    // 获取一级/二级列表
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const Categorys = result.data
            if (parentId === '0') {
                this.initOptions(Categorys)
            } else {
                return Categorys
            }
        }
    }
    componentWillMount(){
        const product=this.props.location.state
        this.isUpdate=!!product
        this.product=product||{}
    }

    componentDidMount() {
        this.getCategorys('0')
    }

    render() {
        const categoryIds=[]
        const {product,isUpdate}=this
        const { getFieldDecorator } = this.props.form
        const {pCategoryId,categoryId,imgs,detail}=product
        if(isUpdate){
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }else{
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }


        const title = (
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{ fontSize: 20 }}></Icon>
                </LinkButton>
                <span>
                    {isUpdate?'修改商品':'添加商品'}
                </span>
            </span>
        )
        return (
            <Card title={title}>
                <Form labelCol={{ span: 2 }} wrapperCol={{ span: 8 }} >
                    <Form.Item label='商品名称'>
                        {
                            getFieldDecorator(
                                'name', {
                                initialValue: product.name, rules: [
                                    { required: true, message: '必须输入商品名称' }
                                ]
                            })
                                (<Input placeholder='请输入商品名称' />)
                        }
                    </Form.Item>
                    <Form.Item label='商品描述'>
                        {
                            getFieldDecorator(
                                'desc', {
                                initialValue: product.desc, rules: [
                                    { required: true, message: '必须输入商品描述' }
                                ]
                            })
                                (<Input.TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} />)
                        }
                    </Form.Item>
                    <Form.Item label='商品价格'>
                        {
                            getFieldDecorator(
                                'price', {
                                initialValue: product.price, rules: [
                                    { required: true, message: '必须输入商品价格' },
                                    { validator: this.validatePrice }
                                ]
                            })
                                (<Input placeholder='请输入商品价格' type='number' addonAfter='元' />)
                        }
                    </Form.Item>
                    <Form.Item label='商品分类'>
                    {
                            getFieldDecorator(
                                'categoryIds', {
                                initialValue: categoryIds, rules: [
                                    { required: true, message: '必须输入商品分类' },
                                ]
                            })
                                (<Cascader
                                placeholder='请指定商品分类'
                                    options={this.state.options}
                                    loadData={this.loadData}
                                    onChange={this.onChange}
                                    changeOnSelect
                                />)
                        }
                        
                    </Form.Item>
                    <Form.Item label='商品图片'>
                        <PicturesWall  ref={this.rw} imgs={imgs}/>
                    </Form.Item>
                    <Form.Item label='商品详情' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Form.Item>
                </Form>
            </Card>

        )
    }
}
export default Form.create()(AddUpdate)