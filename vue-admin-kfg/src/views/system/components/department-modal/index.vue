<template>
    <el-dialog :title="modalStatus === 1 ? '新增部门' : '修改部门'" :visible.sync="show" width="600px" @opened="opened" @closed="closed">
        <el-form ref="departmentForm" :model="modalData" :rules="rules">
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

        <span slot="footer">
            <el-button type="primary" @click="submit('departmentForm')">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { createDepartment, editDepartment } from "@/api/system/department-role.js";
export default {
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
            modalData: {},
            rules: {
                name: [{ required: true, message: "权限名称不能为空", trigger: "blur" }],
                sort: [{ type: "number", required: true, message: "排序号不能为空", trigger: "change" }],
            },
        };
    },
    methods: {
        handleClick() {},
        // 选中的节点
        selectedNode(node, data) {
            this.modalData.menusIds = data.checkedKeys;
        },
        // 确定保存
        submit(name) {
            this.$refs[name].validate(async (valid) => {
                if (valid) {
                    if (this.modalStatus === 1) {
                        let { msg } = await createDepartment({ ...this.modalData });
                        this.$message.success(msg);
                    } else if (this.modalStatus === 2) {
                        let { msg } = await editDepartment({ ...this.modalData });
                        this.$message.success(msg);
                    }
                    this.$emit("oprateSuccess", this.modalData.parentId);
                    this.closed();
                }
            });
        },
        // 打开模态框
        opened() {},
        // 关闭模态框
        closed() {
            this.show = false;
            this.$refs["departmentForm"].resetFields();
            this.modalData = {};
            this.$emit("update:modalStatus", 0);
        },
    },
};
</script>
