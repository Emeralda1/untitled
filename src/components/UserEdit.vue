<template>
  <div>
    <ParticlesBackground/>
  </div>
  <CustomNav />
  <main class="main">
    <custom-header/>
    <d-content class="dcontent">
      <div class="inner-content">
        <d-row class="docs-devui-row" justify="center">
          <d-col :span="24">
            <d-row class="docs-devui-row" justify="center">
              <d-col :span="24">
                <div>
                  <d-search v-model="search" icon-position="left" style="width: 90%" placeholder="请输入"></d-search>
                </div>
              </d-col>
            </d-row>
            <d-row class="docs-devui-row">
              <d-table :striped="true" :header-bg="true" :data="userdatasource" table-height="flex" fix-header style="width:90%">
                <d-column field="phonenumber" header="用户手机号" :width="200"></d-column>
                <d-column field="showname" header="昵称" :width="150"></d-column>
                <d-column field="point" header="C币余额" :width="150"></d-column>
                <d-column field="signdate" header="注册日期" :width="200"></d-column>
                <d-column header="Operation">
                  <template #default="scope">
                    <d-button v-ripple="{ duration: 300 }" @click="handleClick(scope.row)">编辑</d-button>
                    <d-modal v-model="visible">
                      <div style="margin-bottom: 10px">
                        <h4>电话:</h4>
                        <d-input v-model="nowuser.phonenumber" disabled="disabled"></d-input>
                      </div>
                      <div style="margin-bottom: 5px">
                        <h4>昵称:</h4>
                        <d-input v-model="nowuser.showname" autofocus></d-input>
                      </div>
                      <div style="margin-bottom: 5px">
                        <h4>C币:</h4>
                        <d-input-number :min="0" :max="99999" v-model="nowuser.point" autofocus></d-input-number>
                      </div>
                      <template #footer>
                        <d-modal-footer style="text-align: right; padding-right: 20px;">
                          <d-button @click="hidden">取消</d-button>
                          <d-button @click="confirm">确认</d-button>
                        </d-modal-footer>
                      </template>
                    </d-modal>
                  </template>
                </d-column>
              </d-table>
            </d-row>
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
import {onMounted, ref, watch ,nextTick} from 'vue'
import dayjs from 'dayjs'
import axiox from "axios";
import qs from "qs";
import router from "@/router";
let search=ref();
let alluser=ref();
let userdatasource=ref();
let nowuser=ref();
const visible = ref(false);
const handleClick = (row) => {
  nowuser.value={
    phonenumber:row.phonenumber,
    showname:row.showname,
    point:row.point,
  }
  console.log(nowuser.value)
  visible.value = true;
};
const hidden = () => {
  visible.value = false;
};
export default {
  name: "UserEdit",
  components: {CustomNav, CustomHeader, ParticlesBackground},
  data(){
    return{
      search,
      alluser,
      userdatasource,
      nowuser,
      visible,
      handleClick,
      hidden,
    }
  },
  mounted() {
    CustomNav.data().default_select.value.push('/useredit');
    CustomNav.data().open_keys.value.push('userdomin');
    this.getAllUser();
  },
  methods:{
    confirm(){
        let params = {
          user:nowuser.value.phonenumber,
          showname:nowuser.value.showname,
          point:nowuser.value.point,
          account: localStorage.getItem("account"),
          token: localStorage.getItem("token")
        };
        axiox.post("http://localhost:8990/updateUserInfo", qs.stringify(params))
            .then(res => {
              console.log(res)
              if (res.data.code == 400) {
                alert(res.data.Message)
                localStorage.setItem("isLogin", "false")
                localStorage.setItem("token", "")
                router.replace('/login')
              } else {
                this.getAllUser();
              }
            }).catch(err=> {
          console.log(err)
        })
        visible.value = false;
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
  padding-left: 50px;
  background-color: rgba(255, 255, 255, 0.1);
  height: 100%;
}
</style>