<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">云E办</div>
                <el-dropdown class="userInfo" @command="commandHandler">
                    <span class="el-dropdown-link">
                        {{ user.name }}<i><img :src="user.userFace"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="settings">设置</el-dropdown-item>
                        <el-dropdown-item command="logout">注销登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router unique-opened>
                        <el-submenu :index="index+''"
                                    v-for="(item,index) in routes"
                                    :key="index"
                                    v-if="!item.hidden">
                            <template slot="title">
                                <i :class="item.iconCls" style="color: #1accff; margin-right:5px"></i>
                                <span>{{ item.name }}</span>
                            </template>
                            <el-menu-item :index="children.path"
                                          v-for="(children, indexj) in item.children"
                                          :key="indexj">
                                <span>{{ children.name }}</span>>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
                        欢迎来到云E办系统！
                    </div>
                    <router-view class="homeRouterView"/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: "Home",
    props: [],
    components: {},
    data() {
        return {
            //P69修改
            // user: JSON.parse(window.sessionStorage.getItem('user'))
        }
    },
    methods: {
        commandHandler(command) {
            if (command == 'logout') {
                this.$confirm('此操作注销登录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //注销登录
                    this.postRequest('/logout');
                    window.sessionStorage.removeItem('tokenStr');
                    window.sessionStorage.removeItem('user');
                    //清空菜单
                    this.$store.commit('initRoutes', []);
                    //跳转到登录页
                    this.$router.replace('/');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            } else if (command == 'settings') {

            } else if (command == 'userinfo') {
                this.$router.push('/userinfo');
            }
        }
    },
    mounted() {
    },
    computed: {
        routes() {
            return this.$store.state.routes;
        },
        //P69新增
        user(){
            return this.$store.state.currentAdmin;
        }
    }
}
</script>

<style>
.homeHeader {
    background: #409eff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
}

.homeHeader .title {
    font-size: 30px;
    font-family: 华文楷体;
    color: white;
}

.homeHeader .userInfo {
    cursor: pointer;
}

.el-dropdown-link img {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    margin-left: 8px;
}

.homeWelcome {
    text-align: center;
    font-size: 30px;
    font-family: 华文楷体;
    color: #409eff;
    padding-top: 50px;
}

.homeRouterView{
    margin-top: 10px;
}
</style>