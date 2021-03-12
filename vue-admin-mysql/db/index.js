// 连接数据库的方式一：直连

// const mysql = require("mysql");
// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "123456",
//     database: "vue-admin",
// });

// function queryFun(sql, callback) {
//     connection.connect();
//     connection.query(sql, function (err, rows, fields) {
//         if (err) throw err;
//         callback(rows);
//     });
//     connection.end();
// }

// module.exports = {
//     queryFun: queryFun,
// };

// 连接数据库的方式二：连接池
const mysql = require("mysql");
const pool = mysql.createPool({
    connectionLimit: 10, //一次创建的最大连接数
    host: "localhost",
    user: "root",
    password: "123456",
    database: "vue-admin",
});
/*
pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!

    // Use the connection
    connection.query("SELECT * FROM sometable", function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();

        // Handle error after the release.
        if (error) throw error;

        // Don't use the connection here, it has been returned to the pool.
    });
});
*/

const { v4: uuidv4 } = require("uuid");

// 封装
function queryFun(sql) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) reject(err);
            connection.query(sql, function (error, results, fields) {
                if (error) throw reject(err);
                resolve(results);
                connection.release();
            });
        });
    });
}

// js实现分页和模糊查询
function paginationFun(list, params) {
    let totalPages = list.length;
    let data = list.slice((params.pageNum - 1) * params.pageSize, (params.pageNum - 1) * params.pageSize + params.pageSize);
    // 实现模糊查询
    if (params.keyWord) {
        data = data.filter((val) => {
            return new RegExp(`^${params.keyWord}`).test(val.username);
        });
    }
    return {
        list: data,
        totalPages: totalPages,
    };
}

// 插入语句的封装
function queryInsertFun(table, params) {
    if (!params.id) {
        //如果不存在
        params.id = uuidv4();
    }
    let cols = "";
    let val = "";
    for (let key in params) {
        cols = cols + key + ",";
        if (typeof params[key] === "string") {
            val = val + "'" + params[key] + "'" + ",";
        } else {
            val = val + params[key] + ",";
        }
    }
    cols = cols.slice(0, -1);
    val = val.slice(0, -1);
    let sql = `insert into ${table} (${cols}) values (${val});`;
    console.log(sql);
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) reject(err);
            connection.query(sql, function (error, results, fields) {
                if (error) throw reject(err);
                resolve(results);
                connection.release();
            });
        });
    });
}
// 更新语句的封装
function queryUpdateFun(table, params) {
    let id = params.id;
    delete params.id;
    let cols = "";
    for (let key in params) {
        if (typeof params[key] === "string") {
            cols = cols + `${key}='${params[key]}',`;
        } else {
            cols = cols + `${key}=${params[key]},`;
        }
    }
    cols = cols.slice(0, -1);
    let sql = `update ${table} set ${cols} where id='${id}';`;
    console.log(sql);
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) reject(err);
            connection.query(sql, function (error, results, fields) {
                if (error) throw reject(err);
                resolve(results);
                connection.release();
            });
        });
    });
}

module.exports = {
    queryFun,
    queryInsertFun,
    queryUpdateFun,
    paginationFun,
};
