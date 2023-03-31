import { createApp} from 'vue'
import Particles from 'particles.vue3'
import './assets/main.css'
import router from "@/router";
import App from "@/App.vue";
import DevUI from 'vue-devui';
import 'vue-devui/style.css';
import '@devui-design/icons/icomoon/devui-icon.css';
import { ThemeServiceInit, galaxyTheme } from 'devui-theme';
import { createStore } from 'vuex';
ThemeServiceInit({ galaxyTheme }, 'galaxy-theme');

createApp(App)
    .use(DevUI)
    .use(Particles)
    .use(router)
    .mount('#app')
