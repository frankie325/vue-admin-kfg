// 将扁平数组转化为树形结构
function listToTree(list) {
    // https://juejin.cn/post/6844903854702592013
    let map = {};
    // 1.第一部分先将数组中的所有元素都复制到 map 中(注意：这里是引用复制哦，这个细节很重要)
    list.forEach((item) => {
        if (!map[item.id]) {
            map[item.id] = item;
        }
    });
    list.forEach((item) => {
        // 2.遍历数据，根据parentId，找到对应的父节点数据，判断有没有children，如果不存在则直接给它赋值，否则将值 push 到 children 中
        if (item.parentId !== "top") map[item.parentId].children ? map[item.parentId].children.push(item) : (map[item.parentId].children = [item]);
    });
    //3.对数据进行过滤，只要父节点即可
    let data = list.filter((item) => {
        if (item.parentId === "top") {
            return true;
        } else {
            return false;
        }
    });
    sortFun(data);
    return data;
}

// 对树形数据排序
function sortFun(data) {
    data.forEach((item) => {
        if (item.children) sortFun(item.children);
    });
    data.sort((a, b) => {
        return a.sort - b.sort;
    });
}

function getTableData(data = [], pageNum, pageSize) {
    let tableData = data.slice((pageNum - 1) * pageSize, pageSize);
    return {
        list: tableData,
        totalPages: data.length,
    };
}

module.exports = {
    listToTree,
    getTableData,
};
