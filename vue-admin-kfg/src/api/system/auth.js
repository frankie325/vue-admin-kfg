import request from "@/utils/request";

// 获取所有权限集合
export function getAllAuth(params) {
    return request({
        url: "/admin/system/getAllAuth",
        method: "get",
        params,
    });
}

// 新增权限
export function createAuth(data) {
    return request({
        url: "/admin/system/createAuth",
        method: "post",
        data,
    });
}

// 编辑权限
export function editAuth(data) {
    return request({
        url: "/admin/system/editAuth",
        method: "post",
        data,
    });
}

// 删除权限
export function deleteAuth(data) {
    return request({
        url: "/admin/system/deleteAuth",
        method: "delete",
        data,
    });
}
