const express = require("express");
const router = express.Router();
const User = require("../../model/user");

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

module.exports = router;
