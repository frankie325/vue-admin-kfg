module.exports = () => {
    const mongoose = require("mongoose");
    mongoose.connect(
        "mongodb://admin:123456@127.0.0.1:27017/vue-admin?authSource=admin",
        { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false },
        (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("连接成功");
        }
    );
};
