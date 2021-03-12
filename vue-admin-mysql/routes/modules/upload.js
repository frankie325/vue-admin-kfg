const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const sd = require("silly-datetime");
const mkdirp = require("mkdirp");

var storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        // 1.获取当前日期并且格式化
        let day = sd.format(new Date(), "YYYYMMDD");
        // 拼接成目录
        let dir = path.join("public/upload", day);
        // 2.生成目录
        await mkdirp(dir); //mkdirp是一个异步方法

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        console.log(file);
        // 1.获取后缀名
        // let extname = path.extname(file.originalname);
        // 2.根据时间戳生成文件名
        cb(null, file.originalname);
    },
});

var upload = multer({ storage: storage });

router.post("/", upload.array("file"), (req, res) => {
    // console.log(1111);
    console.log(req.files);
    let files = req.files.map((val) => {
        return {
            filename: val.filename,
            mimetype: val.mimetype,
            path: val.path.replace(/\\/g, "/"),
            size: val.size,
        };
    });
    res.send({
        code: 0,
        data: files,
        msg: "操作成功",
    });
});

module.exports = router;
