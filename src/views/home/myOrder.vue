<template>
  <div class="myOrder">
    <div class="head_list">
      <div :class="['three_status wait_pay', wait_pay_btn?'select_wait_btn':'']" @click="waitPay">待付款</div>
      <div :class="['three_status wait_get', wait_get_btn?'select_wait_btn':'']" @click="waitGet">待取货</div>
      <div :class="['three_status wait_over', wait_over_btn?'select_wait_btn':'']" @click="waitOver">已完成</div>
    </div>
    <div class="main-body" v-show="nodata" ref="reportList">
      <!-- <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottomPullText='bottomPullTextVal' :bottomDropText='bottomDropTextVal' :bottomLoadingText='bottomLoadingTextVal' :autoFill="false" @bottom-status-change="handleBottomChange" ref="loadmore"> -->
      <pull-to
      :wrapper-height="wrapperHeight"
      :bottom-load-method="loadMore"
       >
        <ul v-if="Object.keys(arrData).length">
          <li v-if="arrData.list.length" v-for="(item,index) in arrData.list" :key="index">
            <div class="line_one">
              <span class="one_left">第一二食堂（{{item.ext2}}）</span>
              <span class="one_right">{{item.pay === 1?'待支付':(item.receive === 1?'待取货':'已完成')}}</span>
            </div>
            <div class="line_two">
              <span class="two_left">总计：<span class="price_color">{{item.money}}元</span>（{{item.ext1}}件）</span>
              <span class="two_right" @click="goOrderList(item.id)"><span class="two_right_icon"></span></span>
            </div>
            <div class="line_three">
              <span class="three_left">订单编号：{{item.orderNumber}}</span>
            </div>
            <div class="line_four" v-if="item.createTime">
              <span class="four_left" v-if="item.createTime">预定时间：{{item.createTime}}</span>
            </div>
            <div class="line_five">
              <span class="five_left">取货日期：{{item.receiveTime}}</span>
            </div>
          </li>
        </ul>
      </pull-to>
      <!-- </mt-loadmore> -->
    </div>
    <div class="main-body-no-data" v-show="!nodata">
      <span>当前无订单信息！</span>
    </div>
  </div>
