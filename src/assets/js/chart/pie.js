
export const option1 = {
  title: {
      text: '',
      x: 'center',
      y: 'center',
      textStyle:{
        color:'#000',
        align:'center'
    }
  },
  tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
  },
  color:['#86c9f4','#4da8ec','#3a91d2','#005fa6','#315f97', '#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
  legend: {
      show: false,
      type: 'scroll',
      orient: 'vertical',
      left : 'right',
      top: 'middle',
      itemWidth: 15,
      data: []
  },
  series: [
      {
        name: '',
        type: 'pie',
        radius: '75%',
        minAngle: 5,
        center: ['50%', '50%'],
        data: [],
        label: {
          normal: {
            formatter: `{b}: {c}\n {d}%`,
          },
          align: 'center'
        },
        labelLine: {
          normal: {
            length: 10,
            length2: 5
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
    }
  ]
}

export const option2 = {
  title: {
    text: '所有标签',
    x: 'center',
    y: 'center',
    textStyle:{
        color:'#000',
        align:'center'
    }
  },
  color:['#86c9f4','#4da8ec','#3a91d2','#005fa6','#315f97', '#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
  series: [{
    name: '',
    type: 'pie',
    radius: ['50%', '70%'],
    center: ['50%', '50%'],
    hoverAnimation: false,
    label: {
      normal: {
        formatter: function(params) {
          return params.name
        },
        rich: 20
      }
    },
    labelLine: {
      normal: {
        length: 10,
        length2: 10,
        lineStyle: {
          color: '#0b5263'
        }
      }
    },
    data: []
  }]
}