import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// import './element-variables.scss'
Vue.use(ElementUI);

// 注册自定义指令
import directive from "@/directive";
Vue.use(directive);

// css动画效果库
import animate from "animate.css";
Vue.use(animate);
// import "@/styles/common.scss"; //自定义的全局样式

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
