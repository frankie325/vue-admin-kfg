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
        >
            <div class="logo-container">
                <div class="logo-wrap flex flow-r-nw col-center">
                    <div class="img-container flex-c">
                        <el-image class="img" :src="require('@/assets/logo.png')"></el-image>
                    </div>
                    <div class="m-l-10">后台管理系统</div>
                </div>
            </div>
            <SidebarItem v-for="route in permissionRoutes" :key="route.path" :item="route" :basePath="route.path"></SidebarItem>
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
        return {};
    },
    computed: {
        ...mapGetters(["sidebar", "permissionRoutes"]),
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
$logo-height: 56px;

.sidebar-container {
    height: 100%;
    .sidebar {
        height: 100%;
    }
    .sidebar:not(.el-menu--collapse) {
        @include wh(200px, 100%);
    }
    .logo-container {
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
        }
    }
}
</style>
