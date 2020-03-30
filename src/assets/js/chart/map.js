export const chinaGeoCoordMap = [
  { name: '黑龙江', value:  [127.9688, 45.368, 0] },
  { name: '内蒙古', value:  [110.3467, 41.4899, 0] },
  { name: '吉林', value:  [125.8154, 44.2584, 0]},
  { name: '北京', value:  [116.4551, 40.2539, 0]},
  { name: '辽宁', value:  [123.1238, 42.1216, 0]},
  { name: '河北', value:  [114.4995, 38.1006, 0]},
  { name: '天津', value:  [117.4219, 39.4189, 0]},
  { name: '山西', value:  [112.3352, 37.9413, 0]},
  { name: '陕西', value:  [109.1162, 34.2004, 0]},
  { name: '甘肃', value:  [103.5901, 36.3043, 0]},
  { name: '宁夏', value:  [106.3586, 38.1775, 0]},
  { name: '青海', value:  [101.4038, 36.8207, 0]},
  { name: '新疆', value:  [87.9236, 43.5883, 0]},
  { name: '西藏', value:  [91.11, 29.97, 0]},
  { name: '四川', value:  [103.9526, 30.7617, 0]},
  { name: '重庆', value:  [108.384366, 30.439702, 0]},
  { name: '山东', value:  [117.1582, 36.8701, 0]},
  { name: '河南', value:  [113.4668, 34.6234, 0]},
  { name: '江苏', value:  [118.8062, 31.9208, 0]},
  { name: '安徽', value:  [117.29, 32.0581, 0]},
  { name: '湖北', value:  [114.3896, 30.6628, 0]},
  { name: '浙江', value:  [119.5313, 29.8773, 0]},
  { name: '福建', value:  [119.4543, 25.9222, 0]},
  { name: '江西', value:  [116.0046, 28.6633, 0]},
  { name: '湖南', value:  [113.0823, 28.2568, 0]},
  { name: '贵州', value:  [106.6992, 26.7682, 0]},
  { name: '云南', value:  [102.9199, 25.4663, 0]},
  { name: '广东', value:  [113.12244, 23.009505, 0]},
  { name: '广西', value:  [108.479, 23.1152, 0]},
  { name: '海南', value:  [110.3893, 19.8516, 0]},
  { name: '上海', value:  [121.4648, 31.2891, 0]}
]

export const mapChartOptins = {
  title: {
    text: '',
    top: 80,
    x: 'center',
    textStyle: {
      color: '#000'
    }
  },
  tooltip: {
    padding: 10,
    enterable: true,
    textStyle: {
      color: '#fff'
    }
  },
  visualMap: {
    min: 0,
    max: 10000,
    range: [0, 10000],
    left: 20,
    bottom: 50,
    calculable: true,
    seriesIndex: [0],
    inRange: {
      color: ['#b2d4f0', '#2687e3']
    },
    textStyle: {
      color: '#000'
    }
  },
  geo: {
    show: false,
    map: 'china',
    layoutCenter: ['50%', '50%'],
    layoutSize: '100%'
  },
  series: [{
      name: '',
      type: 'map',
      mapType: 'china',
      layoutCenter: ['50%', '50%'],
      layoutSize: '100%',
      label: {
        show: true,
        textStyle: {
          fontSize: 11
        }
      },
      itemStyle: {
        areaColor: 'rgb(178, 212, 240)'
      },
      data: []
    }, {
      type: 'scatter',
      coordinateSystem: 'geo',
      symbol: 'pin',
      symbolSize: function (val) {
        let value = val[2]
        if (value === 0 ) return ''
        return value < 10 ? 30
          : value < 20 ? 40
            : value < 30 ? 50
              : value < 40 ? 55 : 60
      },
      label: {
        normal: {
          show: true,
          textStyle: {
            color: '#fff',
            fontSize: 12
          },
          formatter: (params) => {
            return params.data.task
          }
        }
      },
      itemStyle: {
        normal: {
          color: '#0f8cf3'
        }
      },
      zlevel: 6,
      data: []
    }, {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      zlevel: 2,
      rippleEffect: {
          period: 4,
          scale: 15,
          brushType: 'stroke'
      },
      label: {
        normal: {
          show: false
        }
      },
      symbolSize:  function (val) {
        let value = val[2]
        if (value === 0 ) return ''
        return value < 10 ? 1.5
          : value < 20 ? 2 : 3
      },
      itemStyle: {
        normal: {
          color: 'yellow'
        }
      },
      data: []
  }]
}
