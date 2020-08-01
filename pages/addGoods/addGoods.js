import WxValidate from '../../utils/WxValidate.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户位置信息
    userAddr:'',
    p_cid:-1,
    p_uid:0,
  },
  toGetLocation(){
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation'] == false){// 如果已拒绝授权，则打开设置页面
          wx.getLocation({
            type: 'gcj02',
            success(res) {
              wx.openSetting({ 
                success(res) {
                }
              })
            }
          })
        }  else { 
          wx.chooseLocation({
            success(res){
              that.setData({
                userAddr: res.address
              })
            }
          })
        }
      }
    })
  },
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
//验证函数
initValidate() {
  const rules = {
    pnum: {
      digit: true
    },
    price:{
      required: true,
      digit: true
    },
    phone:{
      tel:true
    },
    pdesc:{
      required: true,
      maxlength: 200
    },
  }
  const messages = {
    pnum:{
      digit: '请输入数字'
    },
    price:{
      required: '请输入商品价格', 
      digit: '请输入数字'
    },
    pdesc:{
      required: '请输入商品描述',
      maxlength: '商品描述过长'
    },
    phone:{
      tel:'请填写正确的手机号'
    }
  }
  this.WxValidate = new WxValidate(rules, messages)
},
// 提交数据
formSubmit(e) {
  var that = this
  const params = e.detail.value
  //  校验表单
  if (!this.WxValidate.checkForm(params)) {
    const error = this.WxValidate.errorList[0]
     this.showModal(error)
    return false
  }
  wx.request({
    url:'https://www.poppy0601.top/wechat/prod/parts',
    method:'post',
    header:{'content-type': 'application/json','charset': 'utf-8'},
    data:{
      p_uid: that.data.p_uid,
      p_cid: parseInt(that.data.p_cid),
      paddr: e.detail.value.paddr,
      pdesc: e.detail.value.pdesc,
      phone: e.detail.value.phone,
      pnum:  parseInt(e.detail.value.pnum),
      price: parseFloat(e.detail.value.price),
    },
    success(res){
      if(res.statusCode === 200){
        wx.navigateTo({
          url:`../upload/upload?msg=${res.data.msg}`
        })
      }
    }
  })
   
},
// 重置数据
formReset(e) {
  //将图片列表清空
  this.setData({
    uploaderList:[]
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 初始化验证方法
    this.initValidate()
    var that = this
    if(options){
       //获取url参数cid
       that.setData({
          p_cid: options.cid
       })
    }
    wx.getStorage({
      key:'uid',
      success(res){
        that.setData({
          p_uid: res.data
        })
      }
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