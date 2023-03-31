<template>
  <div>
    <ParticlesBackground/>
  </div>
  <CustomNav />
  <main class="main">
    <custom-header/>
    <d-content class="dcontent">
      <div class="inner-content">
        <d-button  @click="handleClick" icon="add" variant="solid">
          New
        </d-button>
        <d-modal v-model="visible">
          <template #header>
            <d-modal-header>
              <span>新增管理员</span>
            </d-modal-header>
          </template>
          <div style="margin-bottom: 5px">
            <h4>账户:</h4>
            <d-input v-model="new_account"></d-input>
          </div>
          <div style="margin-bottom: 5px">
            <h4>密码:</h4>
            <d-input v-model="new_pwd" autofocus></d-input>
          </div>
          <div>
            <h4>角色:</h4>
            <d-select class="mb-2" v-model="new_role" :options="options" size="sm"></d-select>
          </div>
          <template #footer>
            <d-modal-footer style="text-align: right; padding-right: 20px;">
              <d-button @click="hidden">取消</d-button>
              <d-button @click="confirm1">确认</d-button>
            </d-modal-footer>
          </template>
        </d-modal>
        <d-table :striped="true" :header-bg="true" :data="Alladmin" style="margin-top: 20px;width:90%" table-height="flex" fix-header>
          <d-column field="id" header="ID" :width="200"></d-column>
          <d-column field="account" header="账户" :width="150"></d-column>
          <d-column field="password" header="密码" :width="150"></d-column>
          <d-column field="role" header="权限等级" :width="200"></d-column>
          <d-column header="Operation">
            <template #default="scope">
              <d-button v-ripple="{ duration: 300 }" @click="handleClick2(scope.row)">编辑</d-button>
              <d-modal v-model="visible2">
                <div style="margin-bottom: 5px">
                  <h4>账户:</h4>
                  <d-input v-model="nowadmin.account" disabled="disabled"></d-input>
                </div>
                <div style="margin-bottom: 5px">
                  <h4>密码:</h4>
                  <d-input v-model="nowadmin.password" autofocus></d-input>
                </div>
                <div>
                  <h4>角色:</h4>
                  <d-select class="mb-2" v-model="nowadmin.role" :options="options" size="sm"></d-select>
                </div>
                <template #footer>
                  <d-modal-footer style="text-align: right; padding-right: 20px;">
                    <d-button @click="hidden">取消</d-button>
                    <d-button @click="confirm2">确认</d-button>
                  </d-modal-footer>
                </template>
              </d-modal>
            </template>
          </d-column>
        </d-table>
      </div>
    </d-content>
  </main>
</template>

<script>

import CustomNav from "@/components/customNav.vue";
import {onMounted, ref, watch ,nextTick} from 'vue'
import dayjs from 'dayjs'
import axiox from "axios";
import qs from "qs";
import router from "@/router";
import ParticlesBackground from "@/components/ParticlesBackground.vue";
import CustomHeader from "@/components/customHeader.vue";
let Alladmin=ref();
let nowadmin=ref();
let new_account=ref();
let new_pwd=ref();
let new_role=ref();
const options=ref(['superadmin','admin'])
const visible = ref(false);
const visible2 = ref(false);
const handleClick = () => {
  visible.value = true;
};
const handleClick2 = (row) => {
  nowadmin.value={
    account:row.account,
    password:row.password,
    role:row.role,
  }
  visible2.value = true;
};
const hidden = () => {
  visible.value = false;
  visible2.value = false;
};
export default {
  name: "AdminEdit",
  components: {CustomHeader, CustomNav, ParticlesBackground},
  data(){
    return{
      Alladmin,
      nowadmin,
      handleClick,
      handleClick2,
      hidden,
      new_account,
      new_pwd,
      new_role,
      visible,
      visible2,
      options,
    }
  },
  mounted() {
    CustomNav.data().default_select.value.push('/adminedit');
    CustomNav.data().open_keys.value.push('admindomin');
    this.getAllAdmin();
  },
  methods:{
    getAllAdmin (){
      let params = {
        account: localStorage.getItem("account"),
        token: localStorage.getItem("token")
      };
      axiox.post("http://localhost:8990/getAllAdmin", qs.stringify(params))
          .then(res => {
            console.log(res)
            if (res.data.code == 400) {
              alert(res.data.Message)
              localStorage.setItem("isLogin", "false")
              localStorage.setItem("token", "")
              router.replace('/login')
            }
            else if (res.data.code ==300){
              alert(res.data.Message)
            }
            else {
              Alladmin.value=res.data;
            }
          }).catch(err=>{
        console.log(err)
      });
    },
    confirm1(){
      let params = {
        newaccount:new_account.value,
        newpwd:new_pwd.value,
        newrole:new_role.value,
        account: localStorage.getItem("account"),
        token: localStorage.getItem("token"),
      };
      console.log(qs.stringify(params))
      axiox.post("http://localhost:8990/addNewAdmin", qs.stringify(params))
          .then(res => {
            console.log(res)
            if (res.data.code == 400) {
              alert(res.data.Message)
              localStorage.setItem("isLogin", "false")
              localStorage.setItem("token", "")
              router.replace('/login')
            }
            else if (res.data.code ==300){
              alert(res.data.Message)
            }
            else {
              this.getAllAdmin();
            }
          }).catch(err=> {
        console.log(err)
      })
      visible.value = false;
    },
    confirm2(){
      let params = {
        user:nowadmin.value.account,
        password:nowadmin.value.password,
        role:nowadmin.value.role,
        account: localStorage.getItem("account"),
        token: localStorage.getItem("token"),
      };
      console.log(qs.stringify(params))
      axiox.post("http://localhost:8990/updateAdminInfo", qs.stringify(params))
          .then(res => {
            console.log(res)
            if (res.data.code == 400) {
              alert(res.data.Message)
              localStorage.setItem("isLogin", "false")
              localStorage.setItem("token", "")
              router.replace('/login')
            }
            else if (res.data.code ==300){
              alert(res.data.Message)
            }
            else {
              this.getAllAdmin();
            }
          }).catch(err=> {
        console.log(err)
      })
      visible2.value = false;
    },
  }
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
  text-align: left;
}

.dcontent .inner-content {
  padding-top: 20px;
  padding-left: 50px;
  background-color: rgba(255, 255, 255, 0.1);
  height: 100%;
}
</style>