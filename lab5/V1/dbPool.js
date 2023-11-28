const mysql = require('mysql');

    const pool = mysql.createPool({
        connectionLimit: 10,
        host: "db4free.net", // port 3306
        user: "lab5_6_quotes",
        password: "!A-43ZTiqRjd2EU",
        database: "searching_quotes"
    });

//start server

module.exports = pool;