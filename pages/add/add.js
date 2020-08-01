// pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cates:[],
    uid:0
  },
  //获取页面分类数据
  getCateLists(){
    let that = this;
    wx.request({
      url: "https://www.poppy0601.top/wechat/cates",
      success(res){
          that.setData({
            cates: res.data.data
          })
       }
    })
  },
  // 点击添加分类
  addCate(e){
    var cid = e.currentTarget.dataset.cid
    var state = wx.getStorageSync('state')
    //判断有没有登录，没有登录就跳转到登录，如果登录跳转添加分类页
    if(this.data.uid && state==1){//登录
      wx.navigateTo({
        url: `../addGoods/addGoods?cid=${cid}`
      })
    }else{
      wx.navigateTo({
        url: `../login/login?cid=${cid}`
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.getCateLists()
    wx.getStorage({
        key: 'uid',
        success (res) {
          that.setData({
             uid: res.data
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