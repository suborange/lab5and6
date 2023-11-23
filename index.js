const express = require('express');
const mysql = require('mysql');
const app = express();
const pool = dbConnection();
app.set("view engine", "ejs");
app.use(express.static("public"));
//routes
app.get("/dbTest", async function (req, res) {
    let sql = "SELECT CURDATE()";
    let rows = await executeSQL(sql);
    res.send(rows);
});//dbTest

//functions
async function executeSQL(sql, params) {
    return new Promise(function (resolve, reject) {
        pool.query(sql, params, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
}

//values in red must be updated
function dbConnection() {
    const pool = mysql.createPool({
        connectionLimit: 10,
        host: "db4free.net ", // port 3306
        user: "lab5_6_quotes",
        password: "!A-43ZTiqRjd2EU",
        database: "searching_quotes"
    });
    return pool;
}
//start server

app.listen(3000, () => {
    console.log("Express server running...")
})