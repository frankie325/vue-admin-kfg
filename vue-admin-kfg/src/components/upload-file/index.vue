<template>
    <el-upload
        :file-list="fileList"
        :action="action"
        :headers="headers"
        :show-file-list="false"
        :disabled="disabled"
        :multiple="multiple"
        :limit="limit"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
    >
        <div class="pre-file" v-for="(file, index) in fileList" :key="index" @click.stop>
            <span class="pre-file-text" @click="handlePreview(file)">{{ file.name }}</span>
            <i class="el-icon-close pre-file-icon" @click="handleRemove(index)"></i>
        </div>
        <el-button icon="el-icon-upload" size="small">点击上传</el-button>
    </el-upload>
</template>

<script>
import { getToken } from "@/utils/auth.js";
export default {
    props: {
        value: {
            type: Array,
            default: () => [],
        },
        action: {
            type: String,
            default: window.globalVar.baseUrl + "/admin/upload",
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        limit: {
            type: Number,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        fileList: {
            get() {
                return this.value;
            },
            set(nv) {
                this.$emit("update:value", nv);
            },
        },
    },
    data() {
        return {
            headers: {
                Authorization: getToken(),
            },
            fileUrl: window.globalVar.fileUrl,
        };
    },
    methods: {
        // 上传成功
        handleSuccess(response, file, fileList) {
            console.log(response, file, fileList);
            if (response.code === 50001) {
                this.$message.warning(response.msg);
                this.$store.dispatch("user/removeToken").then(() => {
                    this.$router.replace("/login");
                });
                return;
            }
            response.data.forEach((val) => {
                this.fileList.push({
                    name: val.filename,
                    url: val.path,
                });
            });
        },
        // 删除列表
        handleRemove(index) {
            this.fileList.splice(index, 1);
        },
        // 预览上传的文件
        handlePreview(file) {
            window.open(this.fileUrl + file.url);
        },
        // 文件超出限制个数时调用
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep .el-upload {
    height: 32px;
    // display: flex;
    align-items: center;
}
.pre-file {
    height: 100%;
    display: inline-block;
    // align-items: center;
    margin-right: 20px;
    cursor: pointer;
    .pre-file-text {
        text-decoration: underline;
        margin-right: 15px;
        font-size: 14px;
        color: #16b390;
        line-height: 32px;
    }
    .pre-file-text:hover {
        color: #16b39191;
    }
    .pre-file-icon {
        transform: translateY(-3px);
        font-size: 14px;
    }
}
</style>
