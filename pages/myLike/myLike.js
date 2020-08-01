// pages/myLike/myLike.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:0,
    likes:[],
    isLike: 1
  },
  getMyLike(){
    let that = this
    wx.request({
      url:'https://www.poppy0601.top/wechat/user/store',
      data:{
        uid: that.data.uid
      },
      success(res){
        var list = res.data.data
        if(list){
          list.forEach(function(item,i){
            if(item.pimag) {
              item.pimag = item.pimag.split(' ')
            } 
          })
        }
        that.setData({
          likes: list
        })
      }
    })
  },
  myLike(e){
    let that = this
    var isLike = e.currentTarget.dataset.islike
    var pid = e.currentTarget.dataset.pid
    var index = e.currentTarget.dataset.index
    if(isLike === 2){//收藏
      wx.request({
        url:'https://www.poppy0601.top/wechat/prod/store',
        data: {
          pid: pid,
          uid: that.data.uid,
          isLike: 1
        },
        success(res){
        //  直接从列表移除列表
        var newList = that.data.likes.splice(index-1,1)
        that.setData({
          likes: newList
        })
        that.getMyLike()
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid')
    })
    this.getMyLike()
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