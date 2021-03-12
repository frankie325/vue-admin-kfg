const express = require("express");
const app = express();
const login = require("./routes/login");
const admin = require("./routes/admin");
const cors = require("cors"); //解决跨域
const auth = require("./middleWare/auth");

app.set("secret", "asdgs545gsdgasd"); //*SECRET相当于密钥，可以随意写，一般保存到环境变量中或本地。
app.use("/public", express.static("public")); //设置访问的静态资源
app.use(cors());
app.use(express.json()); // post请求传过来的参数，经过处理，在req.body中获取
app.use("/", login); //登录接口
app.use("/admin", auth(), admin); //后台系统统一接口前缀

app.listen(3000, () => {
    console.log("http://localhost:3000");
});
