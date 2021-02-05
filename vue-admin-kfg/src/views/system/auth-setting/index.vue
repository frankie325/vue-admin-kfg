<template>
    <div class="auth-setting">
        <div class="left">
            <Tree
                title="部门角色"
                :defaultProps="treeProps"
                :data="treeData"
                :default-expanded-keys="defaultExpandedKeys"
                @node-click="clickNode"
                @addNode="addNode"
                @editNode="editNode"
                @deleteNode="deleteNode"
            ></Tree>
        </div>
        <el-card class="right">
            <div slot="header" style="position:relative" class="flex col-center row-between">
                <div class="fw-b">人员管理</div>
                <el-button type="danger" icon="el-icon-delete" style="position:absolute;right:0;width:80px;padding:10px 0" size="medium"
                    >删除</el-button
                >
            </div>
            <div class="table-wrap" ref="table-wrap" v-resize="handleResize">
                <el-table :height="tableHeight" :data="tableData" border>
                    <el-table-column type="selection" width="55"> </el-table-column>
                    <el-table-column prop="_id" label="_id" width="250"> </el-table-column>
                    <el-table-column prop="username" label="用户名" width="180"> </el-table-column>
                    <el-table-column label="操作" fixed="right"> </el-table-column>
                </el-table>
            </div>
            <div class="page flex row-end col-center m-t-20">
                <Pagination :pageSize.sync="pageSize" :pageNum.sync="pageNum" :total="total" @pageRefresh="pageRefresh"></Pagination>
            </div>
        </el-card>
        <RoleModal ref="roleModal" :modalStatus.sync="modalStatus" v-model="showRoleModal" @oprateSuccess="oprateSuccess"></RoleModal>
    </div>
</template>

<script>
import Tree from "@/components/tree";
import Pagination from "@/components/pagination";
import RoleModal from "../components/role-modal";
import { getAllRole, deleteRole, getRoleUser } from "@/api/system/role.js";
export default {
    components: {
        Tree,
        Pagination,
        RoleModal,
    },
    data() {
        return {
            showRoleModal: false,
            treeProps: {
                label: "name",
                children: "children",
            },
            defaultExpandedKeys: [],
            tableHeight: null,
            pageSize: 10,
            pageNum: 1,
            total: null,
            treeData: [],
            tableData: [],
            modalStatus: 0, //1为新增，2为修改
            clickNodeId: "",
        };
    },
    methods: {
        // 获取部门角色数据
        async getTreeData() {
            let { data } = await getAllRole();
            this.treeData = data;
        },
        async getUserInfo() {
            let { data } = await getRoleUser({
                _id: this.clickNodeId,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
            });
            this.tableData = data.list;
            this.total = data.totalPages;
        },
        handleResize(size) {
            this.tableHeight = size.height;
        },
        // 点击节点
        async clickNode(nodeData) {
            this.clickNodeId = nodeData._id;
            this.pageNum = 1;
            this.getUserInfo();
        },
        // 添加节点
        addNode(status, node, data) {
            this.modalStatus = 1;
            this.showRoleModal = true;
            if (status === 1) {
                this.$set(this.$refs["roleModal"].roleFormData, "parentId", null);
            } else {
                this.$set(this.$refs["roleModal"].roleFormData, "parentId", data._id);
            }
        },
        // 编辑节点
        editNode(node, data) {
            this.modalStatus = 2;
            this.$refs["roleModal"].roleFormData = { ...data };
            this.showRoleModal = true;
        },
        // 删除节点
        deleteNode(node, data) {
            if (data.children && data.children.length !== 0) {
                this.$message.warning("该节点包含子节点，请先删除子节点。");
                return;
            }
            this.$confirm("确认删除此菜单吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    let { msg } = await deleteRole({
                        _id: data._id,
                    });
                    this.$message.success(msg);
                    this.getTreeData();
                })
                .catch(() => {});
        },
        // 执行操作成功
        oprateSuccess() {
            this.getTreeData();
        },
        pageRefresh() {
            this.getUserInfo();
        },
    },
    mounted() {
        this.getTreeData();
    },
};
</script>

<style lang="scss" scoped>
.auth-setting {
    @include wh(100%, 100%);
    display: flex;
    .left {
        width: 400px;
        height: 100%;
        margin-right: 20px;
    }
    .right {
        flex: 1;
        .table-wrap {
            height: calc(100% - 52px);
        }
    }
    ::v-deep .el-card__body {
        height: calc(100% - 98px);
    }
}
</style>
