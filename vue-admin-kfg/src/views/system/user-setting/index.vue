<template>
    <div class="user-container">
        <div class="header flex flow-r-nw m-b-20">
            <div class="flex-1">
                <el-input v-model.trim="keyWord" style="width:400px" placeholder="请输入用户名" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                </el-input>
            </div>
            <div style="width:200px" class="text-r">
                <el-button type="primary" icon="el-icon-plus" @click="addUser">新增</el-button>
                <el-button type="danger" icon="el-icon-delete-solid" @click="deleteData">删除</el-button>
            </div>
        </div>
        <UserTable ref="user-table" :userList="userList" @oprateSuccess="oprateUserSuccess" @select="select"></UserTable>
        <div class="footer flex row-end col-center">
            <Pagination :pageSize.sync="pageSize" :pageNum.sync="pageNum" :total="total" @pageRefresh="pageRefresh"></Pagination>
        </div>
    </div>
</template>

<script>
import { getAllUser, deleteUser } from "@/api/system/user.js";
import Pagination from "@/components/pagination";
import TreeSelect from "@/components/tree-select";
import UserTable from "../components/user-table";
export default {
    name: "",
    components: {
        Pagination,
        TreeSelect,
        UserTable,
    },
    data() {
        return {
            userList: [],
            pageSize: 10,
            pageNum: 1,
            total: null,
            keyWord: "",
            deleteList: [],
        };
    },

    methods: {
        handleResize(size) {
            this.tableHeight = size.height;
        },
        // 点击新增
        addUser() {
            this.$refs["user-table"].showDrawer = true;
            this.$refs["user-table"].status = 1;
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
        select(deleteList) {
            this.deleteList = deleteList;
        },
        // 删除用户
        deleteData() {
            if (this.deleteList.length === 0) {
                return;
            }
            this.$confirm("删除后不可恢复, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    let { msg } = await deleteUser({ deleteList: this.deleteList });
                    if (this.deleteList.length === this.userList.length) {
                        if (this.pageNum > 1) {
                            this.pageNum--;
                        }
                    }
                    this.deleteList = [];
                    this.$message({
                        message: msg,
                        type: "success",
                    });
                    this.getPageInfo();
                })
                .catch(() => {});
        },
        oprateUserSuccess() {
            this.getPageInfo();
        },
    },
    async mounted() {
        this.getPageInfo();
    },
};
</script>

<style lang="scss" scoped>
.user-container {
    height: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
    padding: 20px 20px 0;
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
