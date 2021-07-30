// reducer函数模块：根据当前的state和指定的action返回一个新的state

import { combineReducers } from "redux";
import storageUtils from "../utils/storageUtils";
import {SET_HEAD_TITLE,RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER} from './action-types'


// 管理headTitle状态数据的reducer
const initHeadTitle=''

function headTitle(state=initHeadTitle,action){
    switch(action.type){
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

// 管理user状态数据的reducer

const initUser=storageUtils.getUser()

function user(state=initUser,action){
    switch(action.type){
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const errorMsg=action.errorMsg//不要直接修改原本状态数据
            return {...state,errorMsg}
        case RESET_USER:
            return {}
        default:
            return state
    }
}


// 向外暴露合并后产生的总reducer函数
// 总的state的结构
/*
{
    headerTitle:''
    user:{}
}
*/

export default combineReducers({
    headTitle,
    user,
})