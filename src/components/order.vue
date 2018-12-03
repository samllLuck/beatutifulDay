<template>
  <div class="full_width" v-if="data&&data.foodSum>0">
    <div class="full_width_50">
        <span class="span_left">{{data.foodName}}</span>
    </div>
    <div class="full_width_10">
        <span class="span_middle">x&nbsp;{{data.foodSum}}</span>
    </div>
    <div class="full_width_40">
        <span class="span_right">&yen;&nbsp;{{data.price}}</span>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: ['data']
}
</script>
<style lang="less">
.full_width{
  width: 100%;
  height: 90px;
  line-height: 90px;
  .full_width_50{
    width: 50%;
    float: left;
    text-align: center;
    .span_left{
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #333333;
      letter-spacing: 0;
      text-align: left;
    }
  }
  .full_width_10{
    width: 10%;
    float: left;
    text-align: center;
    .span_middle{
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #000000;
      letter-spacing: 0;
      text-align: left;
    }
  }
  .full_width_40{
    width: 40%;
    float: left;
    .span_right{
      margin-left: 20px;
      font-family: PingFangSC-Regular;
      font-size: 28px;
      color: #333333;
      letter-spacing: 0;
      text-align: right;
    }
  }
}
</style>
