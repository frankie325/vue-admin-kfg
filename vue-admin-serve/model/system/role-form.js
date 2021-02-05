const mongoose = require("mongoose");

// 部门角色表
const schema = new mongoose.Schema({
    name: { type: String },
    sort: { type: Number },
    parentId: { type: mongoose.Schema.Types.ObjectId, default: null }, //用该字段和自己产生关联，可以形成无限级分类
    menusIds: [mongoose.Schema.Types.ObjectId],
});

// 第三参数为创建集合,不然mongoose会将建的表的末尾自动添加s来命名
module.exports = mongoose.model("Roles", schema, "role_form");
