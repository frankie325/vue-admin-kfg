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

// 分页查询
function queryPagination(sql, pageSize, pageNum) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) reject(err);
            connection.query(`${sql} limit ${(pageNum - 1) * pageSize},${pageSize}`, function (error, results, fields) {
                if (error) throw reject(err);
                resolve(results);
                connection.release();
            });
        });
    });
}

module.exports = {
    queryFun,
    queryPagination,
};
