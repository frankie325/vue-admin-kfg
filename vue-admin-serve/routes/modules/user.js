const express = require("express");
const router = express.Router();
const User = require("../../model/user");

// 获取用户信息
router.get("/info", async (req, res) => {
    let user = await User.findById(req.userId);
    res.send({
        code: 0,
        data: {
            username: user.username,
            roles: user.roles,
        },
        msg: "操作成功",
    });
});

//获取所有用户信息
router.post("/getAllUser", async (req, res) => {
    let pageSize = req.body.pageSize;
    let pageNum = req.body.pageNum;
    let keyWord = req.body.keyWord;
    let reg = new RegExp(keyWord, "g");
    let total = await User.count();
    console.log(total);
    let list = await User.find({
        // 关联模糊查询
        $or: [{ username: { $regex: reg } }],
    })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize);
    let userList = list.map((val) => {
        return {
            id: val._id,
            username: val.username,
            roles: val.roles,
        };
    });
    res.send({
        code: 0,
        data: {
            list: userList,
            totalPages: total,
        },
        msg: "操作成功",
    });
});

// 新增用户
router.post("/addUser", async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let user = await User.find({ username: username });
    if (user.length !== 0) {
        return res.send({
            code: 40001,
            data: null,
            msg: "用户已存在",
        });
    }
    await User.create({
        username: username,
        password: password,
        roles: ["admin"],
    });
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 删除用户
router.delete("/deleteUser", async (req, res) => {
    
});

module.exports = router;
