<template>
  <main class="vertivalNav">
    <d-menu mode="vertical" router="true" :open-keys="open_keys" :default-select-keys="default_select" width="200px">
      <d-menu-item key="/Home">
        <template #icon>
          <i class="icon-homepage"></i>
        </template>
        <span>Home</span>
      </d-menu-item>
      <d-sub-menu title="用户管理" key="userdomin">
        <template #icon>
          <i class="icon-member"></i>
        </template>
        <d-menu-item key="/userview">
          <span>用户概览</span>
        </d-menu-item>
        <d-menu-item key="/useredit">
          <span>用户编辑</span>
        </d-menu-item>
      </d-sub-menu>
      <d-sub-menu title="管理员管理" key="admindomin">
        <template #icon>
          <i class="icon-member"></i>
        </template>
        <d-menu-item key="/adminedit">
          <span>管理员编辑</span>
        </d-menu-item>
      </d-sub-menu>
    </d-menu>
  </main>
</template>

<script>
import {ref,onMounted} from 'vue'
let default_select=ref([]);
let open_keys=ref([]);
export default {
  name: "customNav",
  data(){
    return{
      default_select,
      open_keys,
    }
  },
  setup(){
    onMounted(()=>{
     default_select.value=[]
      open_keys.value=[]
    })
  }
}
</script>

<style scoped>
.vertivalNav {
  height: 400px;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.8);
  margin: auto auto;
  position: absolute;
  left: 10%;
  transform: translate(-50%, -50%);
}
</style>