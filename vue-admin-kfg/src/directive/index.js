// 监听dom元素宽高变化

import resize from "./resize";

export default {
    install(Vue) {
        Vue.directive("resize", resize);
    },
};
