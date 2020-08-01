// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 个人中心的设置
    mineSetting: ['我的发布', '我的收藏', '我的关注'],
    // 用户信息
    avatarUrl: '',
    nickName: '',
    defaultImg: '../../icons/avatar.jpg',
    uid: 0,
    state: null
  },
  // 修改头像，判断用户是否登录
  editAvatar() {
    var that = this
    if(that.data.uid){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
            if (that.data.state == 1) {//已登录
              // 发送请求修改头像
              wx.uploadFile({
                url: 'https://www.poppy0601.top/wechat/user/update',
                filePath: tempFilePaths[0],
                name: "file",
                header: {
                  'content-type': 'multipart/form-data',
                  'Accept': 'application/json'
                },
                formData: {
                  'uid': that.data.uid,
                  'uname': that.data.nickName
                },
                success(res) {
                  var res1 = JSON.parse(res.data)
                  if(res1){
                    that.setData({
                      avatarUrl: res1.data.uimag,
                      nickName: res1.data.uname
                    })
                  }
                }
              })
            } else if (that.data.state == 0) {
              //直接发请求获取当前用户信息，渲染页面
              wx.request({
                url: 'https://www.poppy0601.top/wechat/user/owner',
                data: {
                  uid: that.data.uid
                },
                success(res) {
                  if(res){
                    wx.setStorage({
                      key: 'nickName',
                      data: res.data.data.uname
                    })
                    wx.setStorage({
                      key: 'avatarUrl',
                      data: res.data.uimag
                    })
                    // 用户状态变为登录1
                    wx.setStorage({
                      key: "state",
                      data: 1
                    })
                  }
                }
              })
            } 
        }
      })
    }else{
      wx.showToast({
        title: '未登录',
        icon: 'none',
        duration: 1500
      })
    }
  },

  // 点击我的发布，我的收藏，我的关注判断是否登录,没有登录就跳转到登录页登录
  // 如果已经登录就直接跳到对应页面
  ifLogin(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    if (!that.data.uid && !that.data.state) {//未登录
      wx.navigateTo({
        url: `../login/login?index=${index}`
      })
    } else {//已登录
      if (index === 0) {//我的发布页
        wx.navigateTo({
          url: '../myShow/myShow',
        })
      } else if (index === 1) {//我的收藏
        wx.navigateTo({
          url: '../myLike/myLike',
        })
      } else if (index === 2) {
        wx.navigateTo({
          url: '../myFocus/myFocus',
        })
      }
    }
  },
  // 退出登录,拿到用户uid,state,判断state为0就不发请求，state=1发送请求，,将uid，state设置为空,
  Logout() {
    var that = this
    if (this.data.uid) {
      if (that.data.state === 1) {
        wx.request({
          url: 'https://www.poppy0601.top/wechat/user/logout',
          data: {
            uid: that.data.uid
          },
          success(res) {
            //将用户信息变为默认值
            that.setData({
              avatarUrl: '',
              nickName: ''
            })
            wx.setStorage({//存储退出登录状态
              key: "state",
              data: 0
            })
            that.setData({
              state: 0
            })
          }
        })
      } else if (that.data.state === 0) {
        //清空用户信息
        that.setData({
          avatarUrl: '',
          nickName: ''
        })
        that.onPullDownRefresh()
      }
    } else {
      wx.showToast({
        title: '未登录',
        icon: 'none',
        duration: 1500
      })
    }

  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid')
    var state = wx.getStorageSync('state')
    var avatarUrl = wx.getStorageSync('avatarUrl')
    this.setData({
      uid: uid,
      state: state,
      avatarUrl: avatarUrl
    })
    if (uid) {//判断有没有登录，如果登录了就获取用户信息渲染页面
      if (state === 1) {
        this.setData({
          uid: uid
        })
        this.getOwner()
      } else {
        this.setData({
          avatarUrl: '',
          nickName: ''
        })
      }
    }
  },
  Login() {
    let that = this
    //判断用户是否登录
    if (this.data.uid) {//有uid
      if (this.data.state === 1) {
        wx.showToast({
          title: '您已登录',
          icon: 'info',
          duration: 1000
        })
      } else {
        wx.setStorage({//存储登录状态
          key: "state",
          data: 1
        })
        this.setData({
          state: 1
        })
        this.getOwner()
      }
    } else {
      wx.navigateTo({
        url: '../login/login?index=3'
      })
    }
  },
  //获取该用户信息
  getOwner(){
    let that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/user/owner',
      data: {
        uid: that.data.uid
      },
      success(res) {
        if(res){
          that.setData({
          avatarUrl: res.data.data.uimag,
          nickName: res.data.data.uname,
          gender: res.data.data.gender
          })
          wx.setStorage({
            key: 'avatarUrl',
            data: res.data.data.uimag
          })
        }
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