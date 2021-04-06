<template>
    <!-- 首页 -->
    <div>
        <UploadFile :value.sync="fileValue" :limit="1"></UploadFile>
        <UploadImg :value.sync="fileValue"></UploadImg>
        <el-button type="primary" size="default" @click="show = !show">点击</el-button>
    </div>
</template>

<script>
import UploadFile from "@/components/upload-file";
import UploadImg from "@/components/upload-file/upload-img";
export default {
    components: {
        UploadFile,
        UploadImg,
    },
    data() {
        return {
            fileValue: [],
            show: false,
        };
    },
};
</script>

<style lang="" scoped></style>
