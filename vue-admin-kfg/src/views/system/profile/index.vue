<template>
    <div class="container">
        <div class="left">
            <el-card header="关于我">
                <div></div>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: "",
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
.container {
    @include wh(100%, 100%);
    .left {
        width: 400px;
    }
}
</style>
