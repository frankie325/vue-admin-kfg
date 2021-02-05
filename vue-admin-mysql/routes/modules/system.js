const express = require("express");
const router = express.Router();
const SystemMenus = require("../../model/system/system-menus"); //控制系统菜单表
const AuthForm = require("../../model/system/auth-form"); //控制权限表
const RoleForm = require("../../model/system/role-form");
const { listToTree, getTableData } = require("../../util/func");
const Mongoose = require("mongoose");
const ObjectId = Mongoose.Types.ObjectId;
// 获取所有菜单（路由表信息）
router.get("/getAllMenu", async (req, res) => {
    /*
    区别https://blog.csdn.net/qq_40140699/article/details/86064932
    populate通过path指定的字段，将指定关联的数据替换到该字段
    aggregate可以指定一个新字段，将所有的关联的数据添加到该字段
    let data = await SystemMenus.find().populate({ path: "parentId" });
    let data = await SystemMenus.aggregate([
        {
            $match: {
                匹配parent为null的
                parentId: null,
            },
        },
        {
           关联查询
            $lookup: {
                from: "system_menus_form", //关联的表
                localField: "_id", //关联的主键
                foreignField: "parentId", //关联的外键
                as: "children", //将system_menus表中的parent键等于_id的数据集合放到该名称下
            },
        },
    ]);
    */
    //激活 lean 选项的查询，返回的文档是普通 javascript 对象，而不是 Mongoose Documents

    let data = await SystemMenus.find().lean();
    let newData = listToTree(data);
    res.send({
        code: 0,
        data: recursionData(newData),
        msg: "操作成功",
    });
});

//   递归数据
function recursionData(data) {
    return data.map((val) => {
        return {
            _id: val._id,
            path: val.path,
            hidden: val.hidden,
            componentPath: val.componentPath,
            name: val.meta.title,
            auth: val.meta.auth,
            sort: val.sort,
            parentId: val.parentId,
            children: val.children ? recursionData(val.children) : [],
        };
    });
}

// 添加菜单
router.post("/createMenu", async (req, res) => {
    let params = {
        path: req.body.path,
        hidden: req.body.hidden,
        componentPath: req.body.componentPath,
        meta: {
            title: req.body.title,
            auth: req.body.auth,
        },
        sort: req.body.sort,
        parentId: req.body.parentId,
    };
    await SystemMenus.create(params);
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

//编辑菜单
router.post("/editMenu", async (req, res) => {
    let _id = req.body._id;
    let params = {
        path: req.body.path,
        hidden: req.body.hidden,
        componentPath: req.body.componentPath,
        meta: {
            title: req.body.title,
            auth: req.body.auth,
        },
        sort: req.body.sort,
        parentId: req.body.parentId,
    };
    await SystemMenus.where({ _id: _id }).updateOne(params);
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 删除菜单
router.delete("/deleteMenu", async (req, res) => {
    let _id = req.body._id;
    await SystemMenus.where({ _id: _id }).deleteOne();
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 获取所有权限
router.get("/getAllAuth", async (req, res) => {
    let data = await AuthForm.find().lean();
    res.send({
        code: 0,
        data: listToTree(data),
        msg: "操作成功",
    });
});

// 添加权限
router.post("/createAuth", async (req, res) => {
    let name = req.body.name;
    let auth = req.body.auth;
    let parentId = req.body.parentId;
    let sort = req.body.sort;
    await AuthForm.create({
        name,
        auth,
        sort,
        parentId,
    });
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

router.post("/editAuth", async (req, res) => {
    let _id = req.body._id;
    let name = req.body.name;
    let auth = req.body.auth;
    let sort = req.body.sort;
    await AuthForm.where({ _id: _id }).updateOne({ name, auth, sort });
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

router.delete("/deleteAuth", async (req, res) => {
    let _id = req.body._id;
    await AuthForm.where({ _id: _id }).deleteOne();
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 获取所有权限
router.get("/getAllAuth", async (req, res) => {
    let data = await AuthForm.find().lean();
    res.send({
        code: 0,
        data: listToTree(data),
        msg: "操作成功",
    });
});

// 获取所有部门角色
router.get("/getAllRole", async (req, res) => {
    // let data = await RoleForm.aggregate([
    //     // { $unwind: "$menusIds" },
    //     {
    //         $lookup: {
    //             from: "system_menus_form",
    //             localField: "menusIds",
    //             foreignField: "_id",
    //             as: "menusData",
    //         },
    //     },
    // ]);
    // let data = await RoleForm.aggregate([
    //     // { $unwind: "$menusIds" },
    //     {
    //         $lookup: {
    //             from: "users_form",
    //             localField: "_id",
    //             foreignField: "roleIds",
    //             as: "users",
    //         },
    //     },
    // ]);
    let data = await RoleForm.find().lean();
    res.send({
        code: 0,
        data: listToTree(data),
        msg: "操作成功",
    });
});

// 添加部门角色
router.post("/createRole", async (req, res) => {
    let name = req.body.name;
    let parentId = req.body.parentId;
    let sort = req.body.sort;
    let menusIds = req.body.menusIds;
    await RoleForm.create({
        name,
        sort,
        parentId,
        menusIds,
    });
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 编辑部门角色
router.post("/editRole", async (req, res) => {
    let name = req.body.name;
    // let parentId = req.body.parentId;
    let sort = req.body.sort;
    let menusIds = req.body.menusIds;
    let _id = req.body._id;
    await RoleForm.where({ _id: _id }).updateOne({
        name,
        sort,
        // parentId,
        menusIds,
    });
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 删除部门角色
router.delete("/deleteRole", async (req, res) => {
    let _id = req.body._id;
    await RoleForm.where({ _id: _id }).deleteOne();
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 获取部门角色下的用户
router.post("/getRoleUser", async (req, res) => {
    let _id = req.body._id;
    let pageSize = req.body.pageSize;
    let pageNum = req.body.pageNum;
    let data = await RoleForm.aggregate([
        // { $unwind: "$menusIds" },
        {
            $lookup: {
                from: "users_form",
                localField: "_id",
                foreignField: "roleIds",
                as: "users",
            },
        },
        {
            $match: {
                _id: ObjectId(_id), //要将字符串转化为Mongoose的Id类型
            },
        },
    ]);

    res.send({
        code: 0,
        data: getTableData(data[0].users, pageNum, pageSize),
        msg: "操作成功",
    });
});

module.exports = router;
