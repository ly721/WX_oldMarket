// pages/goodsDetail/goodsDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},
    isLike: 1,
    dianz: false,
    uid: 0,
    pid: 0,
    user: {},
    isFocus: 1,
    p_uid: 0,
    p_cid: 0,
    commentInput: '',
    // 一级评论
    mainComments: [],
    // 二级评论
    secondComments: [],
    // 二级评论条数
    secondCount: 0,
    isShowSecond: false,//二级回复是否展开
    showInput: false,// 点击二级评论
    toName: '', // 二级评论中回复谁
    inputMessage: '',
    parentId: 0,// 二级评论的一级评论者id
    showDaialog: false, // 显示删除对话框
    name: '',// 弹框所需内容
    comment_pid: 0, //是某个商品的评论
    content: '',
    status: 0,
    parentId: 0,
    comment_id: '',// 二级评论对应的一级评论id
    fromId: 0,
    toId: 0,
    replyId: 0,
    e: {},
    animationData: '',
    start: 0,
    end: 0
  },
  // 收藏
  myLike() {
    let that = this
    if (!this.data.uid) {
      wx.showToast({
        title: '未登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      that.setData({
        isLike: that.data.isLike === 2 ? 1 : 2
      })
      if (that.data.isLike === 2) {//收藏
        wx.request({
          url: 'https://www.poppy0601.top/wechat/prod/store',
          data: {
            pid: that.data.pid,
            uid: that.data.uid,
            isLike: that.data.isLike
          },
          success(res) {
            that.setData({
              isLike: res.data.isLike
            })
          }
        })
      } else if (that.data.isLike === 1) {//取消收藏
        wx.request({
          url: 'https://www.poppy0601.top/wechat/prod/store',
          data: {
            pid: that.data.pid,
            uid: that.data.uid,
            isLike: that.data.isLike
          },
          success(res) {
            wx.setStorage({
              key: 'isLike',
              data: res.data.isLike
            })
          }
        })
      }
    }
  },
  // 我的关注
  myFocus() {
    let that = this
    if (!this.data.uid) {
      wx.showToast({
        title: '未登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        isFocus: that.data.isFocus === 2 ? 1 : 2
      })
      if (that.data.isFocus === 2) {//关注
        wx.request({
          url: 'https://www.poppy0601.top/wechat/prod/focus',
          data: {
            beFocus_uid: that.data.p_uid,
            focus_uid: that.data.uid,
            isFocus: that.data.isFocus
          },
          success(res) {
            that.setData({
              isFocus: res.data.isFocus
            })
          }
        })
      } else if (that.data.isFocus === 1) {//取消关注
        wx.request({
          url: 'https://www.poppy0601.top/wechat/prod/focus',
          data: {
            beFocus_uid: that.data.p_uid,
            focus_uid: that.data.uid,
            isFocus: that.data.isFocus
          },
          success(res) {
            that.setData({
              isFocus: res.data.isFocus
            })
          }
        })
      }
    }
  },
  toPerson(e) {
    var p_uid = e.currentTarget.dataset.p_uid
    var pid = e.currentTarget.dataset.pid
    var p_cid = e.currentTarget.dataset.p_cid
    var person = parseInt(e.currentTarget.dataset.person)
    wx.redirectTo({
      url: `../PersonIndex/PersonIndex?p_uid=${p_uid}&pid=${pid}&p_cid=${p_cid}&person=${person}`
    })
  },
  toMine() {
    wx.reLaunch({
      url: '../mine/mine'
    })
  },
  //点赞
  mydz() {
    let that = this
    this.setData({
      dianz: !that.data.dianz
    })
  },
  cleartoName() {
    this.setData({
      inputMessage: ''
    })
  },
  //点击评论触发一级评论,发送成之后删除输入框的字
  commentTo(e) {
    if (this.data.uid) {
      let that = this
      var discountName = e.detail.value['send - input'] ? e.detail.value['send - input'] : e.detail.value
      wx.request({
        url: 'https://www.poppy0601.top/wechat/info/comment',
        method: 'post',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          comment_pid: that.data.pid,
          ownerId: that.data.p_uid,
          fromId: that.data.uid,
          content: discountName
        },
        success(res) {
          that.setData({
            commentInput: '',
            mainComments: res.data.data
          })
        }
      })
    } else {
      this.setData({
        commentInput: ''
      })
      wx.showToast({
        title: '未登录',
        icon: 'none',
        duration: 2000
      })

    }
  },
  // 隐藏键盘
  onHideInput() {
    let that = this
    this.setData({
      showInput: false
    })
  },
  showInput(e) {
    let that = this
    var firstCommentName = e.currentTarget.dataset.firstcommentname
    var parentId = e.currentTarget.dataset.parentid
    var comment_id = e.currentTarget.dataset.comment_id
    this.setData({
      showInput: true,
      toName: firstCommentName,
      parentId: parentId,
      comment_id: comment_id
    })
  },
  // //点击二级评论
  commentToSecond(e) {
    if (this.data.uid) {
      let that = this
      that.setData({
        e: e
      })
      if (e.detail.value) {
        var replyComm = e.detail.value
        //判断回复的是不是自己，如果是直接回复，否则回复内容加上@that.data.toName
        if (that.data.toId !== that.data.uid) {
          replyComm = '回复@' + that.data.toName + ':' + replyComm
        }
        wx.request({
          url: 'https://www.poppy0601.top/wechat/reply/comment',
          method: 'post',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            comment_id: that.data.comment_id,
            parentId: that.data.parentId,
            fromId: that.data.uid,
            toId: that.data.parentId,
            replyComm: replyComm
          },
          success(res) {
            that.setData({
              inputMessage: '',
              secondComments: res.data.data,
            })
            that.getMainComments()
          }
        })
      }
    } else {
      this.setData({
        inputMessage: ''
      })
      wx.showToast({
        title: '未登录',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        showDaialog: false
      })
    }
  },
  //获取二级评论
  getsecondComments(e) {
    let that = this
    var comment_id = e.currentTarget.dataset.firstcommentpid
    var parentId = e.currentTarget.dataset.parentid
    this.setData({
      isShowSecond: !that.data.isShowSecond,
      comment_id: comment_id,
      parentId: parentId
    })
    wx.request({
      url: 'https://www.poppy0601.top/wechat/reply/findAll',
      data: {
        comment_id: that.data.comment_id,
        parentId: that.data.parentId
      },
      success(res) {
        //拿到返回之后进行渲染页面
        that.setData({
          secondComments: res.data.data,
          secondCount: res.data.count
        })
      }
    })
  },
  //获取一级评论
  getMainComments() {
    let that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/info/findAll',
      data: {
        comment_pid: that.data.pid
      },
      success(res) {
        //拿到返回之后进行渲染页面，获取一级评论
        that.setData({
          mainComments: res.data.data
        })
      }
    })
  },
  mytouchstart: function (e) {  //记录触屏开始时间
    this.setData({ 
      start: e.timeStamp 
    })
  },
  mytouchend: function (e) {  //记录触屏结束时间
    this.setData({ 
      end: e.timeStamp 
    })

  },
  // 长按弹框删除评论
  showDaialog(e) {
    var that = this
      var set = e.currentTarget.dataset
      var status = parseInt(set.status)
      var comment_pid = set.comment_pid
      this.setData({
        showDaialog: true,
        comment_pid: comment_pid,
        status: status
      })
      if (status === 1) {
        
        var name = set.name
        var content = set.content
        var infoId = set.infoid
        var firstCommentUid = set.firstcommentuid
        this.setData({
          comment_id: infoId,
          toId: firstCommentUid,
          parentId: firstCommentUid,
          content: content,
          name: name
        })
      } else if (status === 2) {
        var name = set.name
      var content = set.content
        var parentId = set.parentid
        var fromId = set.fromid
        var comment_id = set.comment_id
        var toId = set.toid
        var replyId = set.replyid
        this.setData({
          parentId: parentId,
          fromId: fromId,
          comment_id: comment_id,
          toId: toId,
          replyId: replyId,
          content: content,
          name: name
        })
      }
      var animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease',
      })
      this.animation = animation
      setTimeout(function () {
        that.fadeIn();//调用显示动画
      }, 200)
  },
  // 点击对话框回复,隐藏对话框
  replayCom() {
    let that = this
    this.setData({
      showDaialog: false,
      showInput: true,
      toName: that.data.name
    })
    this.commentToSecond(that.data.e)
  },
  // 删除某条评论，如果是一级评论其下面的二级评论也会删除
  delComment(e) {
    if (this.data.uid) {
      let that = this
      this.setData({
        showDaialog: false
      })
      if (this.data.status === 1) {
        // 判断当前是不是他的评论
        if (that.data.uid === that.data.parentId) {
          wx.request({
            url: 'https://www.poppy0601.top/wechat/info/delComm',
            data: {
              infoId: that.data.comment_id,
              comment_pid: that.data.pid
            },
            success(res) {
              that.setData({
                mainComments: res.data.data
              })
            }
          })
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 2000
          })
        }
      } else if (this.data.status === 2) {//删除二级评论
        if (that.data.uid === that.data.fromId) {
          wx.request({
            url: 'https://www.poppy0601.top/wechat/reply/delComm',
            method: 'post',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              parentId: that.data.parentId,
              comment_id: that.data.comment_id,
              fromId: that.data.fromId,
              replyId: that.data.replyId,
              uid: that.data.uid
            },
            success(res) {
              //进行渲染页面，拿到二级评论所有
              that.setData({
                secondComments: res.data.data,
                secondCount: res.data.count
              })
              // that.getsecondComments(e)
            }
          })
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    } else {
      wx.showToast({
        title: '未登录',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        showDaialog: false
      })
    }
  },
  hideDialog() {
    var that = this
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        showDaialog: false
      })
    }, 720)//先执行下滑动画，再隐藏模块
  },
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  //页面加载前根据url参数获取pid,发送请求获取对应商品信息
  getGoodsDetail() {
    let that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/findProd',
      data: {
        pid: that.data.pid,
        p_cid: that.data.p_cid,
        p_uid: that.data.p_uid,
        uid: that.data.uid
      },
      success(res) {
        if (res.data.product) {
          if (res.data.product.pimag) {
            res.data.product.pimag = res.data.product.pimag.split(" ")
          }
          if (res.data.user.uimag) {
            res.data.user.uimag = res.data.user.uimag.split(" ")
          }

        }
        that.setData({
          goodsDetail: res.data.product,
          pid: res.data.product.pid,
          user: res.data.user,
          p_uid: res.data.product.p_uid,
          isFocus: res.data.isFocus,
          isLike: res.data.isLike
        })
        that.getMainComments()
      }
    })
  },
  getGoodsDetailNoUid() {
    let that = this
    wx.request({
      url: 'https://www.poppy0601.top/wechat/detailSO',
      data: {
        pid: that.data.pid,
        p_cid: that.data.p_cid,
        p_uid: that.data.p_uid
      },
      success(res) {
        if (res.data.product) {
          if (res.data.product.pimag) {
            res.data.product.pimag = res.data.product.pimag.split(" ")
          }
          if (res.data.user.uimag) {
            res.data.user.uimag = res.data.user.uimag.split(" ")
          }

        }
        that.setData({
          goodsDetail: res.data.product,
          pid: res.data.product.pid,
          user: res.data.user,
          p_uid: res.data.product.p_uid,
          isFocus: res.data.isFocus,
          isLike: res.data.isLike
        })
        that.getMainComments()
      }
    })
  },
  Iwant() {
    if (!this.data.uid) {
      wx.showToast({
        title: '未登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.reLaunch({
        url: `../comments/comments?sellerId=${this.data.p_uid}&buyerId=${this.data.uid}&pid=${this.data.pid}&fromUrl=1&p_cid=${this.data.p_cid}`,
      })
    }
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var pid = parseInt(options.pid)
    var p_cid = parseInt(options.p_cid)
    var p_uid = parseInt(options.p_uid)
    var uid = wx.getStorageSync('uid')
    this.setData({
      uid: uid,
      pid: pid,
      p_cid: p_cid,
      p_uid: p_uid
    })
    if (uid) {
      this.getGoodsDetail()
    } else {
      this.getGoodsDetailNoUid()
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