const express = require("express");
const router = express.Router();
const User = require("./modules/user");

router.use("/user", User); //处理用户信息接口模块

module.exports = router;
