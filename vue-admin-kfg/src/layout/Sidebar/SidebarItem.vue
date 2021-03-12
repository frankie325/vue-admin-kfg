<template>
    <div v-if="item.isShow">
        <template v-if="hasOneShowingChild(item.children, item)">
            <el-menu-item :index="basePath">
                <i class="el-icon-menu"></i>
                <span slot="title">{{ item.meta.title }}</span>
            </el-menu-item>
        </template>
        <el-submenu v-else :index="basePath">
            <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{ item.meta.title }}</span>
            </template>
            <SidebarItem v-for="child in item.children" :key="child.path" :item="child" :basePath="resolvePath(child.path)"></SidebarItem>
        </el-submenu>
    </div>
</template>

<script>
let onlyOneChild = null;
import path from "path";
export default {
    name: "SidebarItem",
    data() {
        return {
            onlyOneChild: null,
        };
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
        basePath: {
            type: String,
            default: "",
        },
    },
    methods: {
        hasOneShowingChild(children = [], parent) {
            // 筛选出展示的子路由项
            let showingChildren = children.filter((val) => {
                if (val.isShow) {
                    return true;
                } else {
                    return false;
                }
            });
            // 如果不存在;
            if (showingChildren.length === 0) {
                // this.onlyOneChild = { ...parent, path: "" };
                return true;
            }

            // if (showingChildren.length === 1) {
            //     // 当一个子路由还有children时
            //     // if (showingChildren[0].children) {
            //     //     return false;
            //     // }
            //     // 动态添加的路由项不具有该功能
            //     // 当只有一个子路由展示时，如果collapse为true,将子路由当做根路由
            //     if (parent.meta.collapse === true) {
            //         // this.onlyOneChild = showingChildren[0];
            //         return true;
            //     }
            // }

            return false;
        },
        // 解析路由地址，将父级路由地址和子路由地址拼接在一起
        resolvePath(routePath) {
            return path.resolve(this.basePath, routePath);
        },
    },
};
</script>

<style lang="scss" scoped>
/*
隐藏文字 ,element-ui 的<el-menu>标签本身希望里面嵌套的是<el-menu-item>,<el-submenu>,<el-menu-item-group>之一，
但是却嵌套了<div>,而导致收折就隐藏不了文字。因为我们的递归组件最外层有一个<div>标签
*/

.el-menu--collapse .el-submenu__title span {
    display: none;
}
::v-deep .el-submenu__title:hover,
.el-menu-item:hover {
    background-color: rgb(67, 74, 80) !important;
}
</style>
