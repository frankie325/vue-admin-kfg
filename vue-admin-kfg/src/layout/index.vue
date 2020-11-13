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
import Sidebar from "./components/Sidebar/index";
import Navbar from "./components/Navbar/index";
import PageMain from "./components/PageMain/index";
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
    .sidebar {
        height: 100%;
    }
    .main {
        flex: 1;
        height: 100%;
    }
}
</style>
