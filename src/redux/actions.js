/*
包含n个用来创建action的工厂函数（action creator）
*/
import {SET_HEAD_TITLE} from './action-types'


// 设置头部标题的同步action
export const setHeadTitle=(headTitle)=>({type:SET_HEAD_TITLE,data:headTitle})

