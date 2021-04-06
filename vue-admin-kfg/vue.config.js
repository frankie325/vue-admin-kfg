const path = require("path");


// 添加计算环境变量。它们仍然需要以 VUE_APP_ 前缀开头。这可以用于版本信息:
process.env.VUE_APP_VERSION = require('./package.json').version


module.exports = {
    publicPath: "./",
    outputDir:"dist",
    // 关闭eslint校验
    lintOnSave: false,

    // configureWebpack对象将会被 webpack-merge 合并入最终的 webpack 配置
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
