// reducer函数模块：根据当前的state和指定的action返回一个新的state

import { combineReducers } from "redux";
import storageUtils from "../utils/storageUtils";
import {SET_HEAD_TITLE} from './action-types'


// 管理headTitle状态数据的reducer
const initHeadTitle='首页'

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