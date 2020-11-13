<template>
    <div class="user-container">
        <div class="header flex flow-r-nw">
            <div class="flex-1">
                <el-input v-model.trim="keyWord" style="width:400px" placeholder="请输入用户名" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </div>
            <div style="width:200px" class="text-r">
                <el-button type="primary" icon="el-icon-plus" @click="showDrawer = true">新增</el-button>
                <el-button type="danger" icon="el-icon-delete-solid" @click="deleteData">删除</el-button>
            </div>
        </div>
        <div class="table-wrap m-t-20" ref="table-wrap" v-resize="handleResize">
            <el-table border :height="tableHeight" :data="userList" style="width: 100%" @selection-change="select">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column prop="id" label="id" width="250"> </el-table-column>
                <el-table-column prop="username" label="用户名" width="180"> </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-drawer size="40%" title="新增用户" :visible.sync="showDrawer" direction="rtl">
                <div class="form-wrap p-r-20 p-b-20 flex flow-r-c">
                    <el-form ref="userForm" class="flex-1" :model="userFormData" :rules="rules" label-width="100px">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="userFormData.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="userFormData.password"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="text-r">
                        <el-button type="primary" @click="submit('userForm')">提交</el-button>
                    </div>
                </div>
            </el-drawer>
        </div>
        <div class="footer flex row-end col-center">
            <Pagination :pageSize.sync="pageSize" :pageNum.sync="pageNum" :total="total" @pageRefresh="pageRefresh"></Pagination>
        </div>
    </div>
</template>

<script>
import { addUser, getAllUser, deleteUser } from "@/api/user";
import Pagination from "@/components/pagination/index";
export default {
    name: "",
    components: {
        Pagination,
    },
    data() {
        return {
            userList: [],
            tableHeight: 500,
            showDrawer: false,
            userFormData: {
                username: "",
                password: "",
            },
            rules: {
                username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }],
            },
            pageSize: 10,
            pageNum: 1,
            total: 200,
            keyWord: "",
            deleteList: [],
        };
    },
    methods: {
        handleResize(size) {
            this.tableHeight = size.height;
        },
        // 获取页面信息
        async getPageInfo() {
            let { data } = await getAllUser({
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                keyWord: this.keyWord,
            });
            this.userList = data.list;
            this.total = data.totalPages;
        },
        // 提交新增用户
        submit(name) {
            this.$refs[name].validate(async (valid) => {
                if (valid) {
                    let data = await addUser(this.userFormData);
                    this.$message({
                        message: data.msg,
                        type: "success",
                    });
                    this.showDrawer = false;
                }
            });
        },
        // 页码或者每页条数变化
        pageRefresh() {
            this.getPageInfo();
        },
        // 点击搜索按钮
        search() {
            this.pageNum = 1;
            this.getPageInfo();
        },
        // 选择删除的行
        select(selection) {
            this.deleteList = selection.map((value) => {
                return value.id;
            });
        },
        // 删除用户
        async deleteData() {
            await deleteUser();
        },
    },
    mounted() {
        this.getPageInfo();
    },
};
</script>

<style lang="scss" scoped>
.user-container {
    height: 100%;
    padding: 20px 20px 0;
    box-sizing: border-box;
    .table-wrap {
        height: calc(100% - 120px);
        overflow: hidden;
        .form-wrap {
            height: 100%;
        }
    }
    .footer {
        height: 60px;
    }
}
</style>
