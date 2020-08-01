// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar:['消息','通知'],
    // 当前tap页
     currentIndex: 0,
     uid:0,
     users:[]
  },
  //  tap点击切换
  switchNav(e){
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
  },
  // 先获取所有聊天的人，渲染聊天页
  getAllMsgUser(){
    if(this.data.uid){
      let that = this
    wx.request({
      url:'https://www.poppy0601.top/wechat/chat/rooms',
      data:{
        uid: that.data.uid
      },
      success(res){
        let list = res.data.data
        if(list){
          list.forEach(function(item,i){
          if(item.message.createTime){
            item.message.createTime = item.message.createTime.split(' ')[1].substr(0,5)
          }
        })
        }
        that.setData({
          users: list
        })
      }
    })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid')
    this.setData({
      uid: uid
    })
    this.getAllMsgUser()
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