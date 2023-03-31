<template>
  <div><ParticlesBackground/></div>
  <main class="box">
    <h2>lisc毕设后台管理系统</h2>
    <form @submit.prevent="submitForm" action="/" method="post">
      <div class="inputBox">
        <label for="userName">用户名</label>
        <input v-model="loginform.username" type="text" id="userName" placeholder="type your username" required>
      </div>
      <div class="inputBox">
        <label for="userPassword">密码</label>
        <input v-model="loginform.password" type="password" id="userPassword" placeholder="type your password" required>
      </div>
      <input type="submit" name="" value="登录">
    </form>
  </main>
</template>

<script>
import ParticlesBackground from "@/components/ParticlesBackground.vue";
import axios from "axios";
import {Encrypt} from "@/secret";
import qs from 'qs';
import router from "@/router";
export default {
  name: "Login",
  components: {ParticlesBackground},
  data(){
    return {
      loginform:{
        username:'',
        password:'',
      }
    }
  },
  methods: {
    submitForm(){
      let params={
        account: this.loginform.username,
        password: Encrypt(this.loginform.password)
      }
      axios.post("http://localhost:8990/adminlogin",qs.stringify(params))
          .then(res =>{
            console.log(res)
            if (res.data.code==200) {
              const token = res.headers['token']
              localStorage.setItem("token",token)
              localStorage.setItem("isLogin","true")
              localStorage.setItem("account",params.account)
              router.replace('/')
            }
            else alert(res.data.Message)
          })
          .catch(err =>console.log(err))
    }
  },
}
</script>

<style scoped>
.box {
  width: 440px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.8);
  margin: auto auto;
  padding: 40px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

.box h2 {
  margin: 0 0 30px 0;
  padding: 0;
  color: #fff;
  text-align: center;
}

.box .inputBox label {
  color: #fff;
}

.box .inputBox input {
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  font-size: 18px;
  letter-spacing: 2px;
  margin-bottom: 30px;
  outline: none;
  padding: 10px 0;
  width: 100%;
}

.box input[type="submit"] {
  background: rgba(3, 169, 244, 0.2);
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  padding: 10px 20px;
  letter-spacing: 2px;
  outline: none;
  text-transform: uppercase;
}

.box input[type="submit"]:hover {
  opacity: 0.8;
}
</style>