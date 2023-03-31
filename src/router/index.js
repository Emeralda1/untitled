import {createRouter,createWebHistory} from "vue-router";
import Login from "../components/Login.vue"
import qs from 'qs';
import Index from "@/components/Index.vue";
import Userview from "@/components/Userview.vue"
import UserEdit from "@/components/UserEdit.vue"
import AdminEdit from "@/components/AdminEdit.vue"
const routes = [
    {path: "/login",component:Login},
    {path: "/Home",component:Index},
    {path: "/userview",component:Userview},
    {path: "/useredit",component:UserEdit},
    {path: "/adminedit",component:AdminEdit},
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
router.beforeEach((to,from,next)=>{
    const isLogin = localStorage.getItem('isLogin');
    if(to.path == '/login' || to.path == '/register'){
        next();
    }else{
        let token=localStorage.getItem('token')
        if (token == null||token == '') {
            next('/login')
        }
        if (isLogin!="true") {
            alert('您还没有登录，请先登录');
            next('/login');
        }
        if (to.path == '/')
            next('/Home')
        else next();
    }
})
export default router