</template>
<script>
import http from '@/utils/http'
import api from '@/utils/api'
import PullTo from 'vue-pull-to'
export default {
  components: {
    PullTo
  },
  data () {
    return {
      arrData: {},
      arrDataList: [],
      arrMsg: {},
      nodata: true,
      wait_pay_btn: 1,
      wait_get_btn: 0,
      wait_over_btn: 0,
      searchCondition: {
        pageVal: 1,
        pageSize: 10
      },
      allLoaded: false, // 是否可以上拉属性，false可以上拉，true为禁止上拉
      status: '',
      // bottomPullTextVal: '上划加载更多数据',
      // bottomDropTextVal: '释放更新',
      // bottomLoadingTextVal: '加载中...',
      // topPullTextVal: '下拉加载更多数据',
      // topDropTextVal: '释放更新',
      // topLoadingTextVal: '到顶部了...',
      // topStatus: '',
      // bottomStatus: '',
      hasNextPage: true
    }
  },
  watch: {
    data () {
      this.arrData = this.arrData
    }
  },
  mounted () {
    this.getOrderList()
    // 父控件要加上高度，否则会出现上拉不动的情况
    this.$nextTick(() => {
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      this.$refs.reportList.style.height = h + 'px'
    })
  },
  computed: {
    cartInfos () {
      console.log('orderSure你好！')
      return this.$store.getters.getInfos
    },
    cartList () {
      console.log('orderSure你好，世界！')
      return this.$store.getters.getCartList
    },
    wrapperHeight () {
      let viewHeight =
        window.innerHeight ||
        document.body.clientHeight ||
        document.documentElement.clientHeight
      let actualHeight = viewHeight - 50
      return actualHeight + 'px'
    }
  },
  methods: {
    /*
    getList () {
      if (this.searchCondition.pageVal === 1) {
        this.$http.post(url, {
          'Pageindex': this.searchCondition.pageVal,
          'PageSize': this.searchCondition.pageSize
        }, {emulateJSON: true, headers: {}}).then(data => {
          if (data.body.Data.length === 0) {
            this.nodata = false
          } else if (data.body.Data.length === this.searchCondition.pageSize) {
            this.reportList = data.body.Data
          } else {
            this.reportList = data.body.Data
            this.allLoaded = true
          }
        }, err => {
          console.log('error' + err)
        })
      } else {
        this.$http.post(url, {
          'Pageindex': this.searchCondition.pageVal,
          'PageSize': this.searchCondition.pageSize
        }, {emulateJSON: true, headers: {}}).then(data => {
          if (data.body.Data.length === this.searchCondition.pageSize) {
            for (let i = 0; i < this.searchCondition.pageSize; i++) {
              this.reportList.push(data.body.Data[i])
            }
          } else {
            for (let i = 0; i < data.body.Data.length; i++) {
              this.reportList.push(data.body.Data[i])
            }
            this.allLoaded = true
          }
        }, err => {
          console.log('error' + err)
        })
      }
    },
    */
    loadMore (loaded) {
      console.log('加载更多')
      if (this.hasNextPage) {
        // 将开关关闭
        this.searchCondition.pageVal++
        this.getOrderList(loaded)
      } else {
        loaded('done')
      }
    },
    loadBottom () {
      if (!this.hasNextPage) {
        return null
      }
      this.searchCondition.pageVal++
      this.$refs.loadmore.onBottomLoaded()
      this.getOrderList()
    },
    loadTop () {
      console.log('到顶部了')
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    handleBottomChange (status) {
      this.bottomStatus = status
    },
    waitPay () {
      console.log('调接口，传参数1')
      this.wait_pay_btn = 1
      this.wait_get_btn = 0
      this.wait_over_btn = 0
      this.getOrderList()
    },
    waitGet () {
      console.log('调接口，传参数2')
      this.wait_pay_btn = 0
      this.wait_get_btn = 1
      this.wait_over_btn = 0
      this.getOrderList()
    },
    waitOver () {
      console.log('调接口，传参数3')
      this.wait_pay_btn = 0
      this.wait_get_btn = 0
      this.wait_over_btn = 1
      this.getOrderList()
    },
    getQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2]); return null
    },
    formatDateTime (date) {
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      let second = date.getSeconds()
      second = second < 10 ? ('0' + second) : second
      this.time = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    getOrderList: async function (callBack) {
      let pay_, receive_
      if (this.wait_pay_btn === 1) {
        pay_ = 1
        receive_ = 1
      } else if (this.wait_get_btn === 1) {
        pay_ = 2
        receive_ = 1
      } else if (this.wait_over_btn === 1) {
        pay_ = 2
        receive_ = 2
      }
      let params = {
        code: this.getQueryString('code') || 'test',
        agentId: this.getQueryString('agentId') || 1000009,
        pageNo: this.searchCondition.pageVal, // 页码，默认是第一页
        pageSize: this.searchCondition.pageSize, // 每页显示的记录数，默认是10
        pay: pay_, // 是否已支付 1：未支付，2：已支付
        receive: receive_ // 是否领取 1：未领取，2：已领取
      }
      const res = await http.get(api.getOrderList, params)
      if (res.status === 200) {
        console.log('请求成功')
        console.log('lalala', res)
        if (typeof callBack === 'function') {
          callBack('done')
        }
        // this.arrData = res.data.data.lists
        this.hasNextPage = res.data.data.lists.hasNextPage
        if (this.searchCondition.pageVal === 1) {
          this.arrData = res.data.data.lists
          if (res.data.data.lists.list.length === 0) {
            this.nodata = false
          } else if (res.data.data.lists.list.length === this.searchCondition.pageSize) {
            this.nodata = true
            this.arrData.list = res.data.data.lists.list
          } else {
            this.nodata = true
            this.arrData.list = res.data.data.lists.list
            this.allLoaded = true
          }
        } else {
          if (res.data.data.lists.list.length === this.searchCondition.pageSize) {
            for (let i = 0; i < this.searchCondition.pageSize; i++) {
              this.arrData.list.push(res.data.data.lists.list[i])
            }
          } else {
            for (let i = 0; i < res.data.data.lists.list.length; i++) {
              this.arrData.list.push(res.data.data.lists.list[i])
            }
            this.allLoaded = true
          }
        }
      } else {
        console.log('fail')
        // this.$vux.alert.show({
        //   title: '111',
        //   content: '11！',
        //   onShow () {
        //     console.log('Plugin: I\'m showing')
        //   },
        //   onHide () {
        //     console.log('Plugin: I\'m hiding')
        //   }
        // })
      }
    },
    goOrderList (id) {
      this.$router.push({
        name: 'orderList',
        params: {
          name: 'orderList',
          data: id
        }
      })
    }
  }
}
</script>
<style lang="less">
ul,li{
  list-style: none;
}
.myOrder{
  overflow: hidden;
  .head_list{
    display: flex;
    .three_status{
      flex: 1;
      text-align: center;
      height: 80px;
      line-height: 80px;
      font-size: 28px;
      border-bottom: 1px solid #ddd;
      color: #000;
    }
    .wait_pay{
      border-right: 1px solid #ddd;
    }
    .wait_get{
      border-right: 1px solid #ddd;
    }
    .wait_over{}
    .select_wait_btn{
      background: #4D90D5;
      color: #fff;
    }
  }
  .main-body{
    /* 加上这个才会有当数据充满整个屏幕，可以进行上拉加载更多的操作 */
    overflow: scroll;
  }
  .main-body-no-data{
    text-align: center;
    margin: auto;
    margin-top: 70%;
    font-size: 36px;
  }
  ul{
    li{
      width: 100%;
      .line_one{
        height: 120px;
        line-height: 120px;
        border-bottom: 1px solid #eee;
        .one_left{
          font-family: PingFangSC-Regular;
          font-size: 28px;
          color: #333333;
          letter-spacing: 0;
          float: left;
          margin-left: 20px;
        }
        .one_right{
          font-family: PingFangSC-Regular;
          font-size: 28px;
          color: #F76833;
          letter-spacing: 0;
          float: right;
          margin-right: 20px;
        }
      }
      .line_two{
        height: 100px;
        line-height: 100px;
        border-bottom: 1px solid #eee;
        .two_left{
          font-family: PingFangSC-Regular;
          font-size: 28px;
          color: #333333;
          letter-spacing: 0;
          float: left;
          margin-left: 20px;
          .price_color{
            color: #F76833;
          }
        }
        .two_right{
          width: 20%;
          height: 100px;
          float: right;
          .two_right_icon{
            float:right;
            width: 28px;
            height: 40px;
            margin-top: 30px;
            margin-right: 20px;
            background: url('../../assets/go_arrow_icon.png') no-repeat 0 0;
            background-size: 100% 100%;
          }
        }
      }
      .line_three{
        height: 120px;
        line-height: 120px;
        border-bottom: 1px solid #eee;
        .three_left{
          font-family: PingFangSC-Regular;
          font-size: 32px;
          font-weight: 600;
          color: #f00;
          letter-spacing: 0;
          float: left;
          margin-left: 20px;
        }
      }
      .line_four{
        height: 100px;
        line-height: 100px;
        border-bottom: 1px solid #eee;
        .four_left{
          font-family: PingFangSC-Regular;
          font-size: 28px;
          color: #333333;
          letter-spacing: 0;
          float: left;
          margin-left: 20px;
        }
      }
      .line_five{
        height: 100px;
        line-height: 100px;
        border-bottom: 20px solid #eee;
        .five_left{
          font-family: PingFangSC-Regular;
          font-size: 28px;
          color: #333333;
          letter-spacing: 0;
          float: left;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
