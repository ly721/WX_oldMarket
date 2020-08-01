// pages/PersonIndex/PersonIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['发布', '粉丝'],
    // 当前tap页
    currentIndex: 0,
    showBack: true,
    gender: 1,
    //  Ta的发布
    showLists: [],
    //  当前用户
    p_uid: 0,
    pid: 0,
    p_cid: 0,
    user: {},
    uid: 0,
    goodsLen: 0,
    focusLen: 0,
    person: 0
  },
  naviBack() {
    var that = this
    var pages = getCurrentPages()
    var beforePage = pages[pages.length - 2];//上一页
    if (beforePage) {
      // 获取上一页的url
      var beforePageUrl = beforePage.route
      if(that.data.person==1){
        this.toIndex()
      }else{
        wx.reLaunch({
          url: '/' + beforePageUrl + `?pid=${that.data.pid}&p_cid=${that.data.p_cid}&p_uid=${that.data.p_uid}`
        })
      }
    } else {
      this.toIndex()
    }
  },
  toIndex(){
    wx.reLaunch({
        url: '../index/index'
      })
  },
  //  tap点击切换
  switchNav(e) {
    let that = this
    let currentIndex = e.currentTarget.dataset.index
    this.setData({
      currentIndex: currentIndex
    })
    if(currentIndex===1){
      this.getFocusList()
    }
  },
    //如果点击获取所有粉丝
  getFocusList(){
    let that = this
    wx.request({ 
      url: 'http://106.14.205.196:8080/wechat/user/fans',
      data: {
        uid: that.data.uid
      },
      success(res) {
        let list = res.data.data
        var newList = []
        list.forEach(function (item, i) {
          if (item.beFocus_uid > 0) {
            if (item.uimag) {
              item.uimag = item.uimag.split(" ")
            }
            newList.push(item)
          }
        })
        that.setData({
          focus: newList,
          focusLen: newList.length
        })
      }
    })
  },
  //获取该用户的商品发布
  getshowLists() {
    var that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/user/find',
      data: {
        uid: that.data.uid
      },
      success(res) {
        var list = res.data.data
        if (list) {
          list.forEach(function (item, i) {
            if (item.pimag) {
              item.pimag = item.pimag.split(" ")
            }
          })
          var len = list.length
        }
        that.setData({
          showLists: list,
          goodsLen: len
        })
      }
    })
  },
  getUser() {
    let that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/user/personIndex',
      data: {
        p_uid: that.data.p_uid,
        uid: that.data.uid
      },
      success(res) {
        let user = res.data.user
        that.setData({
          user: user
        })
      }
    })
  },
  // 从某人关注过来
  getPersonUser() {
    let that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/user/owner',
      data: {
        uid: that.data.uid
      },
      success(res) {
        that.setData({
          user: res.data.data
        })
      }
    })
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    let that = this
    var person = parseInt(options.person)
    this.setData({
      person: person
    })
    if(person===1){
      var personuid = parseInt(options.personuid)
        this.setData({
          uid: personuid
        })
        this.getPersonUser()
    }else{
      var p_uid = parseInt(options.p_uid)
      var p_cid = parseInt(options.p_cid)
      var pid = parseInt(options.pid)
      this.setData({
        p_uid: p_uid,
        p_cid: p_cid,
        pid: pid,
        uid: p_uid
      })
      this.getUser()
    }
    this.getshowLists()
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
    this.getshowLists()

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