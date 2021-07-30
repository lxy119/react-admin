import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd"
const BASE='/api'

export const reqLogin = (username,password) =>ajax (BASE+'/login',{username,password},"POST")

// 获取一级或某个二级分类列表
export const reqCategorys=(parentId)=>ajax(BASE+'/manage/category/list',{parentId},'GET')
// 添加分类
export const reqAddCategory=(parentId,categoryName)=>ajax(BASE+'/manage/category/add',{parentId,categoryName},'POST')
// 更新品类名称
export const reqUpdateCategory=({categoryId,categoryName})=>ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')
// 获取城市天气
export const reqWeather = (city)=>{

    return new Promise((resolve,reject)=>{

        const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=020e02835ad8d7013fad6e17c2c21302`
        jsonp(url,{},(error,data)=>{
            if(!error&&data.status==='1'){
    
                const {weather} =data.lives[0]
                resolve(weather)
            }else{
                message.error('获取天气信息失败！')
            }
        })

    })

    
}
// 获取商品分页列表
export const reqProducts=(pageNum,pageSize)=>ajax(BASE+'/manage/product/list',{pageNum,pageSize},'GET')

// 搜索商品分页列表（根据商品描述）
export const reqSearchProducts=({pageNum,pageSize,searchName,searchType})=>ajax(BASE+'/manage/product/search',{pageNum,pageSize,[searchType]:searchName},'GET')
//获取商品分类
export const reqCategory=(categoryId)=>ajax(BASE+'/manage/category/info',{categoryId},'GET')
//对商品进行上架下架处理
export const reqUpdateStatus=(productId,status)=>ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')
//对商品图片进行删除
export const reqDeleteImage=(name)=>ajax(BASE+'/manage/img/delete',{name},'POST')
//添加/更新商品
export const reqAddUpdateProduct=(product)=>ajax(BASE+'/manage/product/'+(product._id?'update':'add'),product,'POST')
//获取角色列表
export const reqRoles=()=>ajax(BASE+'/manage/role/list')
//添加角色
export const reqAddRole=(roleName)=>ajax(BASE+'/manage/role/add',{roleName},'POST')
//更新角色权限
export const reqUpdateRole=(role)=>ajax(BASE+'/manage/role/update',role,'POST')
//获取用户列表
export const reqUsers=()=>ajax(BASE+'/manage/user/list')
//删除用户
export const reqDeleteuser=(userId)=>ajax(BASE+'/manage/user/delete',{userId},'POST')
//添加/修改用户
export const reqAddOrUpdateUser=(user)=>ajax(BASE+'/manage/user/'+(user._id?'update':'add'),user,'POST')


