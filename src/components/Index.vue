<template>
  <div>
    <ParticlesBackground/>
  </div>
  <customNav />
  <main class="main">
    <customHeader />
    <d-content class="dcontent">
      <div class="inner-content">
        <d-row class="docs-devui-row">
          <d-col :span="8">
            <d-row :gutter="10" class="docs-devui-row">
              <d-col :span="24" class="col-gutter">
                <div class="col-child">
                  <d-table :striped="true" :header-bg="true" :data="TodaySignData" table-height="200px" fix-header style="width:100%">
                    <d-column field="user" header="本日签到用户" :width="150"></d-column>
                    <d-column field="time" header="时间" :width="150"></d-column>
                  </d-table>
                </div>
              </d-col>
            </d-row>
            <d-row :gutter="10" class="docs-devui-row">
              <d-col :span="12" class="col-gutter">
                <div class="col-child">
                  <d-table :striped="true" :header-bg="true" :data="TodaySignData" table-height="200px" fix-header style="width:100%">
                    <d-column field="use" header="今日完成学习" :width="130"></d-column>
                  </d-table>
                </div>
              </d-col>
              <d-col :span="12" class="col-gutter">
                <div class="col-child">
                  <d-table :striped="true" :header-bg="true" :data="TodaySignData" table-height="200px" fix-header style="width:100%">
                    <d-column field="user" header="今日完成复习" :width="130"></d-column>
                  </d-table>
                </div>
              </d-col>
            </d-row>
          </d-col>
          <d-col :span="16">
            <d-row type="flex" class="docs-devui-row">
              <d-col flex="auto" id="Linechart" style="height: 410px">auto</d-col>
              <d-col flex="20px"></d-col>
            </d-row>
          </d-col>
        </d-row>
      </div>
    </d-content>
  </main>
</template>

