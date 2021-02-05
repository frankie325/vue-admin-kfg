//todo 登录模块
const express = require("express");
const router = express.Router();
// const User = require("../model/user-form");
const jwt = require("jsonwebtoken");
const { queryFun } = require("../db");

router.post("/login", async (req, res) => {
    // 1.根据用户名
    // let user = await queryFun.findOne({ username: req.body.username });
    let user = await queryFun(`select * from user_form where username='${req.body.username}';`);
    if (!user[0]) {
        return res.send({
            data: null,
            code: 40001,
            msg: "用户不存在",
        });
    }

    // 2.校验密码                               //输入的密码         //数据库的密码
    let isValid = require("bcrypt").compareSync(req.body.password, user[0].password); //校验密码
    if (!isValid) {
        return res.send({
            data: null,
            code: 40002,
            msg: "密码错误",
        });
    }

    // 3.生成token,返回给客户端
    const token = jwt.sign(
        {
            id: String(user[0].id), //*将用户id加密后，生成token，//可以写其他信息，不止id
        },
        req.app.get("secret")
    );
    res.send({
        code: 0,
        data: {
            user: user,
            token: token,
        },
        msg: "操作成功",
    });
    // let data = await User.create({
    //     username: "kfg2",
    //     password: "123456",
    //     roles: ["edit"],
    // });
    // res.send(data);
});

module.exports = router;
