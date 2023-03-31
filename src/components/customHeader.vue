<template>
  <d-header class="dheader">
    <d-row justify="start" class="docs-devui-row">
      <d-col :span="10" class="col-child">
        <div class="avatar-demo-1">
          <d-row type="flex" class="docs-devui-row">
            <d-col :flex="3">
              <d-avatar v-bind:name="role"></d-avatar>
              <h>欢迎您</h>
              <h2>{{ username }}</h2>
            </d-col>
            <d-col :flex="2">
              <h>您的身份：</h>
              <h>{{ roleformate }}</h>
              <h4>{{ nowTime }}</h4>
            </d-col>
          </d-row>
        </div>
      </d-col>
      <d-col :span="12" class="col-child">
        <h4>选择主题</h4>
        <d-radio-group direction="row" v-model="currentTheme">
          <d-radio v-for="item in themeList" :key="item.value" :value="item.value" :name="item.label">{{
              item.label
            }}
          </d-radio>
        </d-radio-group>
      </d-col>
      <d-col :span="2" class="col-child">
        <d-button v-ripple="{ duration: 300 }" style="margin-top: 10px">
          登出
        </d-button>
      </d-col>
    </d-row>
  </d-header>
</template>

<script>
import {ref} from "vue";
import axiox from "axios";
import qs from "qs";
import router from "@/router";
import {deepTheme, galaxyTheme, infinityTheme, provenceTheme, sweetTheme, ThemeServiceInit} from "devui-theme";
export default {
  name: "customHeader",
  data() {
    return {
      username: ref(localStorage.getItem("account")),
      role: ref(''),
      nowTime: '',
      currentTheme: ref('galaxy-theme'),
      themeList: ref([{value: 'infinity-theme', label: '无限'}, {
        value: 'sweet-theme',
        label: '蜜糖'
      }, {value: 'provence-theme', label: '紫罗兰'}, {value: 'deep-theme', label: '深邃夜空'}, {
        value: 'galaxy-theme',
        label: '追光'
      }]),
      THEME_MAP: {
        'infinity-theme': infinityTheme,
        'sweet-theme': sweetTheme,
        'provence-theme': provenceTheme,
        'deep-theme': deepTheme,
        'galaxy-theme': galaxyTheme,
      },
      themeService: ThemeServiceInit({galaxyTheme}, this.currentTheme),
    }
  },
  computed:{
    roleformate(){
      if (this.role=="SA"){
        return "超级管理员"
      }
      else return "普通管理员"
    },
  },
  watch: {
    currentTheme(newTheme, oldTheme) {
      this.themeService.applyTheme(this.THEME_MAP[newTheme])
    }
  },
  methods: {
    getAdminInfo() {
      let params = {
        account: this.username,
        token: localStorage.getItem("token")
      }
      axiox.post("http://localhost:8990/getAdminInfo", qs.stringify(params))
          .then(res => {
            console.log(res)
            if (res.data.code == 400) {
              alert(res.data.Message)
              localStorage.setItem("isLogin", "false")
              localStorage.setItem("token", "")
              router.replace('/login')
            } else (this.role = res.data.role == "superadmin" ? "SA" : "AD")
          }).catch(err => {
        console.log(err)
      })
    },
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month = new Date(timeStamp).getMonth() + 1 < 10 ? "0" + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1;
      let date = new Date(timeStamp).getDate() < 10 ? "0" + new Date(timeStamp).getDate() : new Date(timeStamp).getDate();
      let hh = new Date(timeStamp).getHours() < 10 ? "0" + new Date(timeStamp).getHours() : new Date(timeStamp).getHours();
      let mm = new Date(timeStamp).getMinutes() < 10 ? "0" + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes();
      let ss = new Date(timeStamp).getSeconds() < 10 ? "0" + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds();
      this.nowTime = year + "年" + month + "月" + date + "日" + " " + hh + ":" + mm + ':' + ss;
    },
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 1000);
      this.clear()
    },
    clear() {
      clearInterval(this.nowTimes)
      this.nowTimes = null;
    },
  },
  mounted() {
    this.getAdminInfo();
    this.nowTimes();
    this.themeService.applyTheme(this.THEME_MAP['galaxy-theme']);
  },
}
</script>

<style scoped>
.dheader {
  padding: 20px 10px 20px 50px;
  background: #333854;
  color: #fff;
  text-align: start;
  line-height: 40px;
}
</style>