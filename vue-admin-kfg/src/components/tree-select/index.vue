<template>
    <div class="tree-select-wrap">
        <div class="box-warp scrollbar-hide " @click="showModal = true">
            <el-tag class="m-r-10 m-t-5 m-b-5" size="small" closable v-for="(role, index) in data" :key="role.id" @close="closeTag(index)">
                {{ role.name }}
            </el-tag>
        </div>
        <el-dialog title="选择角色" :modal="false" :visible.sync="showModal" width="500px" @open="open">
            <div>
                <el-tag class="m-r-10" size="small" v-for="role in selectedData" :key="role.id">
                    {{ role.name }}
                </el-tag>
            </div>
            <RoleTree
                ref="role-tree"
                :data="treeData"
                :showCheckbox="true"
                :showHead="false"
                :showOprateBtn="false"
                :default-expanded-keys="selectedIds"
                :defaultCheckedKeys="selectedIds"
                @check="selectedNode"
            ></RoleTree>
            <span slot="footer">
                <el-button size="medium" type="primary" @click="confirm">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import RoleTree from "@/components/tree/role-tree";
import { getDepartmentRole } from "@/api/system/department-role.js";
export default {
    components: {
        RoleTree,
    },
    props: {
        data: {
            type: Array,
        },
    },
    watch: {
        data: {
            handler: function(nv) {
                this.selectedData = this.data;
                this.selectedIds = nv.map((val) => {
                    return val.id;
                });
            },
            immediate: true,
        },
    },
    data() {
        return {
            showModal: false,
            treeData: [],
            selectedData: [],
            selectedIds: [],
        };
    },
    methods: {
        open() {
            this.$nextTick(() => {
                this.$refs["role-tree"].setCheckedKeys(this.selectedIds);
            });
        },
        // 选择的节点
        selectedNode(node, data) {
            this.selectedData = data.checkedNodes;
        },
        // 确认选择的数据
        confirm() {
            this.$emit("update:data", this.selectedData);
            this.showModal = false;
            this.$emit("confirmSelected");
        },
        // 取消选择的角色
        closeTag(index) {
            this.selectedData.splice(index, 1);
            this.$emit("update:data", this.selectedData);
        },
        // 递归数据
        recursionData(data) {
            return data.map((val) => {
                return {
                    ...val,
                    disabled: val.depOrRole === 1 ? true : false,
                    children: val.children ? this.recursionData(val.children) : [],
                };
            });
        },
    },
    async mounted() {
        let { data } = await getDepartmentRole();
        this.treeData = this.recursionData(data);
    },
};
</script>

<style lang="scss" scoped>
.tree-select-wrap {
    // line-height: 10px;
    .box-warp {
        cursor: pointer;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        min-height: 40px;
        outline: 0;
        padding: 0 10px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        // justify-content: space-around;
        // overflow-x: auto;
    }
    ::v-deep .el-dialog__body {
        padding-top: 0;
        padding-bottom: 0;
    }
    ::v-deep .el-input__inner {
        border-color: #dcdfe6;
    }
    ::v-deep .el-input__inner:focus {
        border-color: #409eff;
    }
}
.el-form-item.is-error .box-warp {
    border-color: #f56c6c;
}
</style>
