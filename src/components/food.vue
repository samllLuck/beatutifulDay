<template>
  <div class="food_detail" v-if="data">
    <div class="food_pic">
      <img :src="data_.data.picUrl" alt="">
    </div>
    <div class="food_des">
      <span class="des_name">{{data_.data.foodName}}</span>
      <span class="des_remain">剩余<span class="f60">&nbsp;{{data_.data2.flag===1?data_.data.left1:data_.data.left2}}&nbsp;</span>份</span>
      <!-- <span class="pungency_index">辣味指数：<span></span></span>
      <span class="recommend_index">推荐指数：<span></span></span> -->
      <span class="des_price"><i class="rmb_symbol">&yen;&nbsp;</i>{{data_.data.price}}</span>
      <span class="des_endTime">{{data_.data.endTime}}</span>
    </div>
    <div class="operate_num">
      <span v-if="data_.data.foodSum>0" class="num_reduce" @click="reduce_db(data_.data, data_.data2)"></span>
      <span v-if="data_.data.foodSum>0" class="num_change">{{data_.data.foodSum}}</span>
      <!-- 点击商品爽了大于单个商品限购数量 ，不可点-->
      <!-- 已选择其他日期商品，再点当前日期的菜品，不可点 -->
      <!-- 剩余菜品为 0 时，不可点 -->
      <span :class="['num_add', (data_.data.ext1 === 'no' || data_.data.foodSum >= data_.data.foodNumber || (this.$store.state.cartInfos.totalNumber !== 0 && this.$store.state.cartList.title !== data_.data2.title)|| canNumber === 0)?'num_add_max':'']" @click="add_db(data_.data, data_.data2)"></span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      allChoose: 0,
      singleChoose: 0,
      canNumber: 1,
      week: this.$store.state.cartList.title,
      isGray: 0,
      data_: {
        data: this.data,
        data2: this.data2
      }
    }
  },
  props: ['data', 'data2'],
  watch: {
    data () {
      this.data_.data = this.data
      this.canNumber = this.data_.data2.flag === 1 ? this.data_.data.left1 : this.data_.data.left2
    }
    // data2 () {
    //   this.data_.data2 = this.data2
    //   // this.data_.data2.chooseSum = this.data2.chooseSum
    //   // this.data_.data2.title = this.data2.title
    //   // this.data_.data2.time = this.data2.time
    //   console.log('data2=' + this.data2)
    // }
  },
  mounted () {
    this.isGray = (this.data_.data.ext1 === 'no' || this.data_.data.foodSum >= this.data_.data.foodNumber || (this.$store.state.cartInfos.totalNumber !== 0 && this.$store.state.cartList.title !== this.data_.data2.title)) ? 1 : 0
    console.log('haha' + this.isGray)
  },
  computed: {
    cartInfos () {
      console.log('food你好！')
      return this.$store.getters.getInfos
    },
    cartList () {
      console.log('food你好，世界！')
      return this.$store.getters.getCartList
    }
  },
  methods: {
    add_db (shop, data2) {
      console.log('title--111=', this.data_.data2)
      console.log('title--222=', this.$store.state.cartList.title)
      if (this.data_.data.ext1 === 'no' || (this.data_.data.foodSum >= this.data_.data.foodNumber || (this.$store.state.cartInfos.totalNumber !== 0 && this.$store.state.cartList.title !== this.data_.data2.title) || !this.canNumber)) {
        if (this.$store.state.cartInfos.totalNumber !== 0 && this.$store.state.cartList.title !== this.data_.data2.title) {
          let jumpMsg = {
            title: '温馨提示',
            content: '预定只能预定某一天的订单哦！',
            btn: '确定',
            btnClick: function (obj) {
              console.log('这里执行路由跳转')
              obj.jumpShow = false
            },
            jumpShow: true
          }
          this.$emit('listenToChildEvent', jumpMsg, true)
        }
        return
      }
      let name = shop.foodName
      let max = shop.foodNumber
      let title = data2.title
      // 检测该菜品是否已经在购物车中，如果存在修改state.curState为，true并设置state.curIndex为当前菜品在购物车中的索引
      this.$store.dispatch('check_db', {name, title})
      // 如果该菜品已存在，先自增当前菜品的数量num，再设置购物车的数量
      // 如果不存在，直接往购物车中push一个新的菜品
      if (this.$store.state.curIndex !== -1) {
        console.log('add_db')
        this.$store.dispatch('add_db', {max})
      } else {
        console.log('create_db from food.vue')
        this.$set(shop, 'foodSum', 1)
        this.$store.dispatch('create_db', {shop, data2})
      }
    },
    reduce_db (shop, data2) {
      let name = shop.foodName
      let min = 0
      let title = data2.title
      this.$store.dispatch('check_db', {name, title})
      shop.foodSum = parseInt(shop.foodSum)
      this.$store.dispatch('reduce_db', {min})
    }
  }
}
</script>

<style lang="less">
.f60{
  color: #f60;
}
.rmb_symbol{
  font-size: 12px;
  font-style: normal;
}
.food_detail {
  // width: 100%;
  // height: 163px;
  height: 220px;
  overflow: hidden;
  padding-top: 27px;
}
.food_pic{
  width: 136px;
  height: 136px;
  float: left;
  margin-left: 20px;
  margin-top: 10px;
}
.food_pic img{
  width: 136px;
  height: 136px;
}
.food_des{
  float: left;
  margin-left: 20px;
  .des_endTime{
    font-family: PingFangSC-Regular;
    font-size: 22px;
    color: #666666;
    letter-spacing: 0;
    text-align: left;
    display: block;
    height: 30px;
    line-height: 30px;
    margin-top: 5px;
  }
}
.des_name{
  font-family: PingFangSC-Semibold;
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  letter-spacing: 0;
  text-align: left;
  display: block;
  height: 40px;
  line-height: 40px;
  margin-top: 5px;
}
.des_remain{
  font-family: PingFangSC-Regular;
  font-size: 22px;
  color: #666666;
  letter-spacing: 0;
  text-align: left;
  display: block;
  height: 30px;
  line-height: 30px;
  margin-top: 5px;
}
// .pungency_index{
//   font-family: PingFangSC-Regular;
//   font-size: 22px;
//   color: #666666;
//   letter-spacing: 0;
//   text-align: left;
//   display: block;
//   height: 30px;
//   line-height: 30px;
//   margin-top: 5px;
// }
// .recommend_index{
//   font-family: PingFangSC-Regular;
//   font-size: 22px;
//   color: #666666;
//   letter-spacing: 0;
//   text-align: left;
//   display: block;
//   height: 30px;
//   line-height: 30px;
//   margin-top: 5px;
// }
.des_price{
  font-family: PingFangSC-Semibold;
  font-size: 28px;
  color: #F76833;
  letter-spacing: 0;
  text-align: left;
  display: block;
  height: 40px;
  line-height: 40px;
  margin-top: 16px;
}
.operate_num{
  float: right;
  margin-right: 20px;
  position: relative;
  top: 0;
  width: 140px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.num_reduce{
  float: left;
  width: 40px;
  height: 40px;
  background: url('../assets/reduce_gray_icon.png') no-repeat 0 0 ;
  background-size: 100% 100%;
}
.num_add{
  float: right;
  width: 40px;
  height: 40px;
  background: url('../assets/add_light_icon.png') no-repeat 0 0 ;
  background-size: 100% 100%;
}
.num_change{
  font-family: PingFangSC-Semibold;
  font-size: 28px;
  color: #000000;
  letter-spacing: 0;
}
.num_add_max{
  background-image: url('../assets/add_gray_icon.png')
}
</style>
