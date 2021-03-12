<template>
    <el-dialog title="权限管理" :visible.sync="show" width="1200px" :destroy-on-close="true" @closed="close">
        <div class="content-warp flex">
            <div class="left">
                <Tree
                    title="权限导航"
                    :data="treeData"
                    :default-expanded-keys="defaultExpandedKeys"
                    @node-click="clickNode"
                    @addNode="addNode"
                    @editNode="editNode"
                    @deleteNode="deleteNode"
                    :draggable="true"
                    @dragNode="dragNode"
                ></Tree>
            </div>
            <el-card class="right">
                <div slot="header" style="position:relative" class="flex col-center row-between">
                    <div class="fw-b">权限设置</div>
                    <el-button
                        style="position:absolute;right:0;width:80px"
                        type="primary"
                        size="medium"
                        @click="submit('authForm')"
                        :disabled="disabled"
                        >确定</el-button
                    >
                </div>
                <el-form ref="authForm" :model="authFormData" :rules="rules" :disabled="disabled">
                    <el-form-item label="权限名称" prop="name">
                        <el-input show-word-limit :maxlength="30" v-model="authFormData.name" placeholder="请输入权限名称"></el-input>
                    </el-form-item>
                    <el-form-item label="权限标识" prop="auth">
                        <el-input show-word-limit :maxlength="30" v-model="authFormData.auth" placeholder="请输入权限标识"></el-input>
                    </el-form-item>
                    <el-form-item label="排序号" prop="sort">
                        <el-input-number
                            :min="1"
                            :step="1"
                            size="medium"
                            step-strictly
                            controls-position="right"
                            placeholder="请输入排序号"
                            v-model="authFormData.sort"
                        ></el-input-number>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </el-dialog>
</template>

<script>
import Tree from "@/components/tree";
import { createAuth, editAuth, deleteAuth, getAllAuth } from "@/api/system/auth.js";
import { dragMenu } from "@/api/system";
export default {
    components: {
        Tree,
    },
    props: {
        value: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        show: {
            get() {
                return this.value;
            },
            set(nv) {
                this.$emit("input", nv);
            },
        },
    },
    data() {
        return {
            disabled: true,
            authFormData: {},
            treeData: [],
            rules: {
                name: [{ required: true, message: "权限名称不能为空", trigger: "blur" }],
                auth: [{ required: true, message: "权限标识不能为空", trigger: "blur" }],
                sort: [{ type: "number", required: true, message: "排序号不能为空", trigger: "change" }],
            },
            optateStatus: null, //1为添加，2为编辑
            defaultExpandedKeys: [], //添加成功后展开添加的节点
        };
    },
    methods: {
        // 获取所有权限数据
        async getAuthData() {
            let { data } = await getAllAuth();
            this.treeData = data;
            this.$emit("authUpdated", data);
        },
        // 点击节点
        clickNode(data, node, selfDom) {
            this.$refs["authForm"].clearValidate();
            this.disabled = true;
            this.authFormData = { ...data };
        },
        // 添加权限节点
        addNode(status, node, data) {
            this.optateStatus = 1;
            this.disabled = false;
            this.authFormData = {
                sort: data.children ? data.children.length + 1 : 1,
            };
            // 排序号通过change校验，当数据清空时，会进行校验，导致校验提示信息出来
            // clearValidate无法清除，需要一个计时器，放入任务队列
            // this.$refs["authForm"].clearValidate();
            setTimeout(() => {
                this.$refs["authForm"].clearValidate();
            }, 0);
            if (status === 1) {
                this.$set(this.authFormData, "parentId", "top");
            } else {
                this.$set(this.authFormData, "parentId", data.id);
            }
        },
        // 编辑节点
        editNode(node, data) {
            this.optateStatus = 2;
            this.disabled = false;
            this.$refs["authForm"].clearValidate();
            this.authFormData = { ...data };
        },
        // 删除节点
        deleteNode(node, data) {
            if (data.children && data.children.length !== 0) {
                this.$message.warning("该节点包含子节点，请先删除子节点。");
                return;
            }
            this.$confirm("确认删除此权限吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    let { msg } = await deleteAuth({
                        id: data.id,
                    });
                    this.disabled = true;
                    this.getAuthData();
                    this.$message.success(msg);
                    this.authFormData = {};
                    setTimeout(() => {
                        this.$refs["authForm"].clearValidate();
                    }, 0);
                })
                .catch(() => {});
        },
        // 拖拽节点成功
        async dragNode(currentNode, targetNode, position) {
            let params = {
                currentId: currentNode.id,
                targetId: targetNode.id,
                currentParentId: currentNode.parentId,
                targetParentId: targetNode.parentId,
                currentSort: currentNode.sort,
                targetSort: targetNode.sort,
                position: position,
                form: "auth_form",
            };
            let { msg } = await dragMenu(params);
            this.$message.success(msg);
            this.authFormData = {};
            setTimeout(() => {
                this.$refs["authForm"].clearValidate();
            }, 0);
            this.disabled = true;
            await this.getAuthData();
            this.defaultExpandedKeys = [currentNode.parentId];
        },
        // 确定保存
        submit(name) {
            this.$refs[name].validate(async (valid) => {
                if (valid) {
                    if (this.optateStatus === 1) {
                        let { msg } = await createAuth({ ...this.authFormData });
                        this.$message.success(msg);
                    } else if (this.optateStatus === 2) {
                        let { msg } = await editAuth({
                            id: this.authFormData.id,
                            name: this.authFormData.name,
                            auth: this.authFormData.auth,
                            sort: this.authFormData.sort,
                        });
                        this.$message.success(msg);
                    }
                    this.disabled = true;
                    await this.getAuthData(); //新的树形数据加载完再展开刚添加的节点
                    this.authFormData.parentId ? (this.defaultExpandedKeys = [this.authFormData.parentId]) : (this.defaultExpandedKeys = []);
                    this.authFormData = {};
                    setTimeout(() => {
                        this.$refs["authForm"].clearValidate();
                    }, 0);
                }
            });
        },
        // 关闭模态框
        close() {
            this.show = false;
            this.disabled = true;
            this.authFormData = {};
            setTimeout(() => {
                this.$refs["authForm"].clearValidate();
            }, 0);
        },
    },
    mounted() {
        this.getAuthData();
    },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
    border-bottom: 1px solid #ddeedd;
}
::v-deep .el-dialog__body {
    padding-top: 20px;
}
.content-warp {
    height: 600px;
    .left {
        width: 400px;
        margin-right: 20px;
    }
    .right {
        flex: 1;
    }
}
</style>
