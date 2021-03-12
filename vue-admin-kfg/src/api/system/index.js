import request from "@/utils/request";

// 拖拽菜单
export function dragMenu(data) {
    return request({
        url: "/admin/system/dragNode",
        method: "post",
        data,
    });
}
