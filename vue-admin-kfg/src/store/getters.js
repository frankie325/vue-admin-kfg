const getters = {
    sidebar: (state) => state.app.sidebar,
    device: (state) => state.app.device,
    token: (state) => state.user.token,
    userInfo: (state) => state.user.userInfo,
    auths: (state) => state.user.auths,
    allRoutes: (state) => state.permission.routes,
    permissionRoutes: (state) => state.permission.addRoutes,
};

export default getters;
