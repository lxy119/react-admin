import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Modal} from 'antd';
import {formateDate} from '../../utils/dataUtils'
import memoryUtils from '../../utils/memoryUtils'
import {reqWeather} from '../../api'
import menuConfig from '../../config/menuConfig'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../Link-Button';
import './index.less'
class Header extends Component {
    


    state ={
        sysTime:formateDate(Date.now()),
        weather:''
    }
    logout=()=>{
        Modal.confirm({
            content: '确定退出吗?',
            onOk:()=>{
                storageUtils.removeUser()
                memoryUtils.data={}
              this.props.history.replace('/login')
            },
            onCancel() {},
          });
    }
    getData = ()=>{
        this.intervalid=setInterval(()=>{
            const sysTime=formateDate(Date.now())
            this.setState({sysTime})
        },1000)
    }
    getWeather=async ()=>{
           const weather=await reqWeather('成都')
           this.setState({weather})
    }
    getTitle=()=>{
            const path =this.props.location.pathname
             let title
            menuConfig.forEach((item)=>{
                if(path===item.key){
                    title = item.title
                }else if(item.children){
                   const citem=item.children.find(Citem=>path.indexOf(Citem.key)===0)
                   if(citem){
                   title=citem.title
                   } 
                   
                }
            })
            return title
    }
    componentDidMount(){
        this.getData()
        this.getWeather()
    }
    componentWillUnmount(){
        clearInterval(this.intervalid)
    }
    render() {
        const title=this.getTitle()
        const username = memoryUtils.data.username
        const {sysTime,weather} =this.state
        return (
            <div className = 'header'>
                <div className = 'header-top'>
                    <span>欢迎，{username}</span>
                    {/* <a href="#!" onClick={this.logout}>退出</a> */}
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className = 'header-bottom'>
                <div className = 'header-bottom-left'>{title}</div>
                <div className = 'header-bottom-right'>
                    <span>{sysTime}</span>
                    <span>{weather}</span>
                </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)