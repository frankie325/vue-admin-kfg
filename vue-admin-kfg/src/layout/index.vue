<template>
    <div class="app-wrapper">
        <div class="sidebar">
            <Sidebar></Sidebar>
        </div>
        <div class="main">
            <Navbar></Navbar>
            <PageMain></PageMain>
        </div>
    </div>
</template>

<script>
import Sidebar from "./Sidebar/index";
import Navbar from "./Navbar/index";
import PageMain from "./PageMain/index";
export default {
    name: "",
    data() {
        return {};
    },
    components: {
        Sidebar,
        Navbar,
        PageMain,
    },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    // overflow-x: auto;
    .sidebar {
        height: 100%;
    }
    .main {
        flex: 1;
        height: 100%;
        overflow: hidden;//解决ElementUI el-table 在flex下的宽度自适应问题
    }
}
</style>
