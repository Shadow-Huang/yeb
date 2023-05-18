import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        routes: [],
        currentAdmin: null
    },

    //同步更新state
    mutations: {
        INIT_ADMIN(state, admin) {
            state.currentAdmin = admin;
        },
        initRoutes(state, data) {
            state.routes = data;
        }
    },

    //异步更新state
    actions: {
        initRoutes(state, data) {
            state.routes = data;
        }
    }
})