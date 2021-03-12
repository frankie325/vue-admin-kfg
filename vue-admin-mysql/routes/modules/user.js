const express = require("express");
const router = express.Router();
const { queryFun, queryInsertFun, queryUpdateFun, paginationFun } = require("../../db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// 获取用户信息
router.get("/info", async (req, res) => {
    let userData = await queryFun(`select * from user_form where id='${req.userId}';`);
    let authData = await queryFun(
        `select distinct a.* 
        from user_role_form ur 
        left join role_auth_form ra on ur.role_id = ra.role_id
        right join auth_form a on ra.auth_id = a.id
        where ur.user_id ='${req.userId}';`
    );
    res.send({
        code: 0,
        data: {
            userInfo: userData[0],
            auths: authData.map((val) => {
                return val.auth;
            }),
        },
        msg: "操作成功",
    });
});

//获取所有用户信息
router.post("/getAllUser", async (req, res) => {
    let data = await queryFun("select * from user_form");
    res.send({
        code: 0,
        data: paginationFun(data, req.body),
        msg: "操作成功",
    });
});

// 新增用户
router.post("/addUser", async (req, res) => {
    let username = req.body.username;
    let password = bcrypt.hashSync(req.body.password, 10);
    let user = await queryFun(`select * from user_form where username='${username}'`);
    if (user.length !== 0) {
        return res.send({
            code: 40001,
            data: null,
            msg: "用户已存在",
        });
    }
    let id = uuidv4();
    await queryInsertFun("user_form", { id: id, username: username, password: password, auths: "admin" });
    for (let roleId of req.body.roleIds) {
        await queryInsertFun("user_role_form", {
            user_id: id,
            role_id: roleId,
        });
    }
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 修改用户信息
router.put("/editUser", async (req, res) => {
    // console.log(req.body.id);
    await queryUpdateFun("user_form", { id: req.body.id, username: req.body.username });
    await queryFun(`delete from user_role_form where user_id='${req.body.id}'`);
    for (let roleId of req.body.roleIds) {
        await queryInsertFun("user_role_form", {
            user_id: req.body.id,
            role_id: roleId,
        });
    }
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 删除用户
router.delete("/deleteUser", async (req, res) => {
    let deleteList = req.body.deleteList;
    for (let id of deleteList) {
        await queryFun(`delete from user_form where id='${id}'`);
        await queryFun(`delete from user_role_form where user_id='${id}'`);
    }
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

//获取所有用户信息的所属角色
router.post("/getUserRole", async (req, res) => {
    let data = await queryFun(
        `select rf.id,rf.name from user_role_form as urf inner join role_form rf on urf.role_id = rf.id where user_id='${req.body.id}';`
    );
    res.send({
        code: 0,
        data: data,
        msg: "操作成功",
    });
});

module.exports = router;