<script>
import ParticlesBackground from "@/components/ParticlesBackground.vue";
import customHeader from "@/components/customHeader.vue";
import axiox from "axios"
import dayjs from 'dayjs'
import qs from 'qs';
import router from "@/router";
import {onMounted, ref, watch} from 'vue'
import * as echarts from 'echarts';
import CustomNav from "@/components/customNav.vue";
let TodaySignData = ref();
let arr = [];
for (var i = 0; i < 7; i++) {
  arr.push(dayjs().add(-i, 'day').format('DD'))
}
arr.reverse();
let activeData = [];
let activeData_H = [];
let activeData_M = [];
let activeData_S = [];
export default {
  name: "index",
  components: {CustomNav, ParticlesBackground,customHeader},

  data() {
    return {
      TodaySignData,
      username: ref(localStorage.getItem("account")),
      DateData: ref([])
    }
  },
  methods: {

  },
  setup() {
    onMounted(() => {
      let params = {
        account: localStorage.getItem("account"),
        token: localStorage.getItem("token")
      }
      axiox.post("http://localhost:8990/getRecentActive",qs.stringify(params))
          .then(res => {
            console.log(res)
            if (res.data.code == 400) {
              alert(res.data.Message)
              localStorage.setItem("isLogin", "false")
              localStorage.setItem("token", "")
              router.replace('/login')
            } else{
              activeData=res.data
              activeData.reverse()
              activeData_S=activeData
              activeData_M=activeData.map(x =>x/60)
              activeData_H=activeData.map(x =>x/3600)
              var myChart = echarts.init(document.getElementById('Linechart'), 'dark');
              myChart.hideLoading();
              myChart.setOption({
                toolbox: {
                  top: "top",
                  right: "10%",
                  show: true,
                  feature: {
                    mark: {
                      show: true
                    },
                    /**自定义的工具栏 */
                    myTool1: {
                      show: true,
                      title: '按小时显示',
                      icon: 'M289.48992 720.9984h-41.7792c0.81408-8.20224 1.536-15.55968 2.1504-22.1184 0.6144-6.54848 1.01376-12.99968 1.2288-19.3536 0.19968-6.34368 0.39936-13.2096 0.60928-20.5824 0.2048-7.3728 0.31232-15.9744 0.31232-25.8048V326.5536v-24.2688c0-6.3488-0.20992-11.9808-0.6144-16.896-0.41472-4.9152-0.82432-9.41568-1.2288-13.5168-0.4096-4.09088-1.024-8.6016-1.83808-13.5168 4.50048 0.82432 9.30816 1.536 14.43328 2.1504 5.12 0.6144 11.37152 1.13152 18.7392 1.536 7.3728 0.41472 16.4864 0.72192 27.3408 0.9216 10.84928 0.21504 24.2688 0.3072 40.2432 0.3072 15.15008 0 28.05248-0.09728 38.7072-0.3072 10.6496-0.2048 19.75808-0.50688 27.3408-0.9216a322.2528 322.2528 0 0 0 19.3536-1.536 227.84512 227.84512 0 0 0 14.7456-2.1504 185.2672 185.2672 0 0 0-1.83808 11.9808 384.68608 384.68608 0 0 0-1.2288 12.288c-0.41472 4.71552-0.6144 10.4448-0.6144 17.2032v324.7104c0 14.34112 0.3072 27.55072 0.9216 39.6288 0.6144 12.08832 1.7408 25.91232 3.3792 41.472h-42.3936v-57.1392H289.48992v72.4992zM407.4496 294.6048H289.48992v150.528H407.4496v-150.528z m0 179.4048H289.48992v145.6128H407.4496V474.0096z m247.6032-113.664c0-24.576-0.10752-45.1584-0.3072-61.7472-0.21504-16.5888-0.6144-30.61248-1.2288-42.0864-0.6144-11.46368-1.33632-20.98688-2.1504-28.5696a233.8048 233.8048 0 0 0-3.07712-20.5824c9.83552 2.05312 18.2272 3.3792 25.19552 3.9936 6.95808 0.6144 13.92128 0.72192 20.88448 0.3072 6.95808-0.40448 11.0592 0.9216 12.288 3.9936 1.2288 3.072-1.2288 6.4512-7.3728 10.1376-2.048 1.2288-3.6864 4.096-4.9152 8.6016-1.22368 4.51072-1.83808 9.63072-1.83808 15.36v110.592a1708.0832 1708.0832 0 0 0 50.68288-1.8432c15.76448-0.8192 30.20288-1.8432 43.3152-3.072v41.1648c-12.6976-1.63328-26.112-2.7648-40.23808-3.3792s-32.05632-0.9216-53.76-0.9216v304.7424c0 13.11232-1.33632 24.36608-3.9936 33.792-2.66752 9.4208-8.50432 17.1008-17.5104 23.04-9.01632 5.93408-22.1184 10.3424-39.3216 13.2096-17.2032 2.86208-40.35072 4.3008-69.43232 4.3008 0-8.6016-1.6384-17.41312-4.9152-26.4192-3.28192-9.0112-9.01632-17.6128-17.19808-25.8048 24.576 4.09088 44.32896 6.3488 59.28448 6.7584 14.9504 0.40448 26.5216-1.13152 34.7136-4.60288 8.192-3.48672 13.7216-8.9088 16.5888-16.28672 2.86208-7.3728 4.3008-16.98816 4.3008-28.8768V391.68h-78.6432c-22.9376 0-44.2368 0.41472-63.89248 1.2288-19.6608 0.82944-37.07392 2.05312-52.224 3.6864v-41.1648c14.7456 1.64352 32.14848 2.87232 52.224 3.6864 20.06528 0.82432 41.36448 1.2288 63.89248 1.2288h78.64832z m-75.5712 234.0864c-9.43104-19.6608-21.1968-39.8336-35.328-60.5184-14.1312-20.67968-31.0272-41.26208-50.68288-61.7472l31.3344-20.8896c18.01728 20.8896 34.91328 41.7792 50.68288 62.6688 15.76448 20.8896 28.97408 39.936 39.6288 57.1392l-35.6352 23.3472z',
                      iconStyle: {
                        borderColor: "rgb(81,222,248)"
                      },
                      onclick: function () {
                        myChart.setOption({
                          series: [
                            {
                              // 根据名字对应到相应的系列
                              name: 'Line 1',
                              data: activeData_H
                            }
                          ]
                        });
                      }
                    },
                    myTool2: {
                      show: true,
                      title: '按分钟显示',
                      icon: 'M857.190207 842.72693q3.856874 148.489642-148.489642 144.632768l-112.813559 0 0-67.495292 85.815443 0q90.636535 4.821092 85.815443-80.99435l0-351.939736-324.94162 0q-8.677966 387.615819-392.436911 537.06968l0-68.45951q293.122411-138.847458 297.943503-468.610169l-189.951036 0 0-67.495292 699.05838 0 0 423.291902zM433.898305 0q-72.316384 347.118644-429.077213 477.288136l0-62.6742q261.303202-121.491525 333.619586-414.613936l95.457627 0zM708.700565 0q72.316384 293.122411 333.619586 414.613936l0 62.6742q-356.760829-130.169492-432.934087-477.288136l99.314501 0z',
                      iconStyle: {
                        borderColor: "rgb(81,222,248)" //修改icon颜色
                      },
                      //click切换数据源在渲染echarts时无效,第一次进入会记录数据,所以这里将渲染提出
                      onclick: function () {
                        myChart.setOption({
                          series: [
                            {
                              // 根据名字对应到相应的系列
                              name: 'Line 1',
                              data: activeData_M
                            }
                          ]
                        });
                      }
                    },
                    myTool3: {
                      show: true,
                      title: '按秒显示',
                      icon: 'M344.576 641.3312c-1.1776-0.4608-2.4064-1.024-3.6352-1.6896-0.8192-0.4608-1.6384-1.024-2.4576-1.6384-1.28-0.1024-2.5088-0.3584-3.7376-0.7168 0.7168 0.3072 0.8704 0.3584-0.3072-0.0512 0.1024 0.0512 0.2048 0.0512 0.3072 0.0512-1.4336-0.5632-5.2224-2.048-6.5536-2.7136-0.0512-0.0512-0.1024-0.0512-0.2048-0.1024-1.9456-1.28-3.84-2.6624-5.5296-4.2496-0.4608-0.4608-0.8704-0.9216-1.28-1.4336-3.0208-0.512-5.888-1.4848-8.6016-3.072-0.3072-0.256-0.6144-0.512-0.9728-0.7168-2.1504-0.512-4.0448-1.2288-5.8368-2.2016v95.5904l40.6016-36.096 2.2528 2.56v-40.3456a43.776 43.776 0 0 1-4.0448-3.1744zM304.2304 828.672c-0.768 29.6448-1.792 58.5216-3.0208 81.7664v13.0048c0 12.1344 1.8432 16.7936 7.424 16.7936 4.6592 0 11.2128-1.8432 19.6096-5.5808 19.5584-8.3968 22.3744-12.1344 22.3744-24.2176v-7.4752c-1.1264-25.0368-1.5872-56.7808-1.7408-93.2864l-44.6464 18.9952zM698.368 277.504l43.8272-29.5424v-108.544l17.7152-12.1344c6.5024-4.6592 10.24-7.4752 10.24-10.24 0-2.816-3.7376-5.632-10.24-8.3968l-65.28-36.352c1.8432 28.8768 3.7376 83.8656 3.7376 116.5312V277.504zM863.3856 459.1616c-81.152 264.8064-222.8224 371.0976-476.416 476.416l3.7376 12.1344c203.2128-59.648 365.4656-136.1408 492.2368-391.5776 11.2128-21.4528 17.7152-27.9552 30.7712-31.6928 5.5808-1.8432 8.3968-2.816 8.3968-5.5808 0-2.816-2.816-6.5536-8.3968-12.1344l-50.3296-47.5648zM637.6448 318.464c4.4032-7.3728 7.3728-11.776 8.4992-12.1856 6.5024-2.816 10.24-4.6592 10.24-7.4752 0-2.7648-2.7648-5.5808-9.3184-9.3184l-58.7264-38.1952-25.9072 117.8112 75.2128-50.6368zM833.9968 264.704c-3.072 4.6592-5.9392 9.472-9.3184 13.9264 72.0896 72.4992 111.2064 148.7872 117.9136 175.872 9.3696 38.2464 14.9504 41.984 21.4528 41.984 20.5312 0 33.5872-22.3744 33.5872-47.5648 0-49.6128-88.7808-131.072-163.6352-184.2176z,M742.1952 377.7536l-15.36 17.5616c-3.5328 5.12-7.3216 10.0864-11.5712 15.0016-3.1744 3.7376-6.5024 7.3216-9.8816 10.8032-2.2016 3.1232-4.5056 6.1952-6.9632 9.1648v13.056c0 44.7488-0.9728 117.4528-2.816 164.096v7.424c0 13.056 1.8432 18.688 8.3968 18.688 4.6592 0 10.24-1.8944 19.5584-5.632 18.688-7.424 22.3744-10.24 22.3744-21.4528v-5.5808c-2.7648-35.4304-3.6864-96-3.6864-156.6208V377.7536zM510.976 369.664L454.0928 314.6752 411.1872 368.64H348.16V196.2496c33.2288-8.3456 65.8432-15.8208 96.6144-24.2176 15.8208-4.6592 26.112-6.5024 36.352-6.5024 2.816 0 18.6368 2.7648 21.4528 2.7648 2.7648 0 4.6592-0.9216 4.6592-2.7648 0-2.816-1.8944-6.5536-6.5536-12.1344l-38.1952-42.9056C348.7232 163.6352 256.4608 195.328 143.616 222.3616l3.7376 13.056c40.0896-4.6592 96.9728-15.8208 159.8464-28.8768V368.64H198.656c-21.4528-0.8192-44.7488-2.7136-68.096-4.5568l26.112 34.5088c15.872-6.5536 42.9056-10.24 62.464-9.472h78.336c-41.0112 134.4-94.1568 255.5904-168.7552 361.8816l10.24 7.4752c40.2432-48.7424 77.6704-106.752 110.592-165.2736l-23.296-11.776 43.1104-24.4736c13.6192-25.6512 26.3168-51.0464 37.8368-75.4176v49.152l29.952-19.2c2.7648-3.072 6.1952-5.632 10.6496-7.2704 0.3072-0.1024 0.6144-0.2048 0.3584-0.3072v-36.4032c2.56 1.792 9.9328 11.6224 19.3024 24.5248l23.0912-14.7968 0.3584 0.5632c1.6384-0.9728 3.2768-1.8944 4.9664-2.7136-13.4656-8.0896-29.0816-16.7424-47.7184-26.2656V389.12h159.0784c9.3184-0.768 13.9776-1.7408 13.9776-5.4784 0-2.7648-3.7376-7.424-10.24-13.9776z',
                      iconStyle: {
                        borderColor: "rgb(81,222,248)" //修改icon颜色
                      },
                      //click切换数据源在渲染echarts时无效,第一次进入会记录数据,所以这里将渲染提出
                      onclick: function () {
                        myChart.setOption({
                          series: [
                            {
                              // 根据名字对应到相应的系列
                              name: 'Line 1',
                              data: activeData_S
                            }
                          ]
                        });
                      }
                    },
                    magicType: {
                      show: false,
                      type: ["line", "line"],
                    },
                    restore: {
                      show: false
                    },
                  },
                  width: "120px"
                },

                backgroundColor: {
                  type: 'radial',
                  x: 0.3,
                  y: 0.3,
                  r: 0.8,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(51,56,84,0.57)'
                    },
                    {
                      offset: 1,
                      color: '#353354'
                    }
                  ]
                },
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross',
                    label: {
                      backgroundColor: '#6a7985'
                    }
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                title: {text: "近日用户活跃时间总数"},
                xAxis: [
                  {
                    type: 'category',
                    boundaryGap: false,
                    data: arr,
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ],
                series: [
                  {
                    name: 'Line 1',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                      width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                      opacity: 0.8,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: 'rgb(128, 255, 165)'
                        },
                        {
                          offset: 1,
                          color: 'rgb(1, 191, 236)'
                        }
                      ])
                    },
                    emphasis: {
                      focus: 'series'
                    },
                    data: activeData
                  },
                ]
              });
              window.onresize = function () {//自适应大小
                myChart.resize();
              };
            }
          }).catch(err => {
        console.log(err)
      });
      axiox.post("http://localhost:8990/getTodaySign",qs.stringify(params))
          .then(res =>{
            if (res.data.code == 400) {
              alert(res.data.Message)
              localStorage.setItem("isLogin", "false")
              localStorage.setItem("token", "")
              router.replace('/login')
            } else{
              TodaySignData.value=res.data
              console.log(TodaySignData)
            }
          }).catch(err =>{
            console.log(err)
      })
    })
  },
  mounted() {
    CustomNav.data().default_select.value.push('/Home');
  },
}
</script>

<style scoped>

.docs-devui-row {
  margin-bottom: 10px;
}
.main {
  width: 1000px;
  height: 600px;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.8);
  margin: auto auto;
  position: absolute;
  left: 60%;
  transform: translate(-50%, -50%);
}

.dcontent {
  height: 450px;
  text-align: center;
}

.dcontent .inner-content {
  padding-top: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  height: 100%;
}
</style>