<template>
  <div>
    
    <Row :gutter="16">
        <i-col :xs="24" :md="12" :lg="6">
          <div class="count-card">
            <div class="icon-box">
              <Icon type="ios-people" />
              <span>群总数</span>
              
            </div>
            <count-to :end="statistic.group_count" count-class="count-text" unit-class="unit-class">
            </count-to>
          </div>
        </i-col>


        <i-col :xs="24" :md="12" :lg="6">
          <div class="count-card">
            <div class="icon-box" style="background: #19be6b">
              <Icon type="ios-chatbubbles" />
              <span>总消息数</span>
              
            </div>
            <count-to :end="statistic.msg_count" count-class="count-text" unit-class="unit-class">
            </count-to>
          </div>
        </i-col>

        <i-col :xs="24" :md="12" :lg="6">
          <div class="count-card">
            <div class="icon-box" style="background: #ed3f14">
              <Icon type="ios-warning" />
              <span>违规消息数</span>
              
            </div>
            <count-to :end="statistic.detect_count" count-class="count-text" unit-class="unit-class">
            </count-to>
          </div>
        </i-col>

        <i-col :xs="24" :md="12" :lg="6">
          <div class="count-card">
            <div class="icon-box" style="background: #E46CBB">
              <Icon type="ios-people"></Icon>
              <span>违规消息占比</span>
            </div>
            <count-to :end="statistic.msg_percent" count-class="count-text" unit-class="unit-class">
              <span class="slot-text" slot="right">&nbsp;%</span>
            </count-to>
          </div>
        </i-col>
    </Row>

    
    <Row :gutter="16">
        <i-col :md="24" :lg="8">
          <div id="pie" class="chart"></div>
        </i-col>

        <i-col :md="24" :lg="16">
          <div id="column" class="chart"></div>
        </i-col>
    </Row>

    <!-- Top3 危险人物词云 -->
    <div class="section-header">
      Top3 危险人物词云 
    </div>
    <Row :gutter="16">
        <i-col :md="24" :lg="8">
          <div class="wordcloud-header">
            <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2534898382,1324912624&fm=26&gp=0.jpg" alt="">
            <span>谢红韬</span>
          </div>
          <div id="wordcloud0" class="chart"></div>
        </i-col>

        <i-col :md="24" :lg="8">
          <div id="wordcloud1" class="chart"></div>
        </i-col>

        <i-col :md="24" :lg="8">
          <div id="wordcloud2" class="chart"></div>
        </i-col>
    </Row>

  </div>
</template>

