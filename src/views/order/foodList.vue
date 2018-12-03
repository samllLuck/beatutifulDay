<template>
  <div class="main">
    <div class="main_head">
      <span class="head_big_font">预定</span>
      <span class="head_gray_font">（图片仅作参考，以实物为准）</span>
      <!-- <div class="choose_eat_time">
        <span :class="['have_breakfast', whenEat === 0?'choose_eat_time':'']" @click="eatTime('have_breakfast')">早餐</span>
        <span :class="['have_lunch', whenEat === 1?'choose_eat_time':'']" @click="eatTime('have_lunch')">中餐</span>
        <span :class="['have_dinner', whenEat === 2?'choose_eat_time':'']" @click="eatTime('have_dinner')">晚餐</span>
      </div> -->
    </div>
    <div class="main_body" v-if="Object.keys(data).length">
      <div class="body_left">
        <!-- <ul>
          <li v-for="(item,index) in data.menuFoodList" :class="['weeks_day', index == choosedDay ? 'selected':'']" @click="getSelected(index)" :key="index">{{item.title}}</li>
        </ul> -->
        <div class="swiper-container">
          <ul class="swiper-wrapper">
            <li v-if="data.menuFoodList.length" v-for="(item,index) in data.menuFoodList" :class="['swiper-slide weeks_day', index == choosedDay ? 'selected':'']" @click="getSelected(index)" :key="index">
              <div class="item-week">{{item.title}}</div>
              <div class="item-date">（{{item.time.split('-')[1]}}月{{item.time.split('-').pop()}}号）</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="body_right">
        <div class="scroll_food_div">
          <ul>
            <li class="days_foods" v-for="(item,index) in data.menuFoodList[choosedDay].list" :key="index">
              <food :data="item" :data2="data2" v-on:listenToChildEvent="showMsgFromChild"></food>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="main_body_no_data" v-if="Object.keys(data).length === 0">
      <span>当前无预定信息！</span>
    </div>
    <div v-if="Object.keys(data).length" :class="['main_footer', cartInfos.totalNumber != 0?'have_some_choose':'']">
      <div class="footer_left">
        <span class="cart_num" @click="cartNumDetail">
          <span v-if="cartInfos.totalNumber != 0" class="small_ball">{{cartInfos.totalNumber}}</span>
        </span>
        <span class="cart_money">
          <i class="RMB_symbol">&yen;</i>
          <span class="RMb_number">{{cartInfos.totalMoney}}</span>
        </span>
      </div>
      <div class="footer_right" @click="goPay">
        <span class="choose_ok">选好了</span>
      </div>
    </div>
    <div class="bg_instruction" v-if="bg_block_">
      <span class="instruction_words">尊敬的用户，上班时间不支持预定！</span>
      <!-- <span class="instruction_words">预定上午时间段：9:00-12:00</span>
      <span class="instruction_words">预定下午时间段：14:00-18:00</span>
      <span class="instruction_words">注意：周六周日以及法定节假日照常提供预定功能！</span> -->
    </div>
    <div class="bg_instruction_block" v-if="bg_block_"></div>
    <div class="bg_block" v-if="bg_block"></div>
    <div class="all_food_detail" v-if="bg_block&&Object.keys(data).length">
      <div class="detail_head">
        <span class="star_icon"></span>
        <span class="detail_weekdays">{{cartList.title}}</span>
        <span class="detail_clear" @click="clear_db"><i class="clear_icon"></i>清空</span>
      </div>
      <div class="detail_body">
        <ul>
          <li v-for="(item,index) in cartList.list" :key="index">
            <div class="detail_line" v-if="item.foodSum&&item.foodSum>0">
              <div class="line_left_name">
                <span class="line_food_name">{{item.foodName}}</span>
              </div>
              <div class="line_right_name">
                <span class="line_num_price">&yen;{{item.price}}</span>
                <div class="line_num_three">
                  <span class="line_num_reduce" @click="action_cart(index, 'reduce_db', 0)"></span>
                  <span class="line_num_change">{{item.foodSum}}</span>
                  <span :class="['line_num_add', item.foodSum >= item.foodNumber?'line_num_add_max':'']" @click="action_cart(index, 'add_db', item.foodNumber)"></span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <hello-world v-if="jumpShow" :data="jumpMsg" v-on:someMsgFromChild="childMsg"></hello-world>
  </div>
</template>

