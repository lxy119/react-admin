import React , { Component } from 'react'
import {Card,Table,Icon,Select,Button,Input, message} from 'antd'
import LinkButton from '../../components/Link-Button'
import { reqProducts,reqSearchProducts,reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
export default class Home extends Component {
    
    state={
        products:[],//商品数据
        total:0,//商品总数量
        loading:false,//是否加载
        searchName:'',
        searchType:'productName',
    }
    // 获取指定页码
    getProducts=async (pageNum)=>{
        this.pageNum=pageNum
        this.setState({loading:true})
        const {searchName,searchType}=this.state
        let result
        if(searchName){
        result= await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{
        result= await reqProducts(pageNum,PAGE_SIZE)
        }
        this.setState({loading:false})
        if(result){
        const {total,list}=result.data
        this.setState({total,products:list})
        }
    }

    // 初始table的列
    initColumns=()=>{
        this.columns=[
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render:(price)=>'￥'+price
            },
            {
              width:100,
              title: '状态',
              render:(product)=>{
                  const {status,_id}=product
                  return (
                      <span>
                      <Button type='primary' onClick={()=>this.updateStatus(_id,status===1?2:1)}>{status===1?'下架':'上架'}</Button>
                      <span>{status===1?'在售':'已下架'}</span>
                      </span>
                  )
              }
            },
            {
                title: '操作',
                render:(product)=>{
                    return (
                        <span>
                            <LinkButton onClick={()=>this.props.history.push('/product/detail',product)}>详情</LinkButton>
                            <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                        </span>
                    )
                }
              },
          ];
    }
    // 更新指定商品状态
    updateStatus=async (productId,status)=>{
        const result= await reqUpdateStatus(productId,status)
        if(result.status===0){
            message.success('更新成功')
            this.getProducts(this.pageNum)
        }
    }
    componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getProducts(1)
    }
    
    render() {

        const {products,total,loading,searchType}=this.state
        const columns=this.columns
        const title=(
            <span>
                <Select value={searchType} style={{width:150}} onChange={(value)=>this.setState({searchType:value})}>
                    <Select.Option value='productName'>按名称搜索</Select.Option>
                    <Select.Option value='productDesc'>按描述搜索</Select.Option>
                </Select>
                <Input placeholder='关键字' style={{width:150,margin:'0  15px'}} onChange={(event)=>this.setState({searchName:event.target.value})}></Input>
                <Button type="primary" onClick={()=>{this.getProducts(1)}}>搜索</Button>
            </span>
        )
        const extra=(
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                <Icon type='plus'></Icon>
                添加商品
            </Button>
        )
        return (
        <Card title={title} extra={extra}>
            <Table
            bordered
            dataSource={products}
            columns={columns}
            rowKey='_id'
            pagination={{current:this.pageNum,total,onChange:this.getProducts,defaultPageSize:PAGE_SIZE,showQuickJumper:true,}}
            loading={loading}
            />
        </Card>    
        )
    }
}
