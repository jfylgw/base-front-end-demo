<template>
    <div class="chart" ref="chart">
      <div id="grap" class="grap" :style="'height:' + h + 'px'"></div>
    </div>
</template>

<script>
import Force from 'assets/js/chart/force';
export default {
    name: 'grapChart',
    // 注册子组件
    components: {
    },
    props: {
      chartData: {
        type: Object,
        default: () => []
      }
    },
    watch: {
      chartData() {
        // console.log(this.chartData)
      }
    },
    data() {
        return {
          h: 0
        };
    },
    // 组件函数
    methods: {
    },
    // 当该模版加载完成（Vue钩子函数）
    mounted() {
      this.$nextTick(() => {
        this.h = this.$refs.chart.offsetHeight
        setTimeout(() => {
           let force = new Force('#grap', {
            d3Data: this.chartData
          })
        }, 500)
      })
    }
}
</script>

<style lang="scss">
.chart{
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
}
.grap{
  width: 100%;
  position: relative;
}
svg .nodes, svg .relationship{
  cursor: pointer
}
svg .ring{
  opacity: 0;
}
svg .node:hover>.ring{
  opacity: .5;
}
svg .overlay{
  opacity: 0;
}
.nodetitle{
  color: red;
}
</style>

