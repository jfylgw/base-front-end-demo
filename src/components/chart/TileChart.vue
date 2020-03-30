<template>
  <div class="tile-chart">
    <loading :IsLoading="isLoading" @hideLoading="hideLoading" Msg=""></loading>
    <div class="chart">
      <div class="left">
        <div class="left-top">
          <div class="item-div">
            <span class="value">{{dataInfo.task || ''}}</span>
            <span>{{dataInfo.task ? '任务总数': ''}}</span>
          </div>
          <div class="item-div">
            <span class="value">{{dataInfo.amount || ''}}</span>
            <span>{{dataInfo.markTemplate || ''}}{{dataInfo.markTemplate ? '总数': ''}}</span>
          </div>
          <div class="item-div">
            <span class="value">{{dataInfo.area || ''}}</span>
            <span>{{dataInfo.markTemplate || ''}}{{dataInfo.markTemplate ? '总面积(亩)': ''}}</span>
          </div>
        </div>
        <div class="left-bom" id="map"></div>
      </div>
      <div class="right">
        <div class="right-item" id="pie1"></div>
        <div class="right-item" id="pie2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china'
import * as ProjectApi from "api/project";
import { chinaGeoCoordMap, mapChartOptins } from 'assets/js/chart/map';
import { option1, option2 } from 'assets/js/chart/pie';
import Loading from "components/base/Loading";
export default {
  name: 'tileChart',
  components: {
    Loading
  },
  props: {
    Project: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isLoading: false,
      dataInfo: {}
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    showLoading() {
      this.isLoading = true;
    },
    hideLoading() {
      this.isLoading = false;
    },
    async initMapChart() {
      this.mapChart = echarts.init(document.getElementById('map'))
      let data = await this.getProjectChart()
      this.getData(data)
      this.initPie(data)
    },
    getData(data) {
      let opts = mapChartOptins
      let cityData = chinaGeoCoordMap
      let arr = data.overview || []
      cityData.forEach((el) => {
        for(let j = 0; j < arr.length; j++) {
          if (arr[j].name === el.name) {
            el.task = arr[j].task
            el.amount = arr[j].amount
            el.area = arr[j].area
            el.value = [el.value[0], el.value[1], arr[j].task ]
          }
        }
      })
      opts.visualMap.max = data.task || 100
      opts.visualMap.range = [0, data.task || 100],
      opts.tooltip = { ...opts.tooltip, ...this.getTooltip() }
      opts.series[0].data = cityData
      opts.series[1].data = cityData
      opts.series[2].data = cityData
      this.mapChart.setOption(opts, true)
    },
    initPie(data) {
      this.pie1Chart = echarts.init(document.getElementById('pie1'))
      option1.series[0].data = data.taskPie.filter(e => e.value !== 0) || []
      if (data.taskPie.length < 1) {
        option1.title.text = '无数据'
        option1.title.textStyle.color = '#ccc'
      }
      this.pie1Chart.setOption(option1, true)
      this.pie2Chart = echarts.init(document.getElementById('pie2'))
      option2.series[0].data = data.label || []
      if (data.label.length < 1) {
        option2.title.text = '无数据'
        option2.title.textStyle.color = '#ccc'
      }
      this.pie2Chart.setOption(option2, true)
    },
    getTooltip () {
      return {
        formatter: (params) => {
          let data = params.data
          if (data && data.task > 0) return `<div class="tip-title">${params.name}-详细信息</div>
          <div class="max-tooltip">
          <div><span>任务数：</span>${data.task || ''}</div>
          <div><span>${this.dataInfo.markTemplate}数：</span>${data.amount || ''}</div>
          <div><span>${this.dataInfo.markTemplate}面积：</span>${data.area +'(亩)' || ''}</div>
          </div>`
          return ''
        }
      }
    },
    resize() {
      this.mapChart.resize()
      this.pie1Chart.resize()
      this.pie2Chart.resize()
    },
    // 加载详情
    async getProjectChart() {
        try {
          this.showLoading();
          let data = {};
          let projectUuid = this.Project.uuid
          // 请求接口
          let response = await ProjectApi.getProjectChart({ projectUuid })
          this.dataInfo = Object.assign({}, response.data)
          data = this.dataInfo
          this.hideLoading()
          return data
        } catch(err) {
            this.hideLoading()
            this.$message({ type: 'error', showClose: true, message: err.message});
        }
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.initMapChart()
      window.addEventListener('resize', this.resize, false)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
}
</script>

<style scoped lang="scss">
.tile-chart{
  width: 100%;
  min-width: 1000px;
  height: 650px;
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .chart{
    padding-top: 5px;
    flex: 1;
    display: flex;
    box-sizing: border-box;
    .left{
      width: 65%;
      flex: 1;
      box-sizing: border-box;
      .left-top{
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        justify-content: space-evenly;
        .item-div{
          position:relative;
          display: flex;
          flex-direction: column;
          padding: 3px;
          span{
            font-size: 14px;
            color: #b8b6b6;
            padding-top: 3px;
          }
          .value{
            font-size: 24px;
            color: #000;
          }
        }
      }
      .left-bom{
        height:  100%;
        overflow: hidden;
      }
    }
    .right{
      width: 35%;
      box-sizing: border-box;
      .right-item{
        display: flex;
        height: 50%;
        justify-content: center;
        align-items: center;
        div{
          flex: 1;
        }
      }
    }
  }
}
</style>
<style>
.tip-title{
  font-size: 16px;
}
.max-tooltip div{
  display: flex;
  padding: 5px;
  font-size: 16px;
}
.max-tooltip span{
  width: 90px;
  justify-content: flex-start;
  font-size: 14px;
  color: #ccc;
}
</style>