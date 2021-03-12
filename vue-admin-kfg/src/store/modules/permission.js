import { frameIn, frameOut, resetRouter } from "@/router";
import router from "@/router";
import { getMenuAuth } from "@/api/system/menu";
function hasPermission(auths, route) {
    // 假如route.meta.auths=['admin','editor'],说明是超级用户或编辑者都可以访问

    //判断单个路由项中是否包含meta且包含权限字段
    if (route.meta && route.meta.auths) {
        //判断此路由项中只要有一个权限字段包含在用户的权限中，则此路由项可以访问，否则返回false
        return auths.some((auth) => route.meta.auths.includes(auth));
    } else {
        //没有则说明此路由项任何用户都可以访问
        return true;
    }
}

export function filterAsyncRoutes(routes, auths) {
    let res = [];
    // 遍历所有路由表
    routes.forEach((route) => {
        let tmp = { ...route }; //父级路由如果没有权限，其下的所有子路由都没有权限
        if (hasPermission(auths, tmp)) {
            if (tmp.children) {
                // 如果包含子路由，则继续递归
                tmp.children = filterAsyncRoutes(tmp.children, auths);
            }
            //权限验证通过,此路由项推入res
            res.push(tmp);
        }
    });
    return res;
}

const state = {
    routes: [], //存储所有的路由信息
    addRoutes: [], //存储动态添加的路由信息
};

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes; //添加的动态路由表
        state.routes = [...frameIn, ...frameOut].concat(routes); //添加后所有的路由表
    },
};

//生成路由表
async function getRouterMap() {
    let { data } = await getMenuAuth();
    return menuToRouter(data);
}

function menuToRouter(data) {
    return data.map((item) => {
        let route = {
            name: item.path,
            path: item.parentId === "top" ? `/${item.path}` : item.path,
            component: () => import(`@/${item.componentPath}`),
            meta: {
                auths: [item.auth],
                title: item.name,
            },
            isShow: item.isShow === 1 ? true : false,
        };
        if (item.children && item.children.length !== 0) {
            // 重定向,导航面包屑,当点击根路由时会自动跳到子路由的第一项
            route.redirect = { name: item.children[0].path };
            route.children = menuToRouter(item.children);
        }
        return route;
    });
}

const actions = {
    // 根据用户权限生成路由表
    generateRoutes({ commit }, auths) {
        return new Promise(async (resolve) => {
            let accessedRoutes;
            // let asyncRouterMap = getAllRouterMap();
            let asyncRouterMap = await getRouterMap();
            // console.log(asyncRouterMap);
            // 如果是超级用户，则拥有所有路由表
            if (auths.includes("admin")) {
                accessedRoutes = asyncRouterMap || [];
            } else {
                // 否则根据用户权限筛选路由表
                accessedRoutes = filterAsyncRoutes(asyncRouterMap, auths);
            }
            commit("SET_ROUTES", accessedRoutes);
            resolve(accessedRoutes);
        });
    },
    // 当菜单显示重新更新路由表
    async changeMenus({ dispatch, rootGetters }) {
        resetRouter();
        let accessedRoutes = await dispatch("generateRoutes", rootGetters.auths);
        router.addRoutes(accessedRoutes);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
