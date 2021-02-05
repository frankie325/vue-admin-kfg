import request from "@/utils/request";

// 获取所有部门角色
export function getAllRole(params) {
    return request({
        url: "/admin/system/getAllRole",
        method: "get",
        params,
    });
}

// 新增部门角色
export function createRole(data) {
    return request({
        url: "/admin/system/createRole",
        method: "post",
        data,
    });
}

// 编辑部门角色
export function editRole(data) {
    return request({
        url: "/admin/system/editRole",
        method: "post",
        data,
    });
}

// 删除部门角色
export function deleteRole(data) {
    return request({
        url: "/admin/system/deleteRole",
        method: "delete",
        data,
    });
}

// 获取部门角色下的用户
export function getRoleUser(data) {
    return request({
        url: "/admin/system/getRoleUser",
        method: "post",
        data,
    });
}