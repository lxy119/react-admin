import React, { Component } from 'react'
import {  Icon, Card, List } from 'antd'
import LinkButton from '../../components/Link-Button'
import { BASE_IMAGE } from '../../utils/constants'
import { reqCategory} from '../../api'
export default class Detail extends Component {
    
    state={
        cName1:'',//一级分类名字
        cName2:'',//二级分类名字
    }
    
    async componentDidMount(){
        const {pCategoryId,categoryId}=this.props.location.state
        if(pCategoryId==='0'){//一级商品名字
            const result= await reqCategory(categoryId)
            const cName1=result.data.name
            this.setState({cName1})
        }else{
            const result= await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1=result[0].data.name
            const cName2=result[1].data.name
            this.setState({cName1,cName2})
            
        }
        

    }
    
    
    
    
    render() {

        const {name,desc,price,imgs,detail}=this.props.location.state
        const {cName1,cName2}=this.state
        const title=(
            <span>
                <LinkButton>
                <Icon type='arrow-left' style={{marginRight:15,fontSize:20}} onClick={()=>this.props.history.goBack()}></Icon>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )

        

        return (
            <Card title={title} className='product-detail'>
                <List>
                <List.Item>
                            <span className='left'>商品名称:</span>
                            <span>{name}</span>
                </List.Item>
                <List.Item>
                            <span className='left'>商品描述:</span>
                            <span>{desc}</span>
                </List.Item>
                <List.Item>
                            <span className='left'>商品价格:</span>
                            <span>{price}元</span>
                </List.Item>
                <List.Item>
                            <span className='left'>所属分类:</span>
                            <span>{cName1}{cName2?'-->'+cName2:''}</span>
                </List.Item>
                <List.Item>
                            <span className='left'>商品图片:</span>
                            <span>
                                {
                                    imgs.map((img)=>(
                                        <img
                                        key={img}
                                        className='product-img'
                                        src={BASE_IMAGE+img}
                                        alt='img'
                                        />
                                    )
                                    )
                                }
                            </span>
                </List.Item>
                <List.Item>
                            <span className='left'>商品详情:</span>
                            <span dangerouslySetInnerHTML={{__html:detail}}>
                            </span>
                </List.Item>
                </List>
            </Card>
        )
    }
}
