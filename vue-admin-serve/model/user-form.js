const mongoose = require("mongoose");

// 用户信息表
const schema = new mongoose.Schema({
    username: { type: String },
    password: {
        type: String,
        // select: false, //不查这个数据
        set: (value) => {
            // 密码散列，一种加密方式,就算输入一样的密码，散列值也不同，不可逆
            //  第二个参数为散列的强度，一般10-12，太大性能会变慢
            return require("bcrypt").hashSync(value, 10);
        },
    },
    auths: { type: Array },
    roleIds: [mongoose.Schema.Types.ObjectId],
});

// 第三参数为创建集合,不然mongoose会将category末尾自动添加s来命名
module.exports = mongoose.model("user", schema, "users_form");
