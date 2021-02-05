const express = require("express");
const router = express.Router();
const { queryFun, queryPagination } = require("../../db");
// 获取用户信息
router.get("/info", async (req, res) => {
    let data = await queryFun(`select * from user_form where id='${req.userId}';`);
    res.send({
        code: 0,
        data: {
            username: data[0].username,
            auths: data[0].auths,
        },
        msg: "操作成功",
    });
});

//获取所有用户信息
router.post("/getAllUser", async (req, res) => {
    let pageSize = req.body.pageSize;
    let pageNum = req.body.pageNum;
    let keyWord = req.body.keyWord;
    let data1 = await queryFun("select count(*) as total from user_form");
    console.log(data1);
    let data2 = await queryPagination("select * from user_form", pageSize, pageNum);
    res.send({
        code: 0,
        data: {
            list: data2,
            totalPages: data1[0].total,
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
        auths: ["admin"],
    });
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 修改用户信息
router.put("/editUser", async (req, res) => {
    // console.log(req.body.id);
    let id = req.body.id;
    let username = req.body.username;
    await User.where({ _id: id }).update({ username: username });
    // await User.findByIdAndUpdate({ _id: id }, { username: username });
    //  mongoose提供的findOneAndUpdate、findAndModify的两个方法，默认返回原始的数据，需要将new属性设置为true，返回更新后的数据
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

// 删除用户
router.delete("/deleteUser", async (req, res) => {
    let deleteList = req.body.deleteList;
    console.log(deleteList);
    await User.deleteMany({ _id: { $in: deleteList } });
    res.send({
        code: 0,
        data: null,
        msg: "操作成功",
    });
});

module.exports = router;
