<template>
    <div class="auth-setting">
        <div class="left">
            <RoleTree
                title="部门角色"
                :draggable="true"
                :defaultProps="treeProps"
                :data="treeData"
                :default-expanded-keys="defaultExpandedKeys"
                @node-click="clickNode"
                @addNode="addNode"
                @editNode="editNode"
                @deleteNode="deleteNode"
                @dragNode="dragNode"
            ></RoleTree>
        </div>
        <el-card class="right">
            <div slot="header" style="position:relative" class="flex col-center row-between">
                <div class="fw-b">人员管理</div>
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    style="position:absolute;right:0;width:80px;padding:10px 0"
                    size="medium"
                    @click="deleteUserData"
                    >删除</el-button
                >
            </div>
            <UserTable :userList="userList" @oprateSuccess="oprateUserSuccess" @select="select"></UserTable>
            <div class="page flex row-end col-center m-t-20">
                <Pagination :pageSize.sync="pageSize" :pageNum.sync="pageNum" :total="total" @pageRefresh="pageRefresh"></Pagination>
            </div>
        </el-card>
        <DepartmentModal
            ref="departmentModal"
            :modalStatus.sync="departmentModalStatus"
            v-model="showDepartmentModal"
            @oprateSuccess="oprateSuccess"
        ></DepartmentModal>
        <RoleModal ref="roleModal" :modalStatus.sync="modalStatus" v-model="showRoleModal" @oprateSuccess="oprateSuccess"></RoleModal>
    </div>
</template>

<script>
import RoleTree from "@/components/tree/role-tree";
import Pagination from "@/components/pagination";
import RoleModal from "../components/role-modal";
import DepartmentModal from "../components/department-modal";
import UserTable from "../components/user-table";
import { getDepartmentRole, deleteDepartment, deleteRole, getRoleUser, getRoleAuth, dragRoleNode } from "@/api/system/department-role.js";
import { deleteUser } from "@/api/system/user.js";
export default {
    components: {
        RoleTree,
        Pagination,
        RoleModal,
        DepartmentModal,
        UserTable,
    },
    data() {
        return {
            showDepartmentModal: false,
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
            userList: [],
            modalStatus: 0, //1为新增，2为修改
            clickNodeId: "",
            departmentModalStatus: 0, //1为新增，2为修改
            deleteList: [],
        };
    },
    methods: {
        // 获取部门角色数据
        async getTreeData() {
            let { data } = await getDepartmentRole();
            this.treeData = data;
        },
        handleResize(size) {
            this.tableHeight = size.height;
        },
        // 点击节点获取角色下的用户
        async getUserInfo() {
            let { data } = await getRoleUser({
                id: this.clickNodeId,
                pageSize: this.pageSize,
                pageNum: this.pageNum,
            });
            this.userList = data.list;
            this.total = data.totalPages;
        },
        // 点击节点
        async clickNode(nodeData) {
            this.clickNodeId = nodeData.id;
            if (nodeData.depOrRole === 1) {
                return;
            }
            this.pageNum = 1;
            this.getUserInfo();
        },
        // 添加节点
        addNode(status, node, data) {
            this.modalStatus = 1;
            this.departmentModalStatus = 1;
            if (status === 1) {
                this.showDepartmentModal = true;
                this.$set(this.$refs["departmentModal"].modalData, "parentId", "top");
                this.$set(this.$refs["departmentModal"].modalData, "sort", data.children ? data.children.length + 1 : 1);
            } else if (status === 2) {
                this.showDepartmentModal = true;
                this.$set(this.$refs["departmentModal"].modalData, "parentId", data.id);
                this.$set(this.$refs["departmentModal"].modalData, "sort", data.children ? data.children.length + 1 : 1);
            } else {
                this.showRoleModal = true;
                this.$set(this.$refs["roleModal"].modalData, "department_id", data.id);
                this.$set(this.$refs["roleModal"].modalData, "sort", data.children ? data.children.length + 1 : 1);
            }
        },
        // 编辑节点
        async editNode(node, data) {
            this.modalStatus = 2;
            this.departmentModalStatus = 2;
            if (data.depOrRole === 1) {
                this.$refs["departmentModal"].modalData = { ...data };
                this.showDepartmentModal = true;
            } else {
                this.$refs["roleModal"].modalData = { ...data };
                let { data: authIds } = await getRoleAuth({
                    id: data.id,
                });
                this.$set(this.$refs["roleModal"].modalData, "authIds", authIds);
                this.showRoleModal = true;
            }
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
                    if (data.depOrRole === 1) {
                        let { msg } = await deleteDepartment({
                            id: data.id,
                        });
                        this.$message.success(msg);
                    } else {
                        let { msg } = await deleteRole({
                            id: data.id,
                        });
                        this.$message.success(msg);
                    }
                    this.getTreeData();
                })
                .catch(() => {});
        },
        // 选择删除的行
        select(deleteList) {
            this.deleteList = deleteList;
        },
        // 删除用户
        deleteUserData() {
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
                    this.getUserInfo();
                })
                .catch(() => {});
        },
        // 执行操作成功
        async oprateSuccess(expandId) {
            await this.getTreeData();
            expandId ? (this.defaultExpandedKeys = [expandId]) : (this.defaultExpandedKeys = []);
        },
        // 操作用户成功
        oprateUserSuccess() {
            this.getUserInfo();
        },
        // 拖拽节点成功
        async dragNode(currentNode, targetNode, position) {
            let params = {
                currentId: currentNode.id,
                targetId: targetNode.id,
                currentParentId: currentNode.depOrRole === 1 ? currentNode.parentId : currentNode.department_id,
                targetParentId: targetNode.depOrRole === 1 ? targetNode.parentId : targetNode.department_id,
                currentSort: currentNode.sort,
                targetSort: targetNode.sort,
                position: position,
                currentDepOrRole: currentNode.depOrRole,
            };
            let { msg } = await dragRoleNode(params);
            this.$message.success(msg);
            await this.getTreeData();
            currentNode.depOrRole === 1
                ? (this.defaultExpandedKeys = [currentNode.parentId])
                : (this.defaultExpandedKeys = [currentNode.department_id]);
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
