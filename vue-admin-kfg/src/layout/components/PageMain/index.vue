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
    padding: 20px;
    box-sizing: border-box;
    height: calc(100% - 50px);
    background-color: map-get($map: $color-background, $key: base);
}
</style>
