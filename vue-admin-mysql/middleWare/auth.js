module.exports = (options) => {
    const jwt = require("jsonwebtoken");

    return async (req, res, next) => {
        let token = String(req.headers.authorization || "");
        try {
            //token验证成功后data中包含用户的id
            let data = await jwt.verify(token, req.app.get("secret"));
            req.userId = data.id;
            console.log(data)
        } catch (error) {
            return res.send({
                code: 50001,
                data: null,
                msg: "token失效",
            });
        }
        await next();
    };
};
