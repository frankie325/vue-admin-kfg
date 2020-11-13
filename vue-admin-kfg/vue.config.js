const path = require("path");

module.exports = {
    publicPath: "./",
    // 关闭eslint校验
    lintOnSave: false,
    configureWebpack: {
        resolve: {
            // 设置路径别名
            alias: {
                // "@": path.resolve(__dirname, "src"),
                // "~": path.resolve(__dirname, "src"),
                // "#": path.resolve(__dirname, "src"),
            },
        },
    },

    pluginOptions: {
        //引入全局样式，                 因为scss的mixin文件等在main.js中导入无效
        "style-resources-loader": {
            preProcessor: "scss",
            patterns: [path.resolve(__dirname, "./src/styles/index.scss")],
        },
    },
};
