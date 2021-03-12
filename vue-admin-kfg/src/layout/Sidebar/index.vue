<template>
    <div class="sidebar-container">
        <el-menu
            class="sidebar"
            :collapse-transition="true"
            @open="handleOpen"
            @close="handleClose"
            :collapse="sidebar.isCollapse"
            router
            :default-active="$route.path"
            background-color="rgb(84, 92, 100)"
            text-color="#fff"
            active-text-color="rgb(255, 208, 75)"
        >
            <!-- background-color="rgb(84, 92, 100)"
            text-color="#fff"
            active-text-color="rgb(255, 208, 75)" -->
            <div class="logo-container" v-show="$store.state.layout.showSidebarLogo">
                <div class="logo-wrap flex flow-r-nw col-center">
                    <div class="img-container flex-c">
                        <el-image class="img" :src="require('@/assets/logo.png')"></el-image>
                    </div>
                    <div class="m-l-8 logo-text">后台管理系统</div>
                </div>
            </div>
            <SidebarItem v-for="route in allRoutes" :key="route.path" :item="route" :basePath="route.path"></SidebarItem>
        </el-menu>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
export default {
    name: "Sidebar",
    components: {
        SidebarItem,
    },
    data() {
        return {
            routes: [],
        };
    },
    watch: {
        // allRoutes: {
        //     handler(nv, oldval) {
        //         console.log(nv, oldval);
        //         this.routes = nv;
        //     },
        //     immediate: true,
        // },
    },
    computed: {
        ...mapGetters(["sidebar", "allRoutes"]),
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
    },
};
</script>

<style lang="scss" scoped>
$logo-height: 65px;

.sidebar-container {
    height: 100%;
    .sidebar {
        height: 100%;
    }
    .sidebar:not(.el-menu--collapse) {
        @include wh(200px, 100%);
    }
    .logo-container {
        // display: none;
        height: $logo-height;
        overflow: hidden;
        .logo-wrap {
            width: 200px;
            .img-container {
                @include wh(64px, $logo-height);
                .img {
                    @include wh(50px, 50px);
                }
            }
            .logo-text {
                color: #ffffff;
                font-weight: bold;
                font-size: 18px;
                font-family: "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei",
                    sans-serif;
            }
        }
    }
}
</style>
