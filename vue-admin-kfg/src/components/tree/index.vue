<template>
    <el-card class="tree-container">
        <div class="header flex col-center" slot="header" v-show="showHead">
            <i class="el-icon-menu font-20 m-r-5"></i>
            <b class="font-18">{{ title }}</b>
        </div>
        <div class="content">
            <div class="m-b-15">
                <el-input v-model="searchText" placeholder="请输入搜索内容" size="normal" clearable>
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="flex row-between m-b-10" v-show="showOprateBtn">
                <div style="line-height:1.5">全部菜单</div>
                <el-button style="width:92px;height:24px;padding:0" type="primary" icon="el-icon-plus" @click="addNode(1)"></el-button>
            </div>
            <div class="tree-warp scrollbar-hide">
                <el-tree
                    ref="el-tree"
                    :data="data"
                    :props="defaultProps"
                    node-key="id"
                    :show-checkbox="showCheckbox"
                    :filter-node-method="filterNode"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-checked-keys="defaultCheckedKeys"
                    :check-strictly="checkStrictly"
                    @node-click="clickNode"
                    @check="check"
                    :draggable="draggable"
                    @node-drop="nodeDrop"
                >
                    <div class="node-warp flex row-between" slot-scope="{ node, data }">
                        <div class="node-name line-e">
                            {{ node.label }}
                        </div>
                        <div class="oprate-btn m-l-6" v-show="showOprateBtn">
                            <el-button
                                @click.stop="addNode(2, node, data)"
                                style="width:24px;height:24px;padding:0"
                                plain
                                icon="el-icon-plus"
                            ></el-button>
                            <el-button
                                @click.stop="editNode(node, data)"
                                style="width:24px;height:24px;padding:0"
                                plain
                                icon="el-icon-edit"
                            ></el-button>
                            <el-button
                                @click.stop="deleteNode(node, data)"
                                style="width:24px;height:24px;padding:0"
                                plain
                                icon="el-icon-delete"
                            ></el-button>
                        </div>
                    </div>
                </el-tree>
            </div>
        </div>
    </el-card>
</template>

<script>
export default {
    name: "",
    props: {
        title: {
            type: String,
        },
        data: {
            type: Array,
            required: true,
        },
        defaultProps: {
            type: Object,
            default: () => {
                return {
                    label: "name",
                    children: "children",
                };
            },
        },
        defaultExpandedKeys: {
            type: Array,
            default: () => {
                return [];
            },
        },
        defaultCheckedKeys: {
            type: Array,
            default: () => {
                return [];
            },
        },
        checkStrictly: {
            type: Boolean,
            default: false,
        },
        showCheckbox: {
            type: Boolean,
            default: false,
        },
        showOprateBtn: {
            type: Boolean,
            default: true,
        },
        showHead: {
            type: Boolean,
            default: true,
        },
        draggable: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        searchText(val) {
            this.$refs["el-tree"].filter(val);
        },
    },
    data() {
        return {
            searchText: "",
        };
    },
    methods: {
        /**
         * @description: 过滤节点，显示搜索的节点
         * @param {value} :filter传来的值
         * @param {data} :节点信息
         * @return {*}:需要的节点返回true
         */
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        // 节点被点击时的回调
        clickNode(data, node, selfDom) {
            console.log(data, node, selfDom);
            this.$emit("node-click", data, node, selfDom);
        },
        // 添加节点
        addNode(status, node = {}, data = {}) {
            // status为1时，为添加最顶层节点
            console.log(status, node, data);
            this.$emit("addNode", status, node, data);
        },
        // 编辑节点
        editNode(node, data) {
            console.log(node, data);
            this.$emit("editNode", node, data);
        },
        // 删除节点
        deleteNode(node, data) {
            console.log(node, data);
            this.$emit("deleteNode", node, data);
        },
        // 选中节点的复选框
        check(node, data) {
            console.log(node, data);
            this.$emit("check", node, data);
        },
        //拖拽节点成功
        nodeDrop(node, toNode, position, event) {
            console.log(node, toNode, position, event);
            let currentNode = node.data;
            let targetNode = toNode.data;
            this.$emit("dragNode", currentNode, targetNode, position);
        },
        // 设置复选框模式中选中的节点
        setCheckedKeys(keys) {
            this.$refs["el-tree"].setCheckedKeys(keys);
        },
    },
};
</script>

<style lang="scss" scoped>
.tree-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
    ::v-deep .el-card__header {
        padding: 0;
        border-bottom: none;
    }
    ::v-deep .el-card__body {
        height: calc(100% - 99px);
    }
    .header {
        padding: 18px 20px;
        border-bottom: 1px solid #ebeef5;
    }
    .content {
        height: 100%;
        .tree-warp {
            height: calc(100% - 89px);
            overflow: auto;
            ::v-deep .el-tree-node__content {
                height: 32px;
                > .el-checkbox {
                    margin-top: -1px;
                }
            }
            .node-warp {
                flex: 1;
                .node-name {
                    width: 0;
                    // width: 200px;
                    flex: 1;
                }
                .oprate-btn {
                    // float: right;
                    // flex-shrink: 0;
                }
            }
        }
    }
}
</style>
