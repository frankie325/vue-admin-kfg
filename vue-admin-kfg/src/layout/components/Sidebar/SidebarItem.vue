<template>
    <div v-if="!item.hidden">
        <!-- 如果只展示一个或者零个子路由，sidebar不会有嵌套模式 -->
        <!--              只有一个或者零个子路由为true                   如果只有一个子路由，该子路由还有子路由则为false                    -->
        <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
            <!--                                                        如果为零个子路由，结果为true    -->
            <el-menu-item :index="resolvePath(onlyOneChild.path)">
                <i class="el-icon-menu"></i>
                <span slot="title">{{ onlyOneChild.meta.title }}</span>
            </el-menu-item>
        </template>
        <el-submenu v-else :index="resolvePath(item.path)">
            <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{ item.meta.title }}</span>
            </template>
            <SidebarItem v-for="child in item.children" :key="child.path" :item="child" :basePath="resolvePath(child.path)"></SidebarItem>
        </el-submenu>
    </div>
</template>

<script>
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
            // 过滤掉不显示的子路由项
            let showingChild = children.filter((child) => {
                if (child.hidden) {
                    return false;
                } else {
                    //当只有一个子路由项时，onlyOneChild才会使用，才有意义
                    this.onlyOneChild = child;
                    return true;
                }
            });

            // 当子路由只有一个时，子路由展示
            if (showingChild.length === 1) {
                return true;
            }
            // 当子路由没有时，展示父级菜单标题，因为没有子路由，会跳转到404页面
            if (showingChild.length === 0) {
                this.onlyOneChild = { ...parent, path: "", noShowingChildren: true }; // path会进行覆盖
                return true;
            }
            // 当子路由超过一个时，直接返回false
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
</style>
