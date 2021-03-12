const express = require("express");
const router = express.Router();
const { queryFun, queryInsertFun, queryUpdateFun, paginationFun } = require("../../db");
const { listToTree, getTableData } = require("../../util/func");
const { v4: uuidv4 } = require("uuid");

// 获取所有菜单（路由表信息）
router.get("/getAllMenu", async (req, res) => {
    let data = await queryFun(`select * from system_menu_form`);
    res.send({
        code: 0,
        data: listToTree(data),
        msg: "操作成功",
    });
});

// 获取所有菜单和权限的连接表
router.get("/getMenuAuth", async (req, res) => {
    let data = await queryFun(
        `select sm.*,a.auth 
    from system_menu_form sm 
    left join auth_form a on sm.auth_id = a.id
    `
    );
    res.send({
        code: 0,
        data: listToTree(data),
        msg: "操作成功",
    });
});

// 添加菜单
router.post("/createMenu", async (req, res) => {
    await queryInsertFun("system_menu_form", req.body);
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

//编辑菜单
router.post("/editMenu", async (req, res) => {
    await queryUpdateFun("system_menu_form", req.body);
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 删除菜单
router.delete("/deleteMenu", async (req, res) => {
    let id = req.body.id;
    await queryFun(`delete from system_menu_form where id='${id}'`);
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 获取所有权限
router.get("/getAllAuth", async (req, res) => {
    let data = await queryFun(`select * from auth_form`);
    res.send({
        code: 0,
        data: listToTree(data),
        msg: "操作成功",
    });
});

// 添加权限
router.post("/createAuth", async (req, res) => {
    await queryInsertFun("auth_form", req.body);
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

router.post("/editAuth", async (req, res) => {
    await queryUpdateFun("auth_form", req.body);
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

router.delete("/deleteAuth", async (req, res) => {
    let id = req.body.id;
    await queryFun(`delete from auth_form where id='${id}'`);
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 获取所有部门和角色
router.get("/getDepartmentRole", async (req, res) => {
    let departmentData = await queryFun("select * from department_form;");

    for (let index = 0; index < departmentData.length; index++) {
        let roleData = await queryFun(`select * from role_form where department_id='${departmentData[index].id}';`);
        departmentData[index].children = roleData;
    }
    res.send({
        code: 0,
        data: listToTree(departmentData),
        msg: "操作成功",
    });
});

// 添加部门
router.post("/createDepartment", async (req, res) => {
    await queryInsertFun("department_form", req.body);
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 编辑部门
router.post("/editDepartment", async (req, res) => {
    await queryUpdateFun("department_form", { id: req.body.id, name: req.body.name, sort: req.body.sort });
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 删除部门
router.delete("/deleteDepartment", async (req, res) => {
    await queryFun(`delete from department_form where id='${req.body.id}'`);
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 获取部门角色勾选的权限
router.post("/getRoleAuth", async (req, res) => {
    let id = req.body.id;
    let data = await queryFun(`select auth_id from role_auth_form where role_id='${id}'`);
    res.send({
        code: 0,
        data: data.map((val) => {
            return val.auth_id;
        }),
        msg: "操作成功",
    });
});

// 添加部门角色
router.post("/createRole", async (req, res) => {
    let id = uuidv4();
    await queryInsertFun("role_form", {
        id: id,
        name: req.body.name,
        sort: req.body.sort,
        department_id: req.body.department_id,
    });
    for (let authId of req.body.authIds) {
        await queryInsertFun("role_auth_form", {
            role_id: id,
            auth_id: authId,
        });
    }

    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 编辑部门角色
router.post("/editRole", async (req, res) => {
    await queryUpdateFun("role_form", { id: req.body.id, name: req.body.name, sort: req.body.sort });
    await queryFun(`delete from role_auth_form where role_id='${req.body.id}'`);
    for (let authId of req.body.authIds) {
        await queryInsertFun("role_auth_form", {
            role_id: req.body.id,
            auth_id: authId,
        });
    }
    let data = await queryFun(`select * from user_role_form where role_id='${req.body.id}'`);
    //判断当前的登录用户是否在该角色下
    let flag = false;
    data.forEach((item) => {
        if (req.body.userId === item.user_id) {
            flag = true;
        }
    });
    res.send({
        code: 0,
        data: { include: flag },
        msg: "操作成功",
    });
});

// 删除部门角色
router.delete("/deleteRole", async (req, res) => {
    let data = await queryFun(`select * from user_role_form where role_id='${req.body.id}'`);
    console.log(data);
    if (data.length !== 0) {
        res.send({
            code: 50002,
            data: null,
            msg: "请先删除角色下的用户",
        });
        return;
    }
    await queryFun(`delete from role_form where id='${req.body.id}'`);
    await queryFun(`delete from role_auth_form where role_id='${req.body.id}'`);
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 获取部门角色下的用户
router.post("/getRoleUser", async (req, res) => {
    let data = await queryFun(`select * from user_role_form as urf inner join user_form uf on urf.user_id = uf.id where role_id='${req.body.id}';`);
    res.send({
        code: 0,
        data: paginationFun(data, req.body),
        msg: "操作成功",
    });
});

// 获取部门角色下的用户
router.post("/getRoleUser", async (req, res) => {
    let data = await queryFun(`select * from user_role_form as urf inner join user_form uf on urf.user_id = uf.id where role_id='${req.body.id}';`);
    res.send({
        code: 0,
        data: paginationFun(data, req.body),
        msg: "操作成功",
    });
});

router.post("/dragNode", async (req, res) => {
    let currentId = req.body.currentId;
    let targetId = req.body.targetId;
    let currentParentId = req.body.currentParentId;
    let targetParentId = req.body.targetParentId;
    let currentSort = req.body.currentSort;
    let targetSort = req.body.targetSort;
    let position = req.body.position;
    let form = req.body.form;
    // 1.判断是不是inner
    if (position === "inner") {
        // 查出拖拽到的节点下的所有数据，添加到末尾
        let data = await queryFun(`select * from ${form} where parentId = '${targetId}'`);
        await queryUpdateFun(form, { id: currentId, parentId: targetId, sort: data.length + 1 });
        // 被拖拽出去的节点后面的所有节点sort都减一
        await queryFun(`update ${form} set sort = sort - 1 where parentId = '${currentParentId}' and sort > ${currentSort}`);
    } else {
        // 2.如果不是inner,判断被拖拽的节点是否还属于原先的父亲
        if (currentParentId === targetParentId) {
            // 被拖拽的节点sort大于拖拽到的节点sort
            if (currentSort > targetSort) {
                // 拖拽到节点之前
                if (position === "before") {
                    // 在这之间的所有sort都加一
                    await queryFun(
                        `update ${form} set sort = sort + 1 where parentId = '${currentParentId}' and sort >= ${targetSort} and sort < ${currentSort}`
                    );
                    // 更新被拖拽的节点的sort,语句必须放最后
                    await queryUpdateFun(form, { id: currentId, sort: targetSort });
                } else {
                    // 拖拽到节点之后
                    // 在这之间的所有sort都加一
                    await queryFun(
                        `update ${form} set sort = sort + 1 where parentId = '${currentParentId}' and sort > ${targetSort} and sort < ${currentSort}`
                    );
                    // 更新被拖拽的节点的sort
                    await queryUpdateFun(form, { id: currentId, sort: targetSort + 1 });
                }
            } else {
                // 被拖拽的节点sort小于拖拽到的节点sort
                if (position === "before") {
                    // 在这之间的所有sort都减一
                    await queryFun(
                        `update ${form} set sort = sort - 1 where parentId = '${currentParentId}' and sort > ${currentSort} and sort < ${targetSort}`
                    );
                    await queryUpdateFun(form, { id: currentId, sort: targetSort - 1 });
                } else {
                    // 在这之间的所有sort都减一
                    await queryFun(
                        `update ${form} set sort = sort - 1 where parentId = '${currentParentId}' and sort > ${currentSort} and sort <= ${targetSort}`
                    );
                    await queryUpdateFun(form, { id: currentId, sort: targetSort });
                }
            }
        } else {
            // 3.不属于原来的父亲，则只需改变后面的节点索引值
            // 被拖拽出去的节点后面的所有节点sort都减一
            await queryFun(`update ${form} set sort = sort - 1 where parentId = '${currentParentId}' and sort > ${currentSort}`);
            // 拖拽到的位置的后面节点sort都加一
            if (position === "before") {
                await queryFun(`update ${form} set sort = sort + 1 where parentId = '${targetParentId}' and sort >= ${targetSort} `);
                // 最后再更新该节点
                await queryUpdateFun(form, { id: currentId, parentId: targetParentId, sort: targetSort });
            } else {
                await queryFun(`update ${form} set sort = sort + 1 where parentId = '${targetParentId}' and sort > ${targetSort} `);
                // 最后再更新该节点
                await queryUpdateFun(form, { id: currentId, parentId: targetParentId, sort: targetSort + 1 });
            }
        }
    }
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

router.post("/dragRoleNode", async (req, res) => {
    let currentId = req.body.currentId;
    let targetId = req.body.targetId;
    let currentParentId = req.body.currentParentId;
    let targetParentId = req.body.targetParentId;
    let currentSort = req.body.currentSort;
    let targetSort = req.body.targetSort;
    let currentDepOrRole = req.body.currentDepOrRole;
    let position = req.body.position;
    // 1.判断是不是inner
    if (position === "inner") {
        // 查出拖拽到的节点下的所有数据，添加到末尾
        let data1 = await queryFun(`select * from department_form where parentId = '${targetId}'`);
        let data2 = await queryFun(`select * from role_form where department_id = '${targetId}'`);
        console.log(data1);
        console.log(data2);
        if (currentDepOrRole === 1) {
            await queryUpdateFun("department_form", { id: currentId, parentId: targetId, sort: data1.length + data2.length + 1 });
        } else {
            await queryUpdateFun("role_form", { id: currentId, department_id: targetId, sort: data1.length + data2.length + 1 });
        }
        // 被拖拽出去的节点后面的所有节点sort都减一
        await queryFun(`update department_form set sort = sort - 1 where parentId = '${currentParentId}' and sort > ${currentSort}`);
        await queryFun(`update role_form set sort = sort - 1 where department_id = '${currentParentId}' and sort > ${currentSort}`);
    } else {
        // 2.如果不是inner,判断被拖拽的节点是否还属于原先的父亲
        if (currentParentId === targetParentId) {
            // 被拖拽的节点sort大于拖拽到的节点sort
            if (currentSort > targetSort) {
                // 拖拽到节点之前
                if (position === "before") {
                    // 在这之间的所有sort都加一
                    await queryFun(
                        `update department_form set sort = sort + 1 where parentId = '${currentParentId}' and sort >= ${targetSort} and sort < ${currentSort}`
                    );
                    await queryFun(
                        `update role_form set sort = sort + 1 where department_id = '${currentParentId}' and sort >= ${targetSort} and sort < ${currentSort}`
                    );
                    // 更新被拖拽的节点的sort,语句必须放最后
                    if (currentDepOrRole === 1) {
                        await queryUpdateFun("department_form", { id: currentId, sort: targetSort });
                    } else {
                        await queryUpdateFun("role_form", { id: currentId, sort: targetSort });
                    }
                } else {
                    // 拖拽到节点之后
                    // 在这之间的所有sort都加一
                    await queryFun(
                        `update department_form set sort = sort + 1 where parentId = '${currentParentId}' and sort > ${targetSort} and sort < ${currentSort}`
                    );
                    await queryFun(
                        `update role_form set sort = sort + 1 where department_id = '${currentParentId}' and sort > ${targetSort} and sort < ${currentSort}`
                    );
                    // 更新被拖拽的节点的sort
                    if (currentDepOrRole === 1) {
                        await queryUpdateFun("department_form", { id: currentId, sort: targetSort + 1 });
                    } else {
                        await queryUpdateFun("role_form", { id: currentId, sort: targetSort + 1 });
                    }
                }
            } else {
                // 被拖拽的节点sort小于拖拽到的节点sort
                if (position === "before") {
                    // 在这之间的所有sort都减一
                    await queryFun(
                        `update department_form set sort = sort - 1 where parentId = '${currentParentId}' and sort > ${currentSort} and sort < ${targetSort}`
                    );
                    await queryFun(
                        `update role_form set sort = sort - 1 where department_id = '${currentParentId}' and sort > ${currentSort} and sort < ${targetSort}`
                    );
                    if (currentDepOrRole === 1) {
                        await queryUpdateFun("department_form", { id: currentId, sort: targetSort - 1 });
                    } else {
                        await queryUpdateFun("role_form", { id: currentId, sort: targetSort - 1 });
                    }
                } else {
                    // 在这之间的所有sort都减一
                    await queryFun(
                        `update department_form set sort = sort - 1 where parentId = '${currentParentId}' and sort > ${currentSort} and sort <= ${targetSort}`
                    );
                    await queryFun(
                        `update role_form set sort = sort - 1 where department_id = '${currentParentId}' and sort > ${currentSort} and sort <= ${targetSort}`
                    );
                    if (currentDepOrRole === 1) {
                        await queryUpdateFun("department_form", { id: currentId, sort: targetSort });
                    } else {
                        await queryUpdateFun("role_form", { id: currentId, sort: targetSort });
                    }
                }
            }
        } else {
            // 不属于原来的父亲，则只需改变后面的节点索引值
            // 被拖拽出去的节点后面的所有节点sort都减一
            await queryFun(`update department_form set sort = sort - 1 where parentId = '${currentParentId}' and sort > ${currentSort}`);
            await queryFun(`update role_form set sort = sort - 1 where department_id = '${currentParentId}' and sort > ${currentSort}`);
            // 拖拽到的位置的后面节点sort都加一
            if (position === "before") {
                await queryFun(`update department_form set sort = sort + 1 where parentId = '${targetParentId}' and sort >= ${targetSort} `);
                await queryFun(`update role_form set sort = sort + 1 where department_id = '${targetParentId}' and sort >= ${targetSort} `);
                // 最后再更新该节点
                if (currentDepOrRole === 1) {
                    await queryUpdateFun("department_form", { id: currentId, parentId: targetParentId, sort: targetSort });
                } else {
                    await queryUpdateFun("role_form", { id: currentId, department_id: targetParentId, sort: targetSort });
                }
            } else {
                await queryFun(`update department_form set sort = sort + 1 where parentId = '${targetParentId}' and sort > ${targetSort} `);
                await queryFun(`update role_form set sort = sort + 1 where department_id = '${targetParentId}' and sort > ${targetSort} `);
                // 最后再更新该节点
                if (currentDepOrRole === 1) {
                    await queryUpdateFun("department_form", { id: currentId, parentId: targetParentId, sort: targetSort + 1 });
                } else {
                    await queryUpdateFun("role_form", { id: currentId, department_id: targetParentId, sort: targetSort + 1 });
                }
            }
        }
    }
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

module.exports = router;
