<template xmlns="http://www.w3.org/1999/html">
  <div>
    <ParticlesBackground/>
  </div>
  <CustomNav />
  <main class="main">
    <custom-header/>
    <d-content class="dcontent">
      <div class="inner-content">
        <d-row :gutter="10" class="docs-devui-row">
          <d-col :span="5" class="col-gutter">
            <div class="col-child">
              <d-row class="docs-devui-row">
                <div>
                  <d-search v-model="search" icon-position="left" style="width: 90%" placeholder="请输入"></d-search>
                </div>
              </d-row>
              <d-row class="docs-devui-row">
                <d-table @row-click="onRowClick" :striped="true" :header-bg="true" :data="userdatasource" table-height="flex" fix-header style="width:100%">
                  <d-column field="phonenumber" header="用户手机号" :width="150"></d-column>
                </d-table>
              </d-row>
            </div>
          </d-col>
          <d-col :span="19" class="col-gutter">
            <div class="col-child">
              <d-card class="card-demo-custom-area" :align="'spaceBetween'">
                <div class="custom-avatar">
                  <d-avatar v-bind:name="showname" :width="48" :height="48" :isRound="true"></d-avatar>
                </div>
                <template v-slot:title> 用户信息： </template>
                <template v-slot:content>
                  <d-row :gutter="10" class="docs-devui-row">
                    <d-col :span="12" class="col-gutter">
                      <div class="col-child">
                        <h3 align="left">手机号码：</h3>
                        <h3 align="left">用户昵称：</h3>
                        <h3 align="left">注册时间：</h3>
                        <h3 align="left">C币余额：</h3>
                      </div>
                    </d-col>
                    <d-col :span="12" class="col-gutter">
                      <div class="col-child">
                        <h3 align="center">{{this.phone}}</h3>
                        <h3 align="center">{{this.showname}}</h3>
                        <h3 align="center">{{this.signdate}}</h3>
                        <h3 align="center">{{this.coin}}</h3>
                      </div>
                    </d-col>
                  </d-row>
                </template>
                <template v-slot:actions>
                  <div class="action-text">Updated at {{ this.updateTime }}</div>
                </template>
              </d-card>
              <h5 align="left" style="margin-top: 3px;margin-left: 10px;">C币记录概览</h5>
              <d-table :data="coindata" table-height=flex fix-header style="width:100%">
                <d-column field="time" header="时间" :width="200"></d-column>
                <d-column field="value" header="值" :width="150"></d-column>
                <d-column field="way" header="方式" :width="150"></d-column>
              </d-table>
            </div>
          </d-col>
        </d-row>
      </div>
    </d-content>
  </main>
</template>

<script>
import ParticlesBackground from "@/components/ParticlesBackground.vue";
import CustomHeader from "@/components/customHeader.vue";
import CustomNav from "@/components/customNav.vue";
import {onMounted, ref, watch} from 'vue'
import dayjs from 'dayjs'
import axiox from "axios";
import qs from "qs";
import router from "@/router";
const updateTime=ref(dayjs().format("MMM. DD HH:mm"));
let alluser=ref();
let userdatasource=ref();
let search=ref();
let coindata=ref();
let nowuser=ref();
export default {
  name: "Userview",
  components: {ParticlesBackground, CustomNav, CustomHeader},
  data(){
    return{
      onRowClick:(params) => {
        this.phone=params.row.phonenumber;
        this.showname=params.row.showname;
        this.signdate=params.row.signdate;
        this.coin=params.row.point;
        this.getPointRecord(params.row.phonenumber)
        console("!!!!!"+params.row)
      },
      updateTime,
      alluser,
      userdatasource,
      search,
      coindata,
      nowuser,
      phone:ref(''),
      showname:ref(''),
      signdate:ref(''),
      coin:ref(''),
    }
  },
  methods:{
    getPointRecord(nu){
      let param = {
        user:nu,
        account: localStorage.getItem("account"),
        token: localStorage.getItem("token")
      };
      console.log(qs.stringify(param))
      axiox.post("http://localhost:8990/getUserPointRecord", qs.stringify(param))
          .then(res => {
            console.log(res)
            if (res.data.code == 400) {
              alert(res.data.Message)
              localStorage.setItem("isLogin", "false")
              localStorage.setItem("token", "")
              router.replace('/login')
            } else {
              console.log("point"+res.data)
              coindata.value=res.data;
            }
          }).catch(err=>{
        console.log(err)
      });
    },
    getAllUser(){
      let params = {
        account: localStorage.getItem("account"),
        token: localStorage.getItem("token")
      };
      axiox.post("http://localhost:8990/getAllUser", qs.stringify(params))
          .then(res => {
            console.log(res)
            if (res.data.code == 400) {
              alert(res.data.Message)
              localStorage.setItem("isLogin", "false")
              localStorage.setItem("token", "")
              router.replace('/login')
            } else {
              alluser.value=res.data;
              userdatasource.value=res.data;
              this.phone=res.data[0].phonenumber;
              this.showname=res.data[0].showname;
              this.signdate=res.data[0].signdate;
              this.coin=res.data[0].point;
              nowuser.value=res.data[0].phonenumber;
              console.log(userdatasource.value)
              this.getPointRecord(nowuser.value)
            }
          }).catch(err=>{
        console.log(err)
      });
    },
  },
  watch:{
    search(newv,oldv){
      if (newv!=''||newv!=null){
        userdatasource.value=alluser.value.filter(u=>u.phonenumber.includes(newv))
      }
      if (newv==''||newv==null) userdatasource.value=alluser.value
    }
  },
  mounted() {
    CustomNav.data().default_select.value.push('/userview');
    CustomNav.data().open_keys.value.push('userdomin');
    this.getAllUser();
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