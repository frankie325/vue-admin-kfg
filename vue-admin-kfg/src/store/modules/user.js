//todo 用户登录模块信息
import { login, info } from "@/api/system/user";
import { getToken, setToken, removeToken } from "@/utils/auth";

const getDefaultState = () => {
    return {
        token: getToken(),
        userInfo: {},
        // avatar: "",
        auths: [],
    };
};

const state = getDefaultState();

const mutations = {
    // 重置state
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState());
    },
    // 设置state中token的值
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo;
    },
    // SET_AVATAR: (state, avatar) => {
    //     state.avatar = avatar;
    // },
    SET_AUTHS: (state, auths) => {
        state.auths = auths;
    },
};

const actions = {
    // 登录判断
    async login({ commit }, userInfo) {
        let { username, password } = userInfo;
        let { data } = await login({ username: username, password: password });
        console.log(data);
        commit("SET_TOKEN", data.token);
        setToken(data.token);
    },
    // 获取用户信息
    async getInfo({ commit }) {
        let { data } = await info();
        console.log(data);

        commit("SET_USERINFO", data.userInfo);
        commit("SET_AUTHS", data.auths);
        return data;
    },

    // 清空token
    async removeToken({ commit }) {
        removeToken();
        commit("RESET_STATE");
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
