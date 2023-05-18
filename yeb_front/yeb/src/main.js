import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {postRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import store from './store/index'
import {initMenu} from "@/utils/menus";
import 'font-awesome/css/font-awesome.css'
import {downloadRequest} from "@/utils/download";

Vue.config.productionTip = false
Vue.use(ElementUI, {size:'small'});

//插件形式使用请求
Vue.prototype.postRequset = postRequest;
Vue.prototype.putRequset = putRequest;
Vue.prototype.getRequset = getRequest;
Vue.prototype.deleteRequset = deleteRequest;
Vie.prototype.downloadRequest = downloadRequest;


//页面跳转控制
router.beforeEach((to, from, next) => {
    if (window.sessionStorage.getItem('tokenStr')) {
        initMenu(router, store);
        //判断用户信息是否存在
        if (!window.sessionStorage.getItem('user')) {
            return getRequest('/admin/info').then(resp => {
                if (resp) {
                    //存入用户信息
                    window.sessionStorage.setItem('user', JSON.stringify(resp));

                    //P69修改用户信息中添加，防止页面用户信息不随修改同步问题
                    store.commit('INIT_ADMIN', resp);
                    next();
                }
            })
        }
        next();
    } else {
        if (to.path == '/') {
            next();
        } else {
            next('/?redirect=' + to.path);
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
