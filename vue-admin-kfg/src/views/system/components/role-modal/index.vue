<template>
    <el-dialog :title="modalStatus === 1 ? '新增角色' : '修改角色'" :visible.sync="show" width="600px" @opened="opened" @closed="closed">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="基本信息">
                <el-form ref="roleForm" :model="modalData" :rules="rules">
                    <el-form-item label="名称" prop="name">
                        <el-input show-word-limit :maxlength="30" v-model="modalData.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="排序号" prop="sort">
                        <el-input-number
                            :min="1"
                            :step="1"
                            size="medium"
                            step-strictly
                            controls-position="right"
                            placeholder="请输入排序号"
                            v-model="modalData.sort"
                        ></el-input-number>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="功能权限" name="功能权限">
                <Tree
                    ref="tree"
                    :defaultProps="treeProps"
                    :data="treeData"
                    :default-expanded-keys="modalData.authIds"
                    :defaultCheckedKeys="modalData.authIds"
                    showCheckbox
                    :showOprateBtn="false"
                    :showHead="false"
                    @check="selectedNode"
                    :checkStrictly="true"
                ></Tree>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer">
            <el-button type="primary" @click="submit('roleForm')">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import Tree from "@/components/tree";
import { getAllAuth } from "@/api/system/auth.js";
import { createRole, editRole } from "@/api/system/department-role.js";
export default {
    components: {
        Tree,
    },
    props: {
        value: {
            type: Boolean,
            required: true,
        },
        modalStatus: {
            type: Number,
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
            treeProps: {
                label: (data) => {
                    return data.name;
                },
                children: "children",
            },
            treeData: [],
            modalData: {
                authIds: [],
            },
            rules: {
                name: [{ required: true, message: "权限名称不能为空", trigger: "blur" }],
                sort: [{ type: "number", required: true, message: "排序号不能为空", trigger: "change" }],
            },
            activeName: "基本信息",
        };
    },
    methods: {
        handleClick() {},
        // 获取菜单树
        async getAuthData() {
            let { data } = await getAllAuth();
            this.treeData = data;
        },
        // 选中的节点
        selectedNode(node, data) {
            this.modalData.authIds = data.checkedKeys;
        },
        // 确定保存
        submit(name) {
            this.$refs[name].validate(async (valid) => {
                if (valid) {
                    if (this.modalStatus === 1) {
                        let { msg } = await createRole({ ...this.modalData });
                        this.$message.success(msg);
                        this.$emit("oprateSuccess", this.modalData.department_id); //传过去要展开的节点
                        this.closed();
                    } else if (this.modalStatus === 2) {
                        // 传递userId判断当前的登录用户是否在该角色下
                        let { data, msg } = await editRole({ ...this.modalData, userId: this.$store.getters.userInfo.id });
                        this.$message.success(msg);
                        // 如果在该角色下则重新登录
                        if (data.include) {
                            this.$store.dispatch("user/removeToken").then(() => {
                                this.$router.replace("/");
                            });
                        } else {
                            this.$emit("oprateSuccess", this.modalData.department_id); //传过去要展开的节点
                            this.closed();
                        }
                    }
                }
            });
        },
        // 打开模态框
        opened() {},
        // 关闭模态框
        closed() {
            this.show = false;
            this.$refs["tree"].setCheckedKeys([]);
            this.$refs["roleForm"].resetFields();
            this.modalData = {
                authIds: [],
            };
            this.activeName = "基本信息";
            this.$emit("update:modalStatus", 0);
        },
        // 设置复选框模式中选中的节点
        // setCheckedKeys(keys) {},
    },
    mounted() {
        this.getAuthData();
    },
};
</script>
