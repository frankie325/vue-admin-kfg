import request from "@/utils/request";

// 获取所有部门角色
export function getDepartmentRole(params) {
    return request({
        url: "/admin/system/getDepartmentRole",
        method: "get",
        params,
    });
}

// 新增部门
export function createDepartment(data) {
    return request({
        url: "/admin/system/createDepartment",
        method: "post",
        data,
    });
}

// 编辑部门
export function editDepartment(data) {
    return request({
        url: "/admin/system/editDepartment",
        method: "post",
        data,
    });
}

// 删除部门
export function deleteDepartment(data) {
    return request({
        url: "/admin/system/deleteDepartment",
        method: "delete",
        data,
    });
}

// 新增角色
export function createRole(data) {
    return request({
        url: "/admin/system/createRole",
        method: "post",
        data,
    });
}

// 编辑角色
export function editRole(data) {
    return request({
        url: "/admin/system/editRole",
        method: "post",
        data,
    });
}

// 删除角色
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

// 获取角色勾选的菜单
export function getRoleAuth(data) {
    return request({
        url: "/admin/system/getRoleAuth",
        method: "post",
        data,
    });
}

// 拖拽角色树
export function dragRoleNode(data) {
    return request({
        url: "/admin/system/dragRoleNode",
        method: "post",
        data,
    });
}
