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
// from the form post method in newAuthor.ejs
app.post('/author/new', async function(req, res){
let fName = req.body.fName;
let lName = req.body.lName;
let birthDate = req.body.birthDate;
  let deathDate = req.body.deathDate;
  let sex = req.body.sex;
  let prof = req.body.prof;
  let country = req.body.country;
  let bio = req.body.bio;
let sql = `INSERT INTO q_authors (firstName,
lastName, dob, dod, sex, profession, country, biography) VALUES (?, ?, ?, ?, ?, ?, ?, ?);` // 8 total?
let params = [fName, lName, birthDate, deathDate, sex, prof, country, bio];
let rows = await executeSQL(sql, params);
res.render('newAuthor', {"message": "Author added!"});
});

// get the new webpage
app.get('/quote/new', async (req, res) => {
  let sql_a = `SELECT authorId, firstName, lastName 
             FROM q_authors 
             ORDER BY lastName`;
  let authorDB = await executeSQL(sql_a);
  let sql_c = `SELECT DISTINCT category 
             FROM q_quotes 
             ORDER BY category ASC`; // grab the categories to display in order
  let catDB = await executeSQL(sql_c);
    res.render('newQuote', {"authorDB": authorDB, "catDB": catDB}); // index.ejs route and author db results  
   // res.send('Hello Express app!')
  // res.render('newQuote');
});

// post request, uses body of http request for submitting values
// from the form post method in newQuote.ejs
app.post('/quote/new', async function(req, res){
let quote = req.body.quote;
let aId = req.body.authorId;
let category = req.body.category;
  let likes = req.body.likes;
let sql = `INSERT INTO q_quotes (quote, authorId, category, likes) VALUES (?, ?, ?, ? );` // 4 total
let params = [quote, aId, category, likes];
let rows = await executeSQL(sql, params);
  // for displaying and posting the info?
  let sql_a = `SELECT authorId, firstName, lastName 
             FROM q_authors 
             ORDER BY lastName`;
  let authorDB = await executeSQL(sql_a);
  
  let sql_c = `SELECT DISTINCT category 
             FROM q_quotes 
             ORDER BY category ASC`; // grab the categories to display in order
  let catDB = await executeSQL(sql_c);
    res.render('newQuote', {"authorDB": authorDB, "catDB": catDB, "message": "Quote added!"});
// res.render('newQuote', {"message": "Quote added!"});
});


// TESTING
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

