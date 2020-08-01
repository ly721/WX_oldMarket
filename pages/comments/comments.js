// pages/comments/comments.js


Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellerId: 0,
    buyerId: 0,
    prod: {},
    message: '',
    uid: 0,
    toId: 0,
    fromUrl: 0,
    pid: 0,
    p_cid: 0,
    // 是否已发送链接
    isSendLink: false,
    allMessages: [],
    // 上传图片
    isUpload: false,
    start: 0,
    end: 0,
    roomId: '',
    scrollTop: '',
    height: '',
    scrollHeight: '100vh',
    start: 0,
    end:0
  },
  //发送请求查找两人对话记录
  getAllMessage() {
    let that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/chat/findAll',
      data: {
        sellerId: that.data.sellerId,
        buyerId: that.data.buyerId
      },
      success(res) {
        let list = res.data.data
        if (list) {//判断有没有消息
          list.forEach(function (item, i) {
            if (item.message.isFile === 1) {
              item.message.content = JSON.parse(item.message.content)
              if (item.message.content.pimag) {
                item.message.content.pimag = item.message.content.pimag.split(' ')
              }
            }
            item.message.createTime = item.message.createTime.split(' ')[1].substr(0,5)
          })
          that.setData({
            allMessages: list,
            scrollTop: list.length*400+'px'
          })
        }
        
      }
    })
  },
  // 隐藏键盘
  onHideInput() {
    this.setData({
      showInput: false
    })
  },
  //发送文本信息
  sendMessage(e) {
    let that = this 
    wx.request({
      url: 'https://www.poppy0601.top/wechat/chat/sendText',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        sellerId: that.data.sellerId,
        buyerId: that.data.buyerId,
        fromId: that.data.uid,
        toId: that.data.toId,
        content: e.detail.value
      },
      success(res) {
        if (that.data.fromUrl === 1) {
          that.getAllMessage()
        } else if (that.data.fromUrl === 2) {
          that.getMsgPageMessage()
        }
        that.setData({
          message: '',
          scrollTop: (that.data.allMessages.length*1000)+'px'
        })
      }
    })
  },
  // 发送图片
  uplaodPictrue() {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://www.poppy0601.top/wechat/chat/sendFile', 
          filePath: tempFilePaths[0],
          method: 'post',
          header: {
            'content-type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          name: 'file',
          formData: {
            'sellerId': that.data.sellerId,
            'buyerId': that.data.buyerId,
            'fromId': that.data.uid,
            'toId': that.data.toId
          },
          success(res) {
            if(that.data.fromUrl===1){
              that.getAllMessage()
            }else if(that.data.fromUrl){
              that.getMsgPageMessage()
            }
            that.setData({
              scrollTop: (that.data.allMessages.length*1000)+'px'
            })
          }
        })
      }
    })
  },
  // 发送商品链接
  sendGoodsLink(e) {
    this.setData({
      pid: e.currentTarget.dataset.pid
    })
    let that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/chat/sendLink',
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        sellerId: that.data.sellerId,
        buyerId: that.data.buyerId,
        fromId: that.data.uid,
        toId: that.data.toId,
        pid: that.data.pid,
        p_cid: that.data.p_cid,
        p_uid: that.data.p_uid
      },
      success(res) {
        that.setData({
          isSendLink: true
        })
        that.getAllMessage()
        that.setData({
          scrollTop: (that.data.allMessages.length*1000)+'px'
        })
      }
    })
  },
  //获取当前商品
  getThisGoods() {
    let that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/chat/findGoods',
      data: {
        pid: that.data.pid,
        p_uid: that.data.buyerId,
        p_cid: that.data.p_cid
      },
      success(res) {
        if (res.data.data.pimag) {
          res.data.data.pimag = res.data.data.pimag.split(' ')
        }
        that.setData({
          prod: res.data.data
        })
      }
    })
  },
  mytouchstart: function (e) {  //记录触屏开始时间
    this.setData({ start: e.timeStamp })
  },
  mytouchend: function (e) {  //记录触屏结束时间
    this.setData({ end: e.timeStamp })
  },
  // 删除信息
  delMessage(e) {//长按事件
    let that = this
    var messageId = e.currentTarget.dataset.messageid
      wx.showModal({
        content: '删除该信息',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: 'https://www.poppy0601.top/wechat/chat/reback',
              data: {
                messageId: messageId,
                sellerId: that.data.sellerId,
                buyerId: that.data.buyerId
              },
              success(res) {
                that.getAllMessage()
              }
            })
          } else if (res.cancel) {
            wx.showToast({
              title: '取消删除',
              icon: 'none',
              duration: 1000
            })
          }
        }
      })
  },
  toGoodsDetail(e){
    if(this.data.end - this.data.start <350){
    var pid = parseInt(e.currentTarget.dataset.pid)
    var p_cid = parseInt(e.currentTarget.dataset.p_cid)
    var p_uid = parseInt(e.currentTarget.dataset.p_uid)
      wx.reLaunch({
        url:`../goodsDetail/goodsDetail?pid=${pid}&p_cid=${p_cid}&p_uid=${p_uid}`
      })
    }
  },
  //从消息页获取所有信息
  getMsgPageMessage() {
    let that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/chat/messages',
      data: {
        roomId: that.data.roomId
      },
      success(res) {
        let list =  res.data.data
        let sellerId = res.data.room.sellerId
        let buyerId = res.data.room.buyerId
        if (list) {//判断有没有消息
          list.forEach(function (item, i) {
            if (item.message.isFile === 1) {
              item.message.content = JSON.parse(item.message.content)
              if (item.message.content.pimag) {
                item.message.content.pimag = item.message.content.pimag.split(' ')
              }
            }
            item.message.createTime = item.message.createTime.split(' ')[1].substr(0,5)
          })
          that.setData({
            allMessages: list,
            scrollTop: list.length*400
          })
        }
        if (that.data.uid === sellerId) {
          that.setData({
            toId: buyerId
          })
        } else if (that.data.uid === buyerId) {
          that.setData({
            toId: sellerId
          })
        }
        that.setData({
          sellerId: sellerId,
          buyerId: buyerId
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.createSelectorQuery().select('#page').boundingClientRect(function(rect) {
	    that.setData({
		     scrollTop: rect.height+'px'
	    }) 
    }).exec()
    let uid = wx.getStorageSync('uid')
    let fromUrl = parseInt(options.fromUrl)//为1，需要有链接，没有1就不需要链接
    if (fromUrl === 1) {
      let sellerId = parseInt(options.sellerId)
      let buyerId = parseInt(options.buyerId)
      let pid = parseInt(options.pid)
      let p_cid = parseInt(options.p_cid)
      if (uid === sellerId) {
        this.setData({
          toId: buyerId
        })
      } else if (uid === buyerId) {
        this.setData({
          toId: sellerId
        })
      }
      this.setData({
        sellerId: sellerId,
        buyerId: buyerId,
        uid: uid,
        fromUrl: fromUrl,
        pid: pid,
        p_cid: p_cid,
        p_uid: sellerId
      })
    } else if (fromUrl === 2) {
      let roomId = options.roomId
      this.setData({
        roomId: roomId,
        fromUrl: fromUrl,
        uid: uid,
      })
    }
    //如果fromUrl===1，那就走商品获取聊天
    if (fromUrl === 1) {
      that.getAllMessage()
      that.getThisGoods()
    } else if (fromUrl === 2) {
      that.getMsgPageMessage()
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