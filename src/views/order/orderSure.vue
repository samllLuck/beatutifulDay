<template>
    <div class="order_sure">
        <div class="sure_head">
            <span class="sure_head_title">第一二食堂--{{arrMsg.title}}</span>
        </div>
        <div class="sure_body">
            <div class="sure_body_time">
                <span class="time_detail">取货时间：{{arrMsg.time}}</span>
            </div>
            <div class="sure_body_foods">
                <ul>
                    <li class="line_food_des" v-for="(item, index) in arrMsg.list" :key="index">
                        <order :data="item"></order>
                    </li>
                </ul>
            </div>
            <div class="sure_body_total">
                <span class="total_money">合计：<span class="price_color">{{cartInfos.totalMoney}}元</span>（{{cartInfos.totalNumber}}件）</span>
            </div>
        </div>
        <div class="sure_footer">
            <div class="sure_footer_left">
                <span class="order_ok_money">
                    订单金额：<span class="RMb_number">{{cartInfos.totalMoney}}元</span>
                </span>
            </div>
            <div class="sure_footer_right" @click="goSure" @dblclick="goSure">
                <span class="order_ok_sure">确定预订</span>
            </div>
        </div>
        <hello-world v-if="jumpShow" :data="jumpMsg" v-on:someMsgFromChild="childMsg"></hello-world>
    </div>
