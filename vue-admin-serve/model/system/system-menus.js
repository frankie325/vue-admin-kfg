const mongoose = require("mongoose");

// 系统菜单表
const schema = new mongoose.Schema({
    path: { type: String },
    hidden: { type: Boolean },
    componentPath: { type: String },
    meta: {
        title: { type: String },
        // icon: { type: String },
        auth: { type: String },
    },
    sort: { type: Number },
    // parentId: { type: mongoose.Schema.Types.ObjectId, ref: "SystemMenus", default: null },
    parentId: { type: mongoose.Schema.Types.ObjectId, default: null }, //用该字段和自己产生关联，可以形成无限级分类
});

// 第三参数为创建集合,不然mongoose会将建的表的末尾自动添加s来命名
module.exports = mongoose.model("SystemMenus", schema, "system_menus_form");
