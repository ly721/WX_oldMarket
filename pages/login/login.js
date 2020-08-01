// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user: {},
    mineIdx: -1,
    cid: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 判断路径有没有参数，有的话就取参数
    if (options) {
      that.setData({
        mineIdx: options.index,
        cid: options.cid
      })
    }
  },
  bindGetUserInfo(e) {
    var that = this
    wx.getSetting({//获取用户授权信息
      success(res) {
        if (res.authSetting['scope.userInfo']) {//已经授权,获取用户信息
          wx.getUserInfo({
            success(res) {
              that.setData({
                user: res.userInfo
              })
              wx.setStorage({
                key: 'nickName',
                data: res.userInfo.nickName
              })
              wx.setStorage({
                key: 'avatarUrl',
                data: res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
    var state = wx.getStorageSync('state')
    var uid = wx.getStorageSync('uid')
    if (e.detail.userInfo) {
      //用户按了弹框确定按钮
      //判断用户登录状态，如果为0，说明登陆过，那么就调用获取该用户信息接口、如果未登录就登录 
      if (state == 0) {
        wx.request({
          url: 'https://www.poppy0601.top/wechat/user/owner',
          data: {
            uid: uid
          },
          success(res) {
            // 用户状态变为登录1
            wx.setStorage({
              key: "state",
              data: 1
            })
          }
        })
      } else {
        wx.login({
          success(res) {//获取code
            if (res.code) {
              wx.request({
                url: 'https://www.poppy0601.top/wechat/user/login',
                data: {
                  code: res.code,
                  uname: e.detail.userInfo.nickName,
                  gender: e.detail.userInfo.gender,
                  uimag: e.detail.userInfo.avatarUrl
                },
                success(res) {
                  //记录用户登录状态
                  wx.setStorage({
                    key: "uid",
                    data: res.data.data.uid
                  })
                  wx.setStorage({
                    key: "state",
                    data: res.data.data.state
                  })
                  //完善用户信息
                  wx.getSetting({
                    success(res) {
                      // 判断是否授权
                      if (res.authSetting['scope.userInfo']) {
                        // 获取用户信息
                        wx.getUserInfo({
                          success(res) {
                            //用户已经授权过，添加用户信息
                            wx.setStorage({
                              key: 'nickName',
                              data: res.userInfo.nickName
                            })
                            wx.setStorage({
                              key: 'avatarUrl',
                              data: res.userInfo.avatarUrl
                            })
                          }
                        })
                      }
                    }
                  })
                  // 拿到上一页的url
                  var pages = getCurrentPages()
                  var beforePage = pages[pages.length - 2];//上一页
                  if (beforePage) {
                    // 获取上一页的url
                    var beforePageUrl = beforePage.route
                    if (beforePageUrl === 'pages/mine/mine') {
                      var index = parseInt(that.data.mineIdx)
                      if (index === 0) {
                        wx.reLaunch({
                          url: '../myShow/myShow'
                        })
                      } else if (index === 1) {
                        wx.reLaunch({
                          url: '../myLike/myLike'
                        })
                      } else if (index === 2) {
                        wx.reLaunch({
                          url: '../myFocus/myFocus'
                        })
                      }else if(index == 3 ){
                        wx.reLaunch({
                          url: '../mine/mine'
                        })
                      }
                    } else if (beforePageUrl === 'pages/add/add') {
                      var cid = parseInt(that.data.cid)
                      wx.reLaunch({
                        url: `../addGoods/addGoods?cid=${cid}`
                      })
                    }
                  } else {
                    wx.switchTab({
                      url: '../index/index'
                    })
                  }
                }
              })
            }
          }
        })
      }
    }
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