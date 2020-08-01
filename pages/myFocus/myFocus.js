// pages/myFocus/myFocus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: [],
  },
  getFocus() {
    let that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/user/focus',
      data: {
        uid: wx.getStorageSync('uid')
      },
      success(res) {
        let list = res.data.data
        var newList = []
          list.forEach(function(item, i) {
            if(item.beFocus_uid>0){
              if(item.uimag){
                 item.uimag = item.uimag.split(" ")
              }
            newList.push(item)
            }
            
          })
        that.setData({
          focus: newList
        })
      }
    })
  },
  myFocus(e){
    let that = this
    var isFocus = e.currentTarget.dataset.isfocus
    var beFocus_uid = e.currentTarget.dataset.befocus_uid
    var focus_uid = e.currentTarget.dataset.focus_uid
    var index = e.currentTarget.dataset.index
    wx.request({
      url:'https://www.poppy0601.top/wechat/prod/focus',
      data:{
        focus_uid: focus_uid,
        beFocus_uid: beFocus_uid,
        isFocus: 1
      },
      success(res){
        var newList = that.data.focus.splice(index,1)
        that.setData({
          focus: newList
        })
        that.getFocus()
      }
    })
  },
  toPerson(e){
    var beFocus_uid = e.currentTarget.dataset.befocus_uid
    var person = e.currentTarget.dataset.person
    wx.redirectTo({
      url: `../PersonIndex/PersonIndex?personuid=${beFocus_uid}&person=${person}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFocus()
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