<template>
    <div class="table-wrap" ref="table-wrap" v-resize="handleResize">
        <el-table border :height="tableHeight" :data="userList" style="width: 100%" @selection-change="select">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="id" width="320"> </el-table-column>
            <el-table-column prop="username" label="用户名" width="180"> </el-table-column>
            <el-table-column label="操作" fixed="right">
                <template slot-scope="{ row }">
                    <el-button type="primary" size="small" icon="el-icon-edit" @click="editUserInfo(row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-drawer size="40%" :title="status === 1 ? '新增用户' : '编辑用户'" :visible.sync="showDrawer" direction="rtl" @closed="closed">
            <div class="form-wrap p-r-20 p-b-20 flex flow-r-c">
                <el-form ref="userForm" class="flex-1" :model="userFormData" :rules="rules" label-width="100px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="userFormData.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password" v-if="status === 1">
                        <el-input type="password" v-model="userFormData.password"></el-input>
                    </el-form-item>
                    <el-form-item label="所属角色" prop="roleIds">
                        <TreeSelect :data.sync="roleData"></TreeSelect>
                    </el-form-item>
                </el-form>
                <div class="text-r">
                    <el-button type="primary" @click="submit('userForm')">提交</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { addUser, editUser, getUserRole } from "@/api/system/user.js";
import TreeSelect from "@/components/tree-select";
export default {
    components: {
        TreeSelect,
    },
    props: {
        userList: {
            type: Array,
            required: true,
        },
    },
    watch: {
        roleData: function() {
            this.userFormData.roleIds = this.roleData.map((val) => {
                return val.id;
            });
        },
        immediate: true,
    },
    data() {
        return {
            tableHeight: 500,
            showDrawer: false,
            userFormData: {},
            rules: {
                username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }],
                roleIds: [{ type: "array", required: true, message: "请选择角色", trigger: "blur" }],
            },
            status: 1, //1为新增，2为编辑
            roleData: [],
        };
    },
    methods: {
        handleResize(size) {
            this.tableHeight = size.height;
        },
        // 选择删除的行
        select(selection) {
            let deleteList = selection.map((value) => {
                return value.id;
            });
            this.$emit("select", deleteList);
        },
        // 编辑用户信息
        async editUserInfo(row) {
            let { data } = await getUserRole({
                id: row.id,
            });
            this.status = 2;
            this.userFormData = {
                id: row.id,
                username: row.username,
            };
            this.roleData = data;
            this.showDrawer = true;
        },
        // 关闭抽屉
        closed() {
            this.$refs["userForm"].resetFields();
            this.userFormData = {};
            this.roleData = [];
        },
        // 提交新增用户
        submit(name) {
            this.$refs[name].validate(async (valid) => {
                if (valid) {
                    if (this.status === 1) {
                        let { msg } = await addUser(this.userFormData);
                        this.$message({
                            message: msg,
                            type: "success",
                        });
                        this.$emit("oprateSuccess");
                        this.showDrawer = false;
                        this.userFormData = {};
                    } else {
                        let { msg } = await editUser(this.userFormData);
                        this.$message({
                            message: msg,
                            type: "success",
                        });
                        if (this.userFormData.id === this.$store.getters.userInfo.id) {
                            this.$store.dispatch("user/removeToken").then(() => {
                                this.$router.replace("/");
                            });
                        }
                    }
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.table-wrap {
    height: calc(100% - 120px);
    overflow: hidden;
    .form-wrap {
        height: 100%;
    }
}
</style>
