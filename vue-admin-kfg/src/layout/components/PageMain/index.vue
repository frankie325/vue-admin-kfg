<template>
    <div class="main-container">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "PageMain",
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
.main-container {
    width: 100%;
    height: calc(100% - 50px);
}
</style>
