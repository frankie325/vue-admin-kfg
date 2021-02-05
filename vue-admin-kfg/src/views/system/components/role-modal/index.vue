<template>
    <el-dialog :title="modalStatus === 1 ? '新增部门角色' : '修改部门角色'" :visible.sync="show" width="600px" @opened="opened" @closed="closed">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="基本信息">
                <el-form ref="roleForm" :model="roleFormData" :rules="rules">
                    <el-form-item label="名称" prop="name">
                        <el-input show-word-limit :maxlength="30" v-model="roleFormData.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="排序号" prop="sort">
                        <el-input-number
                            :min="1"
                            :step="1"
                            size="medium"
                            step-strictly
                            controls-position="right"
                            placeholder="请输入排序号"
                            v-model="roleFormData.sort"
                        ></el-input-number>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="功能权限" name="功能权限">
                <Tree
                    ref="tree"
                    :defaultProps="treeProps"
                    :data="treeData"
                    :default-expanded-keys="roleFormData.menusIds"
                    :defaultCheckedKeys="roleFormData.menusIds"
                    showCheckbox
                    :showOprateBtn="false"
                    :showHead="false"
                    @check="selectedNode"
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
import { getAllMenu } from "@/api/system/menu.js";
import { createRole, editRole } from "@/api/system/role.js";
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
            defaultExpandedKeys: [],
            treeData: [],
            roleFormData: {
                menusIds: [],
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
        async getMenuData() {
            let { data } = await getAllMenu();
            this.treeData = data;
        },
        // 选中的节点
        selectedNode(node, data) {
            this.roleFormData.menusIds = data.checkedKeys;
        },
        // 确定保存
        submit(name) {
            console.log(this.$refs["tree"]);
            this.$refs[name].validate(async (valid) => {
                if (valid) {
                    if (this.modalStatus === 1) {
                        let { msg } = await createRole(this.roleFormData);
                        this.$message.success(msg);
                    } else if (this.modalStatus === 2) {
                        console.log(11);
                        let { msg } = await editRole(this.roleFormData);
                        this.$message.success(msg);
                    }
                    this.$emit("oprateSuccess");
                    this.closed();
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
            this.roleFormData = {
                menusIds: [],
            };
            this.activeName = "基本信息";
            this.$emit("update:modalStatus", 0);
        },
        // 设置复选框模式中选中的节点
        setCheckedKeys(keys) {},
    },
    mounted() {
        this.getMenuData();
    },
};
</script>
