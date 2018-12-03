<template>
  <div class="hello">
    <div class="hello-opacity"></div>
    <div class="hello-content">
      <div class="hello-top">
        <strong class="hello-top-title">{{data.title}}</strong>
      </div>
      <div class="hello-mid">
        <div class="hello-mid-content">{{data.content}}</div>
      </div>
      <div class="hello-bot">
        <a href="javascript:;" class="hello-bot-primary" @click="showHide">{{data.btn}}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: {
        title: '支付成功',
        content: '即将跳转下一页',
        btn: '确定',
        btnClick: function () {
          console('回调函数')
        }
      }
    }
  },
  props: ['data'],
  watch: {
    data () {
      this.data.title = this.data.title
      this.data.content = this.data.content
      this.data.btn = this.data.btn
      this.data.btnClick = this.data.btnClick
    }
  },
  methods: {
    showHide () {
      this.$emit('someMsgFromChild', this.data.btnClick, true)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .hello{
    margin: 0;
    padding: 0;
    .hello-opacity{
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    .hello-content{
      position: fixed;
      display: table;
      z-index: 5000;
      width: 80%;
      max-width: 600px;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      background-color: #FFFFFF;
      text-align: center;
      border-radius: 5px;
      overflow: hidden;
      .hello-top{
        padding:20px 15px;
        .hello-top-title{
          font-weight: 400;
          font-size: 48px;
        }
      }
      .hello-mid{
        padding: 10px 20px 30px 20px;
        min-height: 36px;
        font-size: 24px;
        line-height: 36px;
        word-wrap: break-word;
        word-break: break-all;
        color: #999999;
        .hello-mid-content{
          font-size: 36px;
        }
      }
      .hello-bot{
        position: relative;
        line-height: 48px;
        font-size: 48px;
        padding: 20px 15px;
        border-top: 1px solid #ddd;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        .hello-bot-primary{
          display: block;
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          color: #1E9FFF;
          text-decoration: none;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          position: relative;
        }
      }
    }
  }
</style>
