<template>
    <div class="header-setting-wrap">
        <div class="header-setting flex-c" @click="drawer = true">
            <i class="el-icon-more"></i>
        </div>
        <el-drawer size="300px" :visible.sync="drawer" direction="rtl">
            <div slot="title" class="header-title">系统布局配置</div>
            <div class="p-l-30 p-r-30">
                <div class="setting-item">
                    <span>主题色</span>
                    <ThemePicker></ThemePicker>
                </div>
                <div class="setting-item">
                    <span>侧边栏logo</span>
                    <el-switch v-model="showSidebarLogo"> </el-switch>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import ThemePicker from "@/components/theme-picker";
import { mapActions } from "vuex";
export default {
    components: {
        ThemePicker,
    },
    data() {
        return {
            drawer: false,
        };
    },
    computed: {
        showSidebarLogo: {
            get() {
                return this.$store.state.layout.showSidebarLogo;
            },
            set(val) {
                this.changeSetting({ key: "showSidebarLogo", value: val });
            },
        },
    },
    methods: {
        ...mapActions("layout", ["changeSetting"]),
    },
};
</script>

<style lang="scss" scoped>
.header-setting-wrap {
    .header-setting {
        width: 40px;
        height: 100%;
        cursor: pointer;
    }
    .header-setting:hover {
        background-color: map-get($color-background, "base");
    }
    .header-title {
        font-weight: bold;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        text-align: center;
    }
    .setting-item {
        height: 45px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
