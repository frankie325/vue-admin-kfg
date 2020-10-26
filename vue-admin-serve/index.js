const express = require("express");
const app = express();
const login = require("./routes/login");
const admin = require("./routes/admin");
require("./plugins/db")(); //连接Mongo数据库
const cors = require("cors"); //解决跨域
const auth = require("./middleWare/auth");//除login接口外，处理所有接口的token验证

app.set("secret", "asdgs545gsdgasd"); //*SECRET相当于密钥，可以随意写，一般保存到环境变量中或本地。
app.use(cors());
app.use(express.json()); // post请求传过来的参数，经过处理，在req.body中获取
app.use("/", login); //登录接口
app.use("/admin", auth(), admin); //后台系统统一接口前缀

// 处理错误中间件;
// app.use(async (err, req, res, next) => {
//     console.log(err.statusCode);
//     console.log(err.message);
//     res.status(err.statusCode || 500).send({
//         message: err.message,
//     });
// });

app.listen(3000, () => {
    console.log("http://localhost:3000");
});
