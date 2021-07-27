import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImage } from '../../api';
import PropTypes from 'prop-types'
import {BASE_IMAGE} from '../../utils/constants'


//用于图片上传的组件
export default class PicturesWall extends Component {

    static propTypes={
        imgs: PropTypes.array
    }

    state = {
      previewVisible: false,//标识是否显示大图预览
      previewImage: '',//大图的url
      fileList: []
    };
    constructor(props){
        super(props)
    let fileList=[]
    const {imgs}=this.props
    if(imgs&&imgs.length>0){
         fileList=imgs.map((img,index)=>({
            uid:-index,
            name:img,
            status:'done',
            url:BASE_IMAGE+img
        }))
    }    
        this.state={
            previewVisible: false,//标识是否显示大图预览
            previewImage: '',//大图的url
            fileList
        }
    }
    // 隐藏大图
    handleCancel = () => this.setState({ previewVisible: false });
    //点击文件连接或预览图片时的回调
    handlePreview = async file => {
        //显示指定文件对应的大图
    
      this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
      });
    };
  //file：当前操作的图片文件（上传/删除）
  //fileList:所有已上传图片文件对象的数组
  //文件状态改变的回调
    handleChange =async ({file,fileList }) =>{
        
        if(file.status==='done'){
            const result=file.response
            if(result.status===0){
            message.success('图片上传成功!')
                const {name,url}=result.data
                file=fileList[fileList.length-1]
                file.name=name
                file.url=url
            }else{
            message.error('图片上传失败')
            }
        }else if(file.status==='removed'){
                const result= await reqDeleteImage(file.name)
                if(result.status===0){
                    message.success('删除图片成功!')
                }else{
                    message.error('删除图片失败!')
                }
        }
        
        
        this.setState({ fileList })
    } ;
  //将图片名传给父组件
    getImages =()=>{
        return this.state.fileList.map(Item=>Item.name)
    }


    render() {
      const { previewVisible, previewImage, fileList } = this.state;
      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div>上传图片</div>
        </div>
      );
      return (
        <div className="clearfix">
          <Upload
            action="/manage/img/upload"//上传图片的接口地址
            accept='image/*'//只接受图片格式
            listType="picture-card"//卡片样式
            name='image'
            fileList={fileList}//所有已上传图片文件的数组
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>


          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      );
    }
  }
  
