<template>
    <!-- 封装的分页组件 -->
    <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        :page-sizes="pageSizes"
        :layout="layout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    >
    </el-pagination>
</template>

<script>
export default {
    data() {
        return {};
    },
    props: {
        total: {
            type: Number,
            default: 0,
        },
        pageNum: {
            type: Number,
            default: 1,
        },
        pageSize: {
            type: Number,
            default: 10,
        },
        pageSizes: {
            type: Array,
            default: () => {
                return [10, 20, 30, 40];
            },
        },
        layout: {
            type: String,
            default: "sizes,total,prev,pager,next,jumper",
        },
    },
    computed: {
        // pageNum: {
        //     get() {
        //         return this.current;
        //     },
        //     set(nv) {
        //         this.$emit("update:current", nv);
        //     },
        // },
    },
    methods: {
        handleSizeChange(val) {
            this.$emit("update:pageSize", val);
            this.$emit("pageRefresh");
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.$emit("update:pageNum", val);
            this.$emit("pageRefresh");
            console.log(`当前页: ${val}`);
        },
    },
};
</script>

<style lang="" scoped></style>
