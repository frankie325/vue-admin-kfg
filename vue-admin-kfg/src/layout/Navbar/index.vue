<template>
    <div class="navbar">
        <div class="fold flex-c" :class="{ 'bg-base': over }" @click="toggleSideBar" @mouseover="over = true" @mouseout="over = false">
            <i style="font-size:20px" class="el-icon-s-unfold" v-if="sidebar.isCollapse"></i>
            <i style="font-size:20px" class="el-icon-s-fold" v-else></i>
        </div>
        <div class="flex-1 flex col-center p-l-15">
            <el-breadcrumb separator="/">
                <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
                <el-breadcrumb-item :to="{ path: item.path }" v-for="item in levelList" :key="item.path">{{ item.name }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="header-user">
            <el-dropdown placement="bottom">
                <div>
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><i class="el-icon-user"></i>个人中心</el-dropdown-item>
                    <el-dropdown-item><i class="el-icon-setting"></i>系统设置</el-dropdown-item>
                    <el-dropdown-item divided @click.native="logout"><i class="el-icon-switch-button"></i>退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <HeaderSetting></HeaderSetting>
    </div>
</template>

<script>
import HeaderSetting from "./components/header-setting";
import { mapGetters, mapActions } from "vuex";
export default {
    components: {
        HeaderSetting,
    },
    name: "NavBar",
    watch: {
        $route: {
            handler: function(newRoute) {
                this.levelList = newRoute.matched.map((val) => {
                    return {
                        name: val.meta.title,
                        path: val.path,
                    };
                });
            },
            immediate: true,
        },
    },
    data() {
        return {
            over: false,
            levelList: [],
        };
    },
    computed: {
        ...mapGetters(["sidebar"]),
    },
    methods: {
        ...mapActions("user", ["removeToken"]),
        toggleSideBar() {
            this.$store.dispatch("app/toggleSideBar");
        },
        // 退出登录
        async logout() {
            await this.removeToken();
            this.$router.replace("/login");
        },
    },
};
</script>

<style lang="scss" scoped>
.navbar {
    width: 100%;
    height: 50px;
    background: #fff;
    border-bottom: 1px solid #dedede;
    display: flex;
    .fold {
        width: 50px;
        height: 100%;
        cursor: pointer;
    }
    .header-user {
        width: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    .header-user:hover {
        background-color: map-get($color-background, "base");
    }
}
</style>