<script>
import Swiper from 'swiper'
import food from '@/components/food.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import http from '@/utils/http'
import api from '@/utils/api'
// import VConsole from 'vconsole/dist/vconsole.min.js'
export default {
  components: {
    food,
    HelloWorld
  },
  data () {
    return {
      flag: '', // 判断是否内部员工
      swiper: null,
      whenEat: 0,
      foodCount: 0, // 当前日期可购总数
      chooseNumber: 0, // 记录所选个数
      chooseNumberMoney: 0, // 记录所有金额
      onlyChoose: null, // 记录哪个选菜了，其他的日期不可选了
      choosedDay: 0, // 记录当前展示的是周几的菜单,
      getTime: null, // 取货时间
      bg_block: 0,
      bg_block_: 0,
      selecteData: {},
      data: {},
      data2: {
        flag: '',
        id: '',
        time: '',
        title: '',
        chooseSum: '',
        userId: ''
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
      console.log('你好！')
      return this.$store.getters.getInfos
    },
    cartList () {
      console.log('你好，世界！')
      return this.$store.getters.getCartList
    }
  },
  mounted () {
    this.getFoodList()
    // 初始化时，将购物车的菜品数量绑定到菜品列表中
    // if (Object.keys(data).length) {
    // let list = this.$store.state.cartList.list
    // let title = this.$store.state.cartList.title
    //   for (let i = 0, len = this.data.menuFoodList.length; i < len; i++) {
    //     if (title === this.data.menuFoodList[i].title) {
    //       for (let k = 0, leg = this.data.menuFoodList[i].list.length; k < leg; k++) {
    //         for (let j = 0, leng = list.length; j < leng; j++) {
    //           if (list[j].foodName === this.data.menuFoodList[i].list[k].foodName) {
    //             this.$set(this.data.menuFoodList[i].list, k, list[j])
    //             break
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    // this.data2.time = this.data.menuFoodList[this.choosedDay].time
    // this.data2.title = this.data.menuFoodList[this.choosedDay].title
    // this.data2.chooseSum = this.data..menuFoodList[this.choosedDay]foodCount
    this.initSwiper()
    // let vConsole = new VConsole()
    // console.log('vvv=', vConsole)
  },
  methods: {
    childMsg (sth) {
      sth(this)
    },
    initSwiper () {
      let self = this
      this.swiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        slidesPerView: 7,
        on: {
          click: function () {
            console.log('这里调菜品的接口,这里的this是指：' + this)
            console.log(self)
          }
        }
      })
    },
    addData () {
      this.data2.flag = this.data.flag
      this.data2.id = this.data.menuFoodList[this.choosedDay].id
      this.data2.time = this.data.menuFoodList[this.choosedDay].time
      this.data2.title = this.data.menuFoodList[this.choosedDay].title
      this.data2.chooseSum = this.data.menuFoodList[this.choosedDay].foodCount
      this.data2.userId = this.data.wxUser.userId
    },
    eatTime (className) {
      switch (className) {
        case 'have_breakfast': this.whenEat = 0
          break
        case 'have_lunch': this.whenEat = 1
          break
        case 'have_dinner': this.whenEat = 2
          break
        default: break
      }
    },
    getSelected (index) {
      this.choosedDay = index
      this.addData()
    },
    cartNumDetail () {
      if (this.$store.state.cartList.list.length > 0) {
        this.bg_block = !this.bg_block
      }
    },
    showMsgFromChild (data) {
      let self_ = this
      self_.jumpMsg.title = data.title
      self_.jumpMsg.content = data.content
      self_.jumpMsg.btn = data.btn
      self_.jumpMsg.btnClick = data.btnClick
      self_.jumpShow = data.jumpShow
    },
    clear_db () {
      this.$store.dispatch('clear_local')
      this.bg_block = false
    },
    goPay () {
      if (this.$store.state.cartList.list.length && this.$store.state.cartInfos.totalNumber > 0) {
        this.$router.push({
          name: 'orderSure',
          params: {
            name: 'orderSure'
          }
        })
      }
    },
    action_cart (index, type, maxormin) {
      if (type === 'add_db') {
        // this.cartInfos.totalNumber >= this.data.menuFoodList[this.choosedDay].foodCount  ||总数限购
        if (this.cartList.list[index].foodSum >= this.cartList.list[index].foodNumber) {
          return
        }
      }
      // 先更新当前索引
      this.$store.dispatch('update_cur_shop_status', {index})
      // 执行更新state动作
      let min = maxormin
      let max = maxormin
      type === 'add_db' ? this.$store.dispatch(type, {max}) : this.$store.dispatch(type, {min})
      // this.$store.dispatch(type, {maxmin})
      if (!this.cartInfos.totalNumber) {
        this.bg_block = false
        console.log('L=' + this.cartList.list.length)
      }
    },
    getQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      let r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2]); return null
    },
    getFoodList: async function () {
      let params = {
        code: this.getQueryString('code') || 'test',
        agentId: this.getQueryString('agentId') || 1000009
      }
      const res = await http.get(api.getFoodList, params)
      if (res.status === 200) {
        console.log('请求成功!' + res.data)
        this.data = res.data.data
        // 初始化时，将购物车的菜品数量绑定到菜品列表中
        if (Object.keys(this.data).length) {
          let list = this.$store.state.cartList.list
          let title = this.$store.state.cartList.title
          for (let i = 0, len = this.data.menuFoodList.length; i < len; i++) {
            if (title === this.data.menuFoodList[i].title) {
              for (let k = 0, leg = this.data.menuFoodList[i].list.length; k < leg; k++) {
                for (let j = 0, leng = list.length; j < leng; j++) {
                  if (list[j].foodName === this.data.menuFoodList[i].list[k].foodName) {
                    this.$set(this.data.menuFoodList[i].list, k, list[j])
                    break
                  }
                }
              }
            }
          }
        }
        this.data2.flag = this.data.flag
        this.data2.id = this.data.menuFoodList[this.choosedDay].id
        this.data2.time = this.data.menuFoodList[this.choosedDay].time
        this.data2.title = this.data.menuFoodList[this.choosedDay].title
        this.data2.chooseSum = this.data.menuFoodList[this.choosedDay].foodCount
        this.data2.userId = this.data.wxUser.userId
        if (res.data.errcode === 9) {
          this.bg_block_ = 1
        }
      } else {
        console.log('fail!!!')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  padding: 0 10px;
  background-color: #fff;
  .main_head{
    width: 100%;
    height: 63px;
    line-height: 63px;
    background: #ffffff;
    box-shadow: 0 2px 3px 0 rgba(222, 222, 222, 0.5);
    border-bottom: 1px solid #eee;
    .head_big_font{
      font-family: Beirut;
      font-size: 32px;
      font-weight: 600;
      color: #F76833;
      letter-spacing: 0;
      text-align: left;
      margin-left: 5px;
    }
    .head_gray_font{
      font-family: PingFangSC-Regular;
      font-size: 26px;
      color: #F76833;
      letter-spacing: 0;
      text-align: left;
      margin-left: 20px;
    }
    .choose_eat_time{
      float: right;
      span{
        float: left;
        width: 80px;
        text-align: center;
        height: 39px;
        line-height: 39px;
        margin-top: 12px;
        border: 1px solid #999;
        font-size: 26px;
        margin-right: 15px;
      }
      .have_breakfast{
        float: left;
      }
      .have_lunch{
        float: left;
      }
      .have_dinner{
        float: left;
      }
      .choose_eat_time{
        border: 1px solid #F76833;
        color: #fff;
        background: #F76833;
      }
    }
  }
  .main_body{
    width: 100%;
    overflow: hidden;
    .body_left{
      width: 25%;
      float: left;
      .weeks_day{
        height: 96px !important;
        line-height: 96px;
        text-align: center;
        background: #F6F6F6;
        border-bottom: 1px solid #eee;
        font-family: PingFangSC-Regular;
        font-size: 28px;
        color: #5C5C5C;
        letter-spacing: 0;
        .item-week{
          width: 100%;
          height: 48px;
          line-height: 48px;
          float: left;
          text-align: center;
        }
        .item-date{
          width: 100%;
          height: 48px;
          line-height: 48px;
          float: left;
          text-align: center;
          font-size: 20px;
        }
      }
      .selected{
        // background: #ffffff;
        // color: #000000;
        background: #4D90D5;
        color: #ffffff;
      }
    }
    .body_right{
      width: 75%;
      float: right;
      margin-bottom: 91px;
      .scroll_food_div{
        .days_foods{
          padding-left: 10px;
        }
      }
    }
  }
  .main_body_no_data{
    text-align: center;
    margin: auto;
    margin-top: 70%;
    font-size: 36px;
  }
  .main_footer{
    width: 100%;
    height: 91px;
    line-height: 91px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    .footer_left{
      width: 72%;
      height: 91px;
      line-height: 91px;
      background: #393939;
      float: left;
      position: relative;
      .cart_num{
        width: 91px;
        height: 91px;
        position: absolute;
        top: -20px;
        left: 20px;
        background: url('../../assets/cart_gray_icon.png') no-repeat 0 0 ;
        background-size: 100% 100%;
        z-index: 100;
        .small_ball{
          position: absolute;
          top:-4px;
          right: -6px;
          width: 30px;
          height: 30px;
          line-height: 30px;
          background: #F76833;
          border-radius: 15px;
          text-align: center;
          color: #fff;
        }
      }
      .cart_money{
        margin-left: 125px;
        font-family: PingFangSC-Regular;
        font-size: 28px;
        color: #EFEFEF;
        letter-spacing: 0;
        text-align: left;
        .RMB_symbol{
          font-style: normal;
        }
        .RMb_number{
          font-style: normal;
        }
      }
    }
    .footer_right{
      width: 28%;
      height: 91px;
      line-height: 91px;
      background: #606060;
      float: right;
      text-align: center;
      .choose_ok{
        font-family: PingFangSC-Semibold;
        font-size: 30px;
        color: #A9A9A9;
        letter-spacing: 0;
        text-align: left;
      }
    }
  }
  .have_some_choose{
    .footer_left{
      .cart_num{
        background-image: url('../../assets/cart_light_icon.png');
      }
    }
    .footer_right{
      background: #4D90D5;
      .choose_ok{
        color: #FFFFFF;
      }
    }
  }
  .bg_block{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.5;
    background-color: #000;
    z-index: 98;
  }
  .bg_instruction_block{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.5;
    background-color: #000;
    z-index: 98;
  }
  .bg_instruction{
    height: 300px;
    overflow-y: scroll;
    position: fixed;
    top: 30%;
    left: 15%;
    right: 15%;
    background-color: #ffffff;
    padding-top: 10px;
    z-index: 99;
    .instruction_words{
      float: left;
      // height: 28px;
      // line-height: 28px;
      padding-left: 20px;
      padding-right: 20px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
  .all_food_detail{
    position: fixed;
    bottom: 91px;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: #ffffff;
    .detail_head{
      width: 100%;
      height: 64px;
      line-height: 64px;
      background: #F0F0F0;
      .star_icon{
        float: left;
        height: 24px;
        width: 24px;
        background: url('../../assets/star_light_icon.png') no-repeat 0 0 ;
        background-size: 100% 100%;
        margin-top: 16px;
        margin-left: 20px;
      }
      .detail_weekdays{
        font-family: PingFangSC-Regular;
        font-size: 24px;
        color: #666666;
        letter-spacing: 0;
        float: left;
        margin-left: 10px;
      }
      .detail_clear{
        font-family: PingFangSC-Regular;
        font-size: 24px;
        color: #999999;
        letter-spacing: 0;
        float: right;
        margin-right: 30px;
        .clear_icon{
          float: left;
          width: 28px;
          height: 40px;
          background: url('../../assets/cart_clear_icon.png') no-repeat 0 0 ;
          background-size: 100% 100%;
          margin-top: 10px;
          margin-right: 10px;
        }
      }
    }
    .detail_body{
      .detail_line{
        height: 120px;
        border-bottom: 1px solid #eee;
        .line_left_name{
          float:left;
          height: 120px;
          line-height: 120px;
          margin-left: 30px;
          .line_food_name{
            font-family: PingFangSC-Regular;
            font-size: 24px;
            color: #333333;
            letter-spacing: 0;
            text-align: left;
          }
        }
        .line_right_name{
          float: right;
          height: 120px;
          line-height: 120px;
          margin-right: 30px;
          .line_num_price{
            float: left;
            font-family: PingFangSC-Semibold;
            font-size: 28px;
            color: #F76833;
            letter-spacing: 0;
            text-align: right;
          }
          .line_num_three{
            float: left;
            position: relative;
            top: 40px;
            width: 140px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            margin-left: 30px;
            .line_num_reduce{
              float: left;
              width: 40px;
              height: 40px;
              background: url('../../assets/reduce_gray_icon.png') no-repeat 0 0 ;
              background-size: 100% 100%;
            }
            .line_num_change{
              font-family: PingFangSC-Semibold;
              font-size: 28px;
              color: #000000;
              letter-spacing: 0;
            }
            .line_num_add{
              float: right;
              width: 40px;
              height: 40px;
              background: url('../../assets/add_light_icon.png') no-repeat 0 0 ;
              background-size: 100% 100%;
            }
            .line_num_add_max{
              background-image: url('../../assets/add_gray_icon.png')
            }
          }
        }
      }
    }
  }
}
.swiper-container{
  width: 100%;
  height: 672px;
  margin: 0;
  .swiper-wrapper{
    display: block;
  }
}
</style>
