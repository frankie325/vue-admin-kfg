import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";

// 自动化导入模块
const files = require.context("./modules", false, /\.js$/);
const modules = {};
files.keys().forEach((key) => {
    modules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default;
});

Vue.use(Vuex);

export default new Vuex.Store({
    modules,
    getters,
});
