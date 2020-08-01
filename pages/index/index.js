// pages/index1/index1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 双向绑定搜索内容
    serachKey: '',
    //控制下拉列表的显示隐藏，false隐藏、true显示
    isShow: false,
    //下拉列表的数据
    cates: [],
    //选择的下拉列表下标,
    cid: 0,
    // 商品列表
    goodsList: []
  },
  openClose() {
    //获取下拉分类数据
    let that = this;
    wx.request({
      url: "https://www.poppy0601.top/wechat/cates",
      success(res) {
        that.setData({
          cates: res.data.data
        })
        // 点击下拉显示框
        that.setData({
          isShow: !that.data.isShow
        })
      }
    })

  },
  // 点击下拉列表
  optionTap(e) {
    let that = this
    let cid = e.target.dataset.cid;//获取点击的下拉列表的下标
    this.setData({
      cid: cid,
      isShow: !this.data.isShow
    })
    // 根据当前下标id去获取商品列表数据渲染列表
    wx.request({
      url: "https://www.poppy0601.top/wechat/prods/cate",
      data: {
        cid: cid
      },
      success(res) {
        var list = res.data.data
        list.forEach(function (item, i) {
          if (item.pimag) {
            item.pimag = item.pimag.split(' ')
          }
        })
        that.setData({
          goodsList: list
        })
      }
    })
  },
  close() {
    this.setData({
      isShow: false
    })
  },
  // 搜索内容,搜索框失去焦点
  search(e) {
    var that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/prods/like',
      data: {
        pdesc: e.detail.value,
        cid: that.data.cid
      },
      success(res) {
        var list = res.data.data
        if (list) {

        }
        list.forEach(function (item, i) {
          if (item.pimag) {
            item.pimag = item.pimag.split(' ')
          }
        })
        that.setData({
          goodsList: list
        })
      }
    })
    //清空搜索内容
    this.setData({
      serachKey: ''
    })
  },
  // 获取所有商品
  getGoodsList() {
    var that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/prods/all',
      success(res) {
        var list = res.data.data
        if (list) {
          list.forEach(function (item, i) {
            if (item.pimag) {
              item.pimag = item.pimag.split(' ')
            }
          })
          that.setData({
            goodsList: list
          })
        }
      }
    })
  },
  /**
* 生命周期函数--监听页面加载
*/
  onLoad: function (options) {
    // wx.showLoading({
    //   title:'加载中'
    // })
    this.getGoodsList()
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
    this.getGoodsList()
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
    this.getGoodsList()
    this.setData({
      cid: 0
    })
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