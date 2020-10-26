import { constantRouterMap, asyncRouterMap } from "@/router";

function hasPermission(roles, route) {
    // 假如route.meta.roles=['admin','editor'],说明是超级用户或编辑者都可以访问

    //判断单个路由项中是否包含meta且包含权限字段
    if (route.meta && route.meta.roles) {
        //判断此路由项中只要有一个权限字段包含在用户的权限中，则此路由项可以访问，否则返回false
        return roles.some((role) => route.meta.roles.includes(role));
    } else {
        //没有则说明此路由项任何用户都可以访问
        return true;
    }
}

export function filterAsyncRoutes(routes, roles) {
    let res = [];
    // 遍历所有路由表
    routes.forEach((route) => {
        let tmp = { ...route }; //父级路由如果没有权限，其下的所有子路由都没有权限
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                // 如果包含子路由，则继续递归
                tmp.children = filterAsyncRoutes(tmp.children, roles);
            }
            //权限验证通过,此路由项推入res
            res.push(tmp);
        }
    });
    return res;
}

const state = {
    routes: [],
    addRoutes: [],
};

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes; //添加的动态路由表
        state.routes = constantRouterMap.concat(routes); //添加后所有的路由表
    },
};

const actions = {
    // 根据用户权限生成路由表
    generateRoutes({ commit }, roles) {
        return new Promise((resolve) => {
            let accessedRoutes;
            // 如果是超级用户，则拥有所有路由表
            if (roles.includes("admin")) {
                accessedRoutes = asyncRouterMap || [];
            } else {
                // 否则根据用户权限筛选路由表
                accessedRoutes = filterAsyncRoutes(asyncRouterMap, roles);
            }
            commit("SET_ROUTES", accessedRoutes);
            resolve(accessedRoutes);
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