<script>
import countTo from '@/components/count-to'
import { mapGetters } from 'vuex'
import axios from 'axios'
import echarts from 'echarts'
import echarts_wordcloud from 'echarts-wordcloud'
import './index.scss'
export default {
  name: "home",
  data () {
    return {
      statistic: {
        group_count: 0,
        msg_count: 0,
        detect_count: 0,
        msg_percent: 0
      }
    }
  },
  components: {
    countTo
  },
  computed: {
    ...mapGetters(["userInfo", "groups"])
  },
  mounted() {
    this.getStatistic()
    this.drawPie()
    this.drawColumn()
    this.getWordCloud()
  },
  methods: {
    getStatistic() {
      var _self = this;
      axios({
        method: 'get',
        url: 'http://localhost:5000/analysis/statistic',
        params: {
          uin: _self.userInfo.uin,
          // uin: 2879490841,
          username: _self.userInfo.UserName,
        },
        withCredentials: true
      }).then((res) => {
        _self.statistic = res.data.data
        if (_self.statistic.msg_count > 0) {
          _self.statistic.msg_percent = Math.round(_self.statistic.detect_count / _self.statistic.msg_count * 100)
        }
      })
    },
    drawPie() {
      var _self = this;
      axios({
        method: 'get',
        url: 'http://localhost:5000/analysis/all_group_label_count',
        params: {
          uin: _self.userInfo.uin,
          // uin: 2879490841,
        },
        withCredentials: true
      }).then((res) => {
        console.log(res.data.data)
        _self._drawPie(res.data.data)
      })
    },
    drawColumn() {
      var _self = this;
      axios({
        method: 'get',
        url: 'http://localhost:5000/analysis/all_member_danger',
        params: {
          uin: _self.userInfo.uin,
          // uin: 2879490841,
        },
        withCredentials: true
      }).then((res) => {
        console.log(res.data.data)
        _self._drawColumn(res.data.data)
      })
    },
    getWordCloud() {
      var _self = this;
      axios({
        method: 'get',
        url: 'http://localhost:5000/analysis/all_member_wordcloud',
        params: {
          uin: _self.userInfo.uin,

          // uin: 2879490841,
        },
        withCredentials: true
      }).then((res) => {
        // {
        //   "Taoz": {
        //     "keywords": {
        //       "垃圾": 2
        //     }
        //   }, 
        //   "袁公萍": {
        //     "keywords": {
        //       "操他妈": 1, 
        //       "傻逼": 2, 
        //     }
        //   }
        let wordcloud = res.data.data
        // 先转为数组
        let wordcloudArr = []
        for (let member in wordcloud) {
          let kwArr = []
          for (let kw in wordcloud[member].keywords) {
            let t = {
              name : null,
              value: 0
            }
            t.name = kw
            t.value = wordcloud[member].keywords[kw]
            kwArr.push(t)
          }
          let tmp = {
            name: member,
            keywords: kwArr
          }
          wordcloudArr.push(tmp)
        }
        // 再排序取出最前面的三个
        wordcloudArr.sort((a, b) => {
          return b.keywords.length - a.keywords.length
        })
        wordcloudArr = wordcloudArr.slice(0, 3)
        wordcloudArr.map((ele, index) => {
          if (ele.keywords.length > 0) {
            _self._drawWordCloud('wordcloud' + index, ele.keywords)
          }
        })
      })
    },
    _drawPie(data) {
      /*
        data: {
          '色情性感': '123',
          '暴恐违禁'：'33'
        }
      */
      let data4Draw = []
      for (let k in data) {
        if (data[k] > 0) {
          data4Draw.push({
            name: k,
            value: data[k]
          })
        }
      }
      let myChart = echarts.init(document.getElementById("pie"))
      let option = {
          title : {
              text: '违规标签',
              x:'center'
          },
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} 个 ({d}%)"
          },
          series : [
              {
                  name: '违规标签',
                  type: 'pie',
                  radius : '60%',
                  data: data4Draw,
                  itemStyle: {
                      emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
      };
      myChart.setOption(option);
    },
    _drawColumn(data) {
      // data = {
      //   袁公萍: {count: 1, groups: ["数据小群_ALL"]},
      //   谢红韬: {count: 11, groups: ["IMMonitor", "数据小群_ALL"]},
      //   袁公萍2: {count: 1, groups: ["数据小群_ALL"]},
      //   谢红韬2: {count: 11, groups: ["IMMonitor","数据小群_ALL"]},
      //   袁公萍3: {count: 1, groups: ["数据小群_ALL"]},
      //   谢红韬3: {count: 11, groups: ["IMMonitor","数据小群_ALL"]},
      //   袁公萍4: {count: 1, groups: ["数据小群_ALL"]},
      //   谢红韬4: {count: 11, groups: ["IMMonitor","数据小群_ALL"]},
      //   袁公萍5: {count: 1, groups: ["数据小群_ALL"]},
      //   谢红韬5: {count: 11, groups: ["IMMonitor","数据小群_ALL"]},
      //   袁公萍6: {count: 1, groups: ["数据小群_ALL"]},
      //   谢红韬6: {count: 11, groups: ["IMMonitor","数据小群_ALL"]},
      //   袁公萍7: {count: 1, groups: ["数据小群_ALL"]},
      //   谢红韬7: {count: 11, groups: ["IMMonitor","数据小群_ALL"]},
      //   袁公萍8: {count: 1, groups: ["数据小群_ALL"]},
      //   谢红韬8: {count: 11, groups: ["IMMonitor","数据小群_ALL"]}
      // }
      let dict2Array = []
      let i = 0
      for (let k in data) {
        let tmp = {
          name: k,
          value: data[k].count,
          groups: data[k].groups
        } 
        dict2Array.push(tmp)
        ++i
        if (i > 9) {
          break;
        }
      }
     
      dict2Array.sort((a, b) => {
        return b.value - a.value
      })
      
      let myChart = echarts.init(document.getElementById("column"))
      let option = {
          title : {
              text: '危险人员 Top10',
              x:'center'
          },
          
          tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
              {
                axisLabel:{'interval':0},
                type : 'category',
                data : dict2Array.map((ele) =>{
                  return `${ele.name}\n` + ele.groups.join('\n')
                }),
                axisTick: {
                    alignWithLabel: true
                }
              }
          ],
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series : [
              {
                  name:'违规消息数',
                  type:'bar',
                  barWidth: '60%',
                  data:dict2Array.map((ele) => ele.value),
                  itemStyle: {
                    normal: {
                      color: function(params) { 
                          // return colorList[params.dataIndex]
                          let red = parseInt(255 - ((params.dataIndex + 1) * 23)).toString(16)
                          let blue = parseInt(16 + ((params.dataIndex + 1) * 5)).toString(16)
                          let green = parseInt(16 + ((params.dataIndex + 1) * 12)).toString(16)
                          return `#${red}${blue}${green}`
                      }
                    }
                  },
              }
          ]
      };
      myChart.setOption(option);
    },
    _drawWordCloud(id, data) {
      let maskImage = new Image()
      maskImage.src = require('@/assets/images/man.png')
      let myChart = echarts.init(document.getElementById(id))
      let option = {
          series: [{
            type: 'wordCloud',
    
            // The shape of the "cloud" to draw. Can be any polar equation represented as a
            // callback function, or a keyword present. Available presents are circle (default),
            // cardioid (apple or heart shape curve, the most known polar equation), diamond (
            // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.
    
            shape: 'circle',
    
            // A silhouette image which the white area will be excluded from drawing texts.
            // The shape option will continue to apply as the shape of the cloud to grow.
    
            // maskImage: maskImage,
    
            // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
            // Default to be put in the center and has 75% x 80% size.
    
            left: 'center',
            top: 'center',
            width: '90%',
            height: '90%',
            right: null,
            bottom: null,
    
            // Text size range which the value in data will be mapped to.
            // Default to have minimum 12px and maximum 60px size.
    
            sizeRange: [12, 60],
    
            // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
    
            rotationRange: [-90, 90],
            rotationStep: 45,
    
            // size of the grid in pixels for marking the availability of the canvas
            // the larger the grid size, the bigger the gap between words.
    
            gridSize: 8,
    
            // set to true to allow word being draw partly outside of the canvas.
            // Allow word bigger than the size of the canvas to be drawn
            drawOutOfBound: false,
    
            // Global text style
            textStyle: {
                normal: {
                    fontFamily: 'sans-serif',
                    fontWeight: 'bold',
                    // Color can be a callback function or a color string
                    color: function () {
                        // Random color
                        return 'rgb(' + [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')';
                    }
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
    
            // Data is an array. Each array item must have name and value property.
            // data: [{
            //     name: 'Farrah Abraham',
            //     value: 366,
            //     // Style of single text
            //     textStyle: {
            //         normal: {},
            //         emphasis: {}
            //     }
            // }]
            data: data
        }]
      };
      myChart.setOption(option);
    }
  }
}
</script>