</template>
<script>
import Vue from 'vue'
import order from '@/components/order.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import http from '@/utils/http'
import api from '@/utils/api'
import {AlertPlugin} from 'vux'
Vue.use(AlertPlugin)
// import wx from 'weixin-js-sdk'
// import VConsole from 'vconsole/dist/vconsole.min.js'
export default {
  components: {
    order,
    HelloWorld
  },
  data () {
    return {
      arrMsg: {},
      postMsg: {
        menuListId: '',
        time: '',
        money: '',
        ext1: '',
        title: '',
        userId: '',
        list: []
      },
      jumpShow: false,
      jumpMsg: {
        title: '',
        content: '',
        btn: '',
        btnClick: function () {
          console.log('do something')
        }
      }
    }
  },
  computed: {
    cartInfos () {
      console.log('orderSure你好！')
      return this.$store.getters.getInfos
    },
    cartList () {
      console.log('orderSure你好，世界！')
      return this.$store.getters.getCartList
    }
  },
  mounted () {
    this.arrMsg = this.$store.state.cartList
    this.getwxData()
    // let vConsole = new VConsole()
    // console.log('VConsole is cool', vConsole)
  },
  methods: {
    childMsg (sth) {
      sth()
    },
    getQueryString (name) {
      // let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'ig')
      // let r = window.location.search.substr(1).match(reg)
      let reg = new RegExp('(' + name + '=?)([^|&]+)(?=(#|&|))', 'i')
      let r = window.location.href.substr(1).match(reg)
      if (r != null) return unescape(r[2]); return null
    },
    getwxData: async function () {
      let linkUrl = {}
      linkUrl.url = window.location.href.split('#').shift()
      const res = await http.post(api.getwxData, linkUrl)
      console.log('res.data=' + res.data.data)
      console.log('res.data.appId=' + res.data.data.appId)
      console.log('res.data.timestamp=' + res.data.data.timestamp)
      console.log('res.data.nonceStr=' + res.data.data.nonceStr)
      console.log('res.data.signature=' + res.data.data.signature)
      if (res.status === 200) {
        console.log('window=', window)
        console.log('window.wx=', window.wx)
        window.wx.config({
          beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: false,
          // 必填，公众号的唯一标识
          appId: res.data.data.appId,
          // 必填，生成签名的时间戳
          timestamp: res.data.data.timestamp,
          // 必填，生成签名的随机串
          nonceStr: res.data.data.nonceStr,
          // 必填，签名，见附录1
          signature: res.data.data.signature,
          // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          jsApiList: ['chooseWXPay']
        })
      }
    },
    onBridgeReady (res) {
      console.log('windw.weixinjsbridge=', window.WeixinJSBridge)
      let self_ = this
      window.WeixinJSBridge.invoke('getBrandWCPayRequest',
        {
          'appId': res.data.data.result.appid, // 公众号名称，由商户传入
          'timeStamp': res.data.data.timeStamp, // 时间戳，自1970年以来的秒数
          'nonceStr': res.data.data.result.nonceStr, // 随机串
          'package': res.data.data.package1,
          'signType': 'MD5', // 微信签名方式
          'paySign': res.data.data.paySign // 微信签名
        },
        function (ress) {
          if (ress.err_msg === 'get_brand_wcpay_request:ok') {
          // 使用以上方式判断前端返回,微信团队郑重提示：
          // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            console.log('钱付过了！')
            // self_.$layer.open({
            //   content: '支付成功',
            //   yes: function (index) {
            //     self_.$router.push({
            //       name: 'myOrder',
            //       params: {
            //         name: 'myOrder'
            //       }
            //     })
            //     self_.$layer.close(index)
            //   },
            //   cancle: function (index) {
            //     self_.$layer.close(index)
            //   },
            //   closeBtn: 0
            // })
            // self_.$vux.alert.show({
            //   title: '支付成功',
            //   content: '确定跳转订单列表页！',
            //   onShow () {
            //     console.log('Plugin: I\'m showing')
            //   },
            //   onHide () {
            //     self_.$router.push({
            //       name: 'myOrder',
            //       params: {
            //         name: 'myOrder'
            //       }
            //     })
            //   }
            // })
            self_.jumpMsg.title = '支付成功'
            self_.jumpMsg.content = '确定跳转订单列表页！'
            self_.jumpMsg.btn = '确定'
            self_.jumpMsg.btnClick = function () {
              console.log('这里执行路由跳转')
              self_.jumpShow = false
              self_.$router.push({
                name: 'myOrder',
                params: {
                  name: 'myOrder'
                }
              })
            }
            self_.jumpShow = true
          } else if (ress.err_msg === 'get_brand_wcpay_request:cancel') {
            // self_.$vux.alert.show({
            //   title: '支付取消',
            //   content: '支付取消会留在当前页面哦！',
            //   onShow () {
            //     console.log('Plugin: I\'m showing')
            //   },
            //   onHide () {
            //     console.log('Plugin: I\'m hideing')
            //   }
            // })
            self_.jumpMsg.title = '支付取消'
            self_.jumpMsg.content = '若15分钟内未完成支付，将取消该订单！'
            self_.jumpMsg.btn = '确定'
            self_.jumpMsg.btnClick = function () {
              console.log('这里执行路由跳转')
              self_.jumpShow = false
            }
            self_.jumpShow = true
          } else if (ress.err_msg === 'get_brand_wcpay_request:fail') {
            // self_.$vux.alert.show({
            //   title: '支付失败',
            //   content: '支付失败了，请您稍后重试！',
            //   onShow () {
            //     console.log('Plugin: I\'m showing')
            //   },
            //   onHide () {
            //     console.log('Plugin: I\'m hideing')
            //   }
            // })
            self_.jumpMsg.title = '支付失败'
            self_.jumpMsg.content = '支付失败了，请您稍后重试！'
            self_.jumpMsg.btn = '确定'
            self_.jumpMsg.btnClick = function () {
              console.log('这里执行路由跳转')
              self_.jumpShow = false
            }
            self_.jumpShow = true
          }
        }
      )
    },
    postFoodList: async function (dataList) {
      let self_ = this
      dataList.code = this.getQueryString('code') || 'test'
      dataList.agentId = this.getQueryString('agentId') || 1000009
      dataList.userId = this.arrMsg.userId
      const res = await http.post(api.postFoodList, dataList)
      if (res.status === 200) {
        console.log('预定提交成功!')
        console.log('errcode = ' + res.data.errcode)
        if (res.data.errcode === 1) {
          console.log('res.data = ', res.data)
          console.log('res.data = ', JSON.stringify(res.data))
          console.log('appid=' + res.data.data.result.appid)
          console.log('timeStamp=' + res.data.data.timeStamp)
          console.log('nonceStr=' + res.data.data.result.nonceStr)
          console.log('paySign=' + res.data.data.paySign)
          if (typeof Window.WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(res), false)
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(res))
              document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(res))
            }
          } else {
            this.onBridgeReady(res)
          }
          /*
          wx.chooseWXPay({
            'appId': res.data.data.result.appid, // 公众号名称，由商户传入
            'timestamp': res.data.data.timeStamp, // 时间戳，自1970年以来的秒数
            'nonceStr': res.data.data.result.nonceStr, // 随机串
            'package': res.data.data.package1,
            'signType': 'MD5', // 微信签名方式
            'paySign': res.data.data.paySign, // 微信签名
            success: function (re) {
              console.log('re1 = ' + re)
              if (re.err_msg === 'chooseWXPay:ok') {
                self_.$layer.open({
                  content: '支付成功',
                  end: function (index) {
                    this.$router.push({
                      name: 'myOrder',
                      params: {
                        name: 'myOrder'
                      }
                    })
                  }
                })
              }
            },
            cancel: function (re) {
              console.log('re2 = ' + re)
              self_.$layer.open({
                content: '已取消支付',
                end: function (index) {
                  window.location.reload()
                }
              })
              console.log('已取消支付')
            },
            fail: function (re) {
              console.log('re3 = ' + re)
              self_.$layer.open({
                content: '购买失败，请重新创建订单',
                end: function (index) {
                  window.location.reload()
                }
              })
              console.log('购买失败，请重新创建订单')
            }
          })
          */
        } else if (res.data.errcode === 2) {
          console.log('xxx菜品剩余数量不足')
          // self_.$vux.alert.show({
          //   title: '下单失败',
          //   content: '抱歉，菜品剩余数量不足！',
          //   onShow () {
          //     console.log('Plugin: I\'m showing')
          //   },
          //   onHide () {
          //     console.log('Plugin: I\'m hideing')
          //   }
          // })
          self_.jumpMsg.title = '下单失败'
          self_.jumpMsg.content = res.data.message
          self_.jumpMsg.btn = '确定'
          self_.jumpMsg.btnClick = function () {
            console.log('这里执行路由跳转')
            self_.jumpShow = false
          }
          self_.jumpShow = true
        } else if (res.data.errcode === 4) {
          self_.jumpMsg.title = '下单失败'
          self_.jumpMsg.content = res.data.message
          self_.jumpMsg.btn = '确定'
          self_.jumpMsg.btnClick = function () {
            console.log('这里执行路由跳转')
            self_.jumpShow = false
          }
          self_.jumpShow = true
        } else if (res.data.errcode === 5) {
          console.log('xxx菜品已下架')
          // self_.$vux.alert.show({
          //   title: '下单失败',
          //   content: '抱歉，菜品已下架！',
          //   onShow () {
          //     console.log('Plugin: I\'m showing')
          //   },
          //   onHide () {
          //     console.log('Plugin: I\'m hideing')
          //   }
          // })
          self_.jumpMsg.title = '下单失败'
          self_.jumpMsg.content = res.data.message
          self_.jumpMsg.btn = '确定'
          self_.jumpMsg.btnClick = function () {
            console.log('这里执行路由跳转')
            self_.jumpShow = false
          }
          self_.jumpShow = true
        }
      } else {
        console.log('fail!!!')
      }
    },
    goSure () {
      // let self_ = this
      // self_.jumpMsg.title = '温馨提示'
      // self_.jumpMsg.content = '预定只能预定某一天的订单哦！'
      // self_.jumpMsg.btn = '确定'
      // self_.jumpMsg.btnClick = function () {
      //   console.log('这里执行路由跳转')
      //   self_.jumpShow = false
      // }
      // self_.jumpShow = true
      this.postMsg.menuListId = this.arrMsg.id
      this.postMsg.time = this.arrMsg.time
      this.postMsg.title = this.arrMsg.title
      this.postMsg.money = this.$store.state.cartInfos.totalMoney
      this.postMsg.ext1 = this.$store.state.cartInfos.totalNumber
      this.arrMsg.list.forEach((item, key) => {
        let obj = {
          id: item.id,
          foodId: item.foodId,
          foodName: item.foodName,
          picUrl: item.picUrl,
          price: item.price,
          foodSum: item.foodSum,
          content: item.content2,
          diff: item.diff
        }
        this.postMsg.list.push(obj)
      })
      this.postFoodList(this.postMsg)
    }
  }
}
</script>
<style lang="less">
  body{
      background: #f6f6f6;
  }
  .order_sure{
    // padding: 0 10px;
    overflow: hidden;
    .sure_head{
      height: 63px;
      line-height: 63px;
      background: #FFFFFF;
      box-shadow: 0 2px 3px 0 rgba(222,222,222,0.50);
      border-bottom: 1px solid #eee;
      .sure_head_title{
          font-family: PingFangSC-Semibold;
          font-size: 32px;
          font-weight: 800;
          color: #333333;
          letter-spacing: 0;
          text-align: left;
          margin-left: 20px;
      }
    }
    .sure_body{
      border-bottom: 1px solid #eee;
      background: #FFFFFF;
      .sure_body_time{
        height: 120px;
        line-height: 120px;
        text-align: center;
        border-bottom: 1px solid #eee;
        .time_detail{
          font-family: PingFangSC-Regular;
          font-size: 30px;
          color: #333333;
          letter-spacing: 0;
          text-align: left;
          font-weight: 600
        }
      }
      .sure_body_foods{
        .line_food_des{
        //   .full_width{
        //     width: 100%;
        //     height: 90px;
        //     line-height: 90px;
        //     .full_width_50{
        //       width: 50%;
        //       float: left;
        //       text-align: center;
        //       .span_left{
        //         font-family: PingFangSC-Regular;
        //         font-size: 28px;
        //         color: #333333;
        //         letter-spacing: 0;
        //         text-align: left;
        //       }
        //     }
        //     .full_width_10{
        //       width: 10%;
        //       float: left;
        //       text-align: center;
        //       .span_middle{
        //         font-family: PingFangSC-Regular;
        //         font-size: 28px;
        //         color: #000000;
        //         letter-spacing: 0;
        //         text-align: left;
        //       }
        //     }
        //     .full_width_40{
        //       width: 40%;
        //       float: left;
        //       .span_right{
        //         margin-left: 20px;
        //         font-family: PingFangSC-Regular;
        //         font-size: 28px;
        //         color: #333333;
        //         letter-spacing: 0;
        //         text-align: right;
        //       }
        //     }
        //   }
        }
      }
      .sure_body_total{
        height: 90px;
        line-height: 90px;
        text-align: center;
        border-top: 1px solid #eee;
        .total_money{
            font-family: PingFangSC-Regular;
            font-size: 28px;
            color: #333333;
            letter-spacing: 0;
            .price_color{
                color: #F76833;
            }
        }
      }
    }
    .sure_footer{
        width: 100%;
        height: 91px;
        line-height: 91px;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        .sure_footer_left{
            width: 72%;
            height: 91px;
            line-height: 91px;
            background: #393939;
            float: left;
            position: relative;
            .order_ok_money{
                margin-left: 30px;
                font-family: PingFangSC-Regular;
                font-size: 28px;
                color: #EFEFEF;
                letter-spacing: 0;
                text-align: left;
            }
        }
        .sure_footer_right{
            width: 28%;
            height: 91px;
            line-height: 91px;
            background: #4D90D5;
            float: right;
            text-align: center;
            .order_ok_sure{
                font-family: PingFangSC-Semibold;
                font-size: 30px;
                color: #FFFFFF;
                letter-spacing: 0;
            }
        }
    }
  }
</style>
