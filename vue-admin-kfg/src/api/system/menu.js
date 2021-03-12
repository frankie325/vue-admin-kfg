import request from "@/utils/request";

// 获取所有菜单集合
export function getAllMenu(params) {
    return request({
        url: "/admin/system/getAllMenu",
        method: "get",
        params,
    });
}

// 获取所有菜单和权限的连接
export function getMenuAuth(params) {
    return request({
        url: "/admin/system/getMenuAuth",
        method: "get",
        params,
    });
}

// 新增菜单
export function createMenu(data) {
    return request({
        url: "/admin/system/createMenu",
        method: "post",
        data,
    });
}

// 编辑菜单
export function editMenu(data) {
    return request({
        url: "/admin/system/editMenu",
        method: "post",
        data,
    });
}

// 删除菜单
export function deleteMenu(data) {
    return request({
        url: "/admin/system/deleteMenu",
        method: "delete",
        data,
    });
}

