import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Layout from "@/layout/index";
Vue.use(VueRouter);

// 解决重定向报错
// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location, onResolve, onReject) {
//     if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
//     return originalPush.call(this, location).catch((err) => err);
// };

//主框架内显示的
export const frameIn = [
    {
        path: "/",
        component: Layout,
        redirect: "/home",
        isShow: true,
        meta: {
            // collapse: true,
            title: "主控台",
        },
        children: [
            {
                path: "home",
                name: "home",
                meta: {
                    title: "首页",
                },
                isShow: true,
                component: () => import("@/views/home/index"),
            },
        ],
    },
];
//主框架外显示的
export const frameOut = [
    {
        path: "/login",
        component: () => import("@/views/login/index"),
    },
];

//主框架外显示的
export const errorPage = [
    {
        path: "/404",
        component: () => import("@/views/error-page/index"),
    },
    { path: "*", redirect: "/404" },
];

//需要根据权限加载的动态路由表
export const asyncRouterMap = [
    {
        path: "/system",
        component: Layout,
        meta: {
            auths: ["admin"],
            title: "系统设置",
        }, //页面需要的权限,如果子路由没有设置权限，会继承父级权限
        isShow: true, //是否在侧边栏显示
        children: [
            {
                path: "user-config",
                component: () => import("@/views/system/user-setting/index"),
                name: "user-config", // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
                meta: {
                    // auths: ["editor"],
                    title: "用户设置", // 设置该路由在侧边栏和面包屑中展示的名字
                },
                isShow: true,
                children: [],
            },
            {
                path: "index1",
                component: () => import("@/views/system/system-menu/index"),
                name: "index1",
                meta: {
                    auths: ["editor"],
                    title: "系统菜单",
                },
                isShow: true,
            },
            {
                path: "index2",
                component: () => import("@/views/system/auth-setting/index"),
                name: "index2",
                meta: {
                    auths: ["editor"],
                    title: "权限设置",
                },
                isShow: true,
            },
        ],
    },
    // { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
    new VueRouter({
        // mode: 'history',
        scrollBehavior: () => ({ y: 0 }),
        routes: [...frameIn, ...frameOut],
    });

const router = createRouter();

// 重置路由
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher;
}

const whiteList = ["/login"]; //免登录白名单

router.beforeEach(async (to, from, next) => {
    console.log(to);
    console.log(process.env.NODE_ENV);
    console.log(process.env.BASE_URL);
    console.log(process.env.VUE_APP_VERSION);

    // console.log(router);
    if (store.getters.token) {
        //如果存在token
        if (to.path === "/login") {
            // 如果跳登录页，因为token存在，所以不用再登录
            next("/");
        } else {
            console.log(store.getters);
            // 刷新页面会让auths为空，因为没存到本地而是vuex
            if (store.getters.auths.length !== 0) {
                // 如果auths不为空，则存在用户信息
                console.log("存在用户信息");
                next();
            } else {
                // 不存在则获取用户信息
                try {
                    //如果此时用户信息(token)不是最新的，后台会拦截，返回50001,再跳到登录页
                    let { auths } = await store.dispatch("user/getInfo");
                    // 获取用户的权限列表后
                    let accessedRoutes = await store.dispatch("permission/generateRoutes", auths);
                    // console.log(accessedRoutes);
                    //添加通过权限验证的路由表
                    // router.options.routes = store.getters.permissionRoutes;
                    router.addRoutes(accessedRoutes);
                    router.addRoutes(errorPage);
                    // addRoutes从路由中提取路由表信息，由于此时还没addRoutes，所以解析出来的路由表是个空的
                    // 如果此时直接next(),是找不到对应路由的，调用next({ ...to, replace: true });（to.path）
                    // 其实还是重新跳转to.path的地址(这里会有重定向的报错，添加上面的代码即可解决)，
                    // 再走一边上面的流程，此时路由表已经添加完成，也已经存在用户信息，直接走上面的next();
                    // next();

                    next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
                } catch (error) {
                    console.log(error);
                }
            }

            // next();
        }
    } else {
        // 不存在token则跳转至登录页

        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next();
        } else {
            next("/login"); // 否则全部重定向到登录页
        }
    }
});

export default router;
