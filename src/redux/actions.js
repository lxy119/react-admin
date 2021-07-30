/*
包含n个用来创建action的工厂函数（action creator）
*/
import {RECEIVE_USER, RESET_USER, SET_HEAD_TITLE, SHOW_ERROR_MSG} from './action-types'
import {reqLogin} from '../api/index'
import storageUtils from '../utils/storageUtils'

// 设置头部标题的同步action
export const setHeadTitle=(headTitle)=>({type:SET_HEAD_TITLE,data:headTitle})

// 接收用户的同步action
export const receiveUser=(user)=>({type:RECEIVE_USER,user})
// 显示错误的同步action
export const showErrorMsg=(errorMsg)=>({type:SHOW_ERROR_MSG,errorMsg})
//退出登录的同步action
export const logout=()=>{
    storageUtils.removeUser()
    return {type:RESET_USER}
}

//设置异步登录的action
export const login=(username,password)=>{
    return async dispatch=>{
        const result=await reqLogin(username,password)
        if(result.status===0){
            //如果成功，分发同步的action
            const user=result.data
            storageUtils.saveUser(user)
            dispatch(receiveUser(user))
        }else{
            // 如果失败，分发失败的action
            const msg=result.msg
            // message.error(msg)
            dispatch(showErrorMsg(msg))
        }
    }
}