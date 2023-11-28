const express = require("express");
const mysql = require("mysql");
const app = express();
const pool = require("./dbPool");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true})); // for the POST method

//routes
app.get('/', (req, res) => {
   // res.send('Hello Express app!')
  res.render('index');
});

// get the new webpage
app.get('/author/new', (req, res) => {
   // res.send('Hello Express app!')
  res.render('newAuthor');
});

// post request, uses body of http request for submitting values
app.post('/author/new', async function(req, res){
let fName = req.body.fName;
let lName = req.body.lName;
let birthDate = req.body.birthDate;
let sql = `INSERT INTO q_authors (firstName,
lastName, dob) VALUES (?, ?, ? );`
let params = [fName, lName, birthDate];
let rows = await executeSQL(sql, params);
res.render('newAuthor', {"message": "Author added!"});
});


app.get("/dbTest", async function(req, res){
let sql = "SELECT CURDATE()";
let rows = await executeSQL(sql);
res.send(rows);
});//dbTest


//functions
async function executeSQL(sql, params){
return new Promise (function (resolve, reject) {
pool.query(sql, params, function (err, rows, fields) {
if (err) throw err;
   resolve(rows);
});
});
}//executeSQL


//start server
app.listen(3000, () => {
console.log("Expresss server running...")
} )

