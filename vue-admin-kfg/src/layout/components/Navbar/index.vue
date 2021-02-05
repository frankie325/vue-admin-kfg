<template>
    <div class="navbar">
        <div class="fold flex-c" :class="{ 'bg-base': over }" @click="toggleSideBar" @mouseover="over = true" @mouseout="over = false">
            <i style="font-size:20px" class="el-icon-s-unfold" v-if="sidebar.isCollapse"></i>
            <i style="font-size:20px" class="el-icon-s-fold" v-else></i>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "NavBar",
    data() {
        return {
            over: false,
        };
    },
    computed: {
        ...mapGetters(["sidebar"]),
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch("app/toggleSideBar");
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
    .fold {
        width: 50px;
        height: 100%;
        cursor: pointer;
    }
}
</style>
