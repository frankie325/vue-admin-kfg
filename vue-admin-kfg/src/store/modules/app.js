// todo 存储的主体框架的信息
import Cookies from "js-cookie";

const state = {
    // 侧边栏的是否折叠与是否开启动画
    sidebar: {
        // 判断Cookies中的折叠状态                 +将字符串转化为number类型，!!得到是true还是false
        isCollapse: Cookies.get("sidebarStatus") ? !!+Cookies.get("sidebarStatus") : false,
        withoutAnimation: true,
    },
    device: "desktop",
};

const mutations = {
    // 设置侧边栏是否折叠
    TOGGLE_SIDEBAR: (state) => {
        state.sidebar.isCollapse = !state.sidebar.isCollapse;
        // state.sidebar.withoutAnimation = false;
        if (state.sidebar.isCollapse) {
            Cookies.set("isCollapse", 1); //折叠
        } else {
            Cookies.set("isCollapse", 0); //不折叠
        }
    },
};

const actions = {
    toggleSideBar({ commit }) {
        commit("TOGGLE_SIDEBAR");
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
