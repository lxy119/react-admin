import React, { Component } from 'react'
import { Card,Button } from 'antd'
import ReactEcharts from 'echarts-for-react'


export default class bar extends Component {
    
    state={
        sales:[5, 20, 36, 10, 10, 20],
        store:[10,30,40,20,30,50],
    }
    update=()=>{
        this.setState(state=>({
            sales:state.sales.map(item=>item+1),
            store:state.store.reduce((pre,item)=>{
                pre.push(item-1)
                return pre
            },[])
        }))
    }
    // 返回柱状图的配置对象
    getOption=()=>{
        return {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量','库存']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: this.state.sales
            },{
                name: '库存',
                type: 'bar',
                data: this.state.store
            },]
        }

    }
    
    
    render() {
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>更新</Button>
                </Card>
                <Card title='柱状图一'>
                <ReactEcharts option={this.getOption()} style={{height:300}}></ReactEcharts>
                </Card>
            </div>
        )
    }
}
