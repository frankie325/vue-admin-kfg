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
        :before-upload="beforeUpload"
    >
        <div v-for="(file, index) in fileList" :key="index" class="pre-img" @click.stop>
            <el-image :src="fileUrl + file.url" fit="fill" style="width: 100%; height: 100%" @click="handlePreview(file)"></el-image>
            <i class="el-icon-close pre-close" @click.stop="handleRemove(index)"></i>
        </div>
        <div class="img-upload">
            <i class="el-icon-plus upload-icon"></i>
        </div>
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
            imageUrl: "",
            fileUrl: window.globalVar.fileUrl + "/",
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
        // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传
        beforeUpload(file) {
            let typeLimit = ["png", "jpeg", "jpg"];
            let suffix = file.name.substring(file.name.lastIndexOf(".") + 1);
            if (typeLimit.indexOf(suffix) !== -1) {
                return true;
            } else {
                this.$message.error(`只支持 ${typeLimit.toString()} 类型的文件`);
                return false;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep .el-upload {
    display: inline-flex;
    // flex-flow: row wrap;
}

$wh: 120px;
.img-upload {
    width: $wh;
    height: $wh;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    // position: relative;
    // overflow: hidden;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    .upload-icon {
        font-size: 24px;
        color: #8c939d;
    }
}

.img-upload:hover {
    border-color: #409eff;
}
.pre-img {
    width: $wh;
    height: $wh;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    position: relative;
    display: inline-block;
    margin-right: 12px;
    .pre-close {
        color: red;
        font-size: 20px;
        position: absolute;
        top: 0px;
        right: 0px;
    }
}
</style>
