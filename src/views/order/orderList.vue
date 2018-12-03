<template>
  <div class="order_detail">
    <div class="order_detail_head">
      <div class="detail_head_line_one">
        <span class="head_line_left">第一二食堂（{{arrMsg.ext2}}）</span>
        <span class="head_line_right">{{arrMsg.pay === 1?'待支付':(arrMsg.receive === 1?'待取货':'已完成')}}</span>
      </div>
      <div class="detail_head_line_two">
        <span class="head_line_left font-bold">取货日期：{{arrMsg.receiveTime}}</span>
      </div>
    </div>
    <div class="order_detail_body">
      <div class="detail_body_title">
        <span class="detail_body_title_span">预定明细</span>
      </div>
      <div class="detail_body_food">
        <ul>
          <li class="line_food_des" v-for="(item, index) in arrMsg.foodLists" v-if="arrMsg.foodLists.length" :key="index">
            <order :data="item"></order>
          </li>
        </ul>
      </div>
      <div class="detail_body_msg">
        <div class="body_msg_head">
          <p class="center_msg_p">合计：<span class="price_color">{{arrMsg.money}}元</span>（{{arrMsg.ext1}}件）</p>
          <p class="center_msg_p">订单编号：{{arrMsg.orderNumber}}</p>
          <p class="center_msg_p">预定时间：{{arrMsg.createTime}}</p>
        </div>
        <div class="body_msg_body" v-show="arrMsg.pay===2&&arrMsg.receive===1">
          <p class="center_msg_big_p">取货人：{{arrMsg.userName}}</p>
          <p class="center_msg_p">核销二维码</p>
          <p class="center_msg_erweima" id="qrcode" ref="qrCodeUrl">
          </p>
          <p class="center_msg_org">提示：用户在食堂窗口处</p>
          <p class="center_msg_org">初始并扫码此处二维码完成取货</p>
        </div>
      </div>
    </div>
    <div class="order_detail_footer" @click="goPay" @dblclick="goPay">
      <span class="detail_footer_all">{{arrMsg.pay === 1?'支付':'返回'}}</span>
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
import QRCode from 'qrcodejs2'
import {AlertPlugin} from 'vux'
// import VConsole from 'vconsole/dist/vconsole.min.js'
Vue.use(AlertPlugin)
let Base64 = require('js-base64').Base64
export default {
  components: {
    order,
    HelloWorld
  },
  data () {
    return {
      id_: this.$route.params.data || '',
      keyStr_: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
      arrMsg: {},
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
  mounted () {
    this.getOrderListDetail()
    // let vConsole = new VConsole()
    // console.log('VConsole is cool', vConsole)
  },
  created () {
    console.log('id_=' + this.id_)
    console.log('arrMsg=' + this.arrMsg)
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
  methods: {
    childMsg (sth) {
      sth()
    },
    qrcode () {
      let qrcode = new QRCode('qrcode', {
        width: 100,
        height: 100,
        text: Base64.encode(this.arrMsg.orderNumber)
      })
      console.log(Base64.encode(this.arrMsg.orderNumber))
      console.log(qrcode)
    },
    getQueryString (name) {
      // let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      // let r = window.location.search.substr(1).match(reg)
      let reg = new RegExp('(' + name + '=?)([^|&]+)(?=(#|&|))', 'i')
      let r = window.location.href.substr(1).match(reg)
      if (r != null) return unescape(r[2]); return null
    },
    openCenter (str) {
      this.$toast.center(str)
    },
    closeLoading () {
      this.$loading.close()
    },
    getwxData: async function () {
      let linkUrl = {}
      linkUrl.url = window.location.href.split('#').shift()
      const res = await http.post(api.getwxData, linkUrl)
      if (res.status === 200) {
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
            self_.jumpMsg.content = '支付取消会留在当前页面哦！'
            self_.jumpMsg.btn = '确定'
            self_.jumpMsg.btnClick = function () {
              console.log('这里关闭弹框')
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
              console.log('这里关闭弹框')
              self_.jumpShow = false
            }
            self_.jumpShow = true
          }
        }
      )
    },
    getOrderListDetail: async function () {
      let params = {
        code: this.getQueryString('code') || 'test',
        agentId: this.getQueryString('agentId') || 1000009,
        id: this.id_
      }
      const res = await http.get(api.getOrderListDetail, params)
      if (res.status === 200) {
        console.log('查询订单详情成功!')
        this.arrMsg = res.data.data.detail
        console.log('接口返回的res0', res.data)
        console.log('接口返回的res1', res.data.data)
        console.log('接口返回的res2', res.data.data.detail)
        console.log('组件的数据data', this.arrMsg)
        console.log('组件的数据orderNumber', this.arrMsg.orderNumber)
        if (this.arrMsg.pay === 2 && this.arrMsg.receive === 1) {
          this.qrcode()
        } else {
          this.getwxData()
        }
      } else {
        console.log('fail!!!')
      }
    },
    getRePay: async function () {
      console.log(this.arrMsg)
      let self_ = this
      let data = {
        code: this.getQueryString('code') || 'test',
        userId: this.arrMsg.userId,
        agentId: this.getQueryString('agentId') || '1000009',
        orderNumber: this.arrMsg.orderNumber,
        id: this.arrMsg.id,
        money: this.arrMsg.money
      }
      const res = await http.post(api.getRePay, data)
      if (res.status === 200) {
        console.log('请求成功')
        if (res.data.errcode === 1) {
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
            console.log('这里关闭弹框')
            self_.jumpShow = false
          }
          self_.jumpShow = true
        } else if (res.data.errcode === 4) {
          self_.jumpMsg.title = '下单超时'
          self_.jumpMsg.content = res.data.message
          self_.jumpMsg.btn = '确定'
          self_.jumpMsg.btnClick = function () {
            console.log('这里关闭弹框')
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
            console.log('这里关闭弹框')
            self_.jumpShow = false
          }
          self_.jumpShow = true
        }
      } else {
        console.log('fail1')
      }
    },
    goPay () {
      if (this.arrMsg.pay === 1) {
        console.log('这里调支付接口')
        this.getRePay()
      } else {
        this.$router.push({
          name: 'myOrder',
          params: {
            name: 'myOrder'
          }
        })
      }
    }
  }
}
</script>
<style lang="less">
.order_detail{
  width: 100%;
  overflow: hidden;
  .order_detail_head{
    .detail_head_line_one{
      height: 120px;
      line-height: 120px;
      border-bottom: 1px solid #eee;
    }
    .detail_head_line_two{
      height: 120px;
      line-height: 120px;
      border-bottom: 20px solid #f6f6f6;
    }
    .font-bold{
      font-weight: 800;
    }
    .head_line_left{
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #333333;
      letter-spacing: 0;
      float: left;
      margin-left: 20px;
    }
    .head_line_right{
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #F76833;
      letter-spacing: 0;
      float: right;
      margin-right: 20px;
    }
  }
  .order_detail_body{
    .detail_body_title{
      height: 90px;
      line-height: 90px;
      text-align: center;
      border-bottom: 1px solid #eee;
      .detail_body_title_span{
        font-family: PingFangSC-Semibold;
        font-size: 28px;
        font-weight: 600;
        color: #333333;
        letter-spacing: 0;
      }
    }
    .detail_body_food{
      .line_food_des{

      }
    }
    .detail_body_msg{
      border-top: 1px solid #eee;
      text-align: center;
      .body_msg_head{
        margin-top: 30px;
        margin-bottom: 30px;
        .center_msg_p{
          height: 40px;
          line-height: 40px;
          font-family: PingFangSC-Regular;
          font-size: 28px;
          color: #666666;
          letter-spacing: 0;
          text-align: center;
          margin: 10px 0;
          .price_color{
            color: #F76833;
          }
        }
      }
      .body_msg_body{
        margin-top: 20px;
        margin-bottom: 50px;
        .center_msg_big_p{
          height: 45px;
          line-height: 45px;
          font-family: PingFangSC-Semibold;
          font-size: 32px;
          font-weight: 800;
          color: #666666;
          letter-spacing: 0;
          text-align: center;
          margin-top: 20px;
          margin-bottom: 50px;
        }
        .center_msg_p{
          height: 40px;
          line-height: 40px;
          font-family: PingFangSC-Regular;
          font-size: 28px;
          color: #666666;
          letter-spacing: 0;
          text-align: center;
          margin: 10px 0;
        }
        .center_msg_erweima{
          border: 1px solid #ddd;
          width: 300px;
          height: 300px;
          margin: 20px auto;
          img{
            width: 300px;
            height: 300px;
          }
        }
        .center_msg_org{
          height: 40px;
          line-height: 40px;
          font-family: PingFangSC-Regular;
          font-size: 24px;
          color: #F76833;
          letter-spacing: 0;
          text-align: center;
        }
      }
    }
  }
  .order_detail_footer{
    width: 100%;
    height: 91px;
    line-height: 91px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: #393939;
    text-align: center;
    .detail_footer_all{
      font-family: PingFangSC-Semibold;
      font-size: 30px;
      color: #FEFEFE;
      letter-spacing: 0;
      text-align: center;
    }
  }
}
</style>
