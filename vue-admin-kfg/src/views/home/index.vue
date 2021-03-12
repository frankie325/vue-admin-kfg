<template>
    <!-- 首页 -->
    <div>
        <UploadFile :value.sync="fileValue" :limit="1"></UploadFile>
    </div>
</template>

<script>
import UploadFile from "@/components/upload-file";
export default {
    components: {
        UploadFile,
    },
    data() {
        return {
            fileValue: [],
        };
    },
};
</script>

<style lang="" scoped></style>
