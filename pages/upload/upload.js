// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 上传图片列表
    uploaderList: [],
    // 上传图片数量
    uploaderNum:0,
    // 显示上传图片默认显示
    showUpload:true,
    stamp:'',
    index: 0
  },
  // 删除图片
  clearImg(e){
    var that = this
    var newList = []
    var uploaderList = this.data.uploaderList
    for (let i = 0; i < uploaderList.length; i++){
        if (i == e.target.dataset.index){
          continue
        }
        newList.push(uploaderList[i])
    }
    this.setData({
        uploaderNum: this.data.uploaderNum-1,
        uploaderList: newList,
        showUpload: true
    })
    wx.request({
      url: 'https://www.poppy0601.top/wechat/prod/pic',
      data:{
        index: e.target.dataset.index+1,
        stamp: that.data.stamp
      },
      success(res){
      }
   })
},
//展示图片
showImg(e){
    var that=this
    wx.previewImage({
      current: that.data.uploaderList[e.target.dataset.index], // 当前显示图片的http链接
      urls: that.data.uploaderList // 需要预览的图片http链接列表
    })
},

//点击上传图片按钮,触发表单提交事件
upload(e) {
    var that = this
    wx.chooseImage({
      count: 3-this.data.uploaderNum,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let uploaderList = that.data.uploaderList.concat(res.tempFilePaths)
        // 最多上传3张，等于3张就直接不给上传按钮
        if(uploaderList.length===3){
          that.setData({
            showUpload:false
          })
        }
        that.setData({
          uploaderList: uploaderList,
          uploaderNum: uploaderList.length
        })
        var length = res.tempFilePaths.length
        var successUp = 0
        var failUp = 0
        var count = 0
        that.setData({
          index: count+1
        })
        that.uploadOneByOne(res.tempFilePaths,successUp,failUp,count,length)       
      }
    })
},
uploadOneByOne(imgPaths,successUp, failUp, count, length){
  var that = this;
  wx.showLoading({
     title: '正在上传第'+count+'张',
   })
  wx.uploadFile({
    url: 'https://www.poppy0601.top/wechat/prod',
    filePath: imgPaths[count],
    name: 'file',
    header: {'content-type': 'multipart/form-data'},
    success:function(e){
      successUp++;//成功+1
    },
    formData:{
      'stamp': that.data.stamp
    },
    fail:function(e){
      failUp++;//失败+1
    },
    complete:function(e){
      count++;//下一张
      if(count == length){
        //上传完毕，作一下提示
        wx.showToast({
          title: '上传成功' + successUp,
          icon: 'success',
          duration: 2000
        })
      }else{
        //递归调用，上传下一张
        that.uploadOneByOne(imgPaths, successUp, failUp, count, length)
      }
    }
  })
},
// 取消发布,删除该条全部商品信息
cancelAdd(){
  let that = this
  wx.request({
    url:'https://www.poppy0601.top/wechat/prod/canOrcon',
    data:{
      stamp: that.data.stamp,
      canOrcon: 'no'
    },
    success(res){
      wx.reLaunch({
        url: '../index/index'
      })
    }
  })
},
completeAdd(){
  let that = this
  wx.request({
    url:'https://www.poppy0601.top/wechat/prod/canOrcon',
    data:{
      stamp: that.data.stamp,
      canOrcon: 'yes'
    },
    success(res){
      wx.reLaunch({
        url: '../index/index'
      })
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      stamp: options.msg
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})