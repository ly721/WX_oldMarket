// pages/myShow/myShow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 我发布的商品列表
    myList:[],
    uid: 0
  },
  // 删除物品
  delItem(e){
    let that = this
    let pid = e.currentTarget.dataset.pid
    let cid = e.currentTarget.dataset.cid
    wx.request({
      url: 'https://www.poppy0601.top/wechat/user/delete',
      data:{
        pid: pid,
        uid: that.data.uid,
        cid: cid
      },
      success(res){
        that.getMyList()
      }
    })
  },
  getMyList(){
    var that = this
    wx.request({
      url:'https://www.poppy0601.top/wechat/user/find',
      data:{
        uid: that.data.uid
      },
      success(res){
        var list = res.data.data
        if(list){
           list.forEach(function(item,i){
             if(item.pimag){
               item.pimag = item.pimag.split(" ")
             }
           })
        }
        that.setData({
          myList:res.data.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: wx.getStorageSync('uid')
    })
    this.getMyList()
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
    this.getMyList()
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