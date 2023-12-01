const express = require("express");
const mysql = require("mysql");
const app = express();
const pool = require("./dbPool");
const { exec } = require("child_process");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // for the POST method

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
app.post('/author/new', async function (req, res) {
  let fName = req.body.fName;
  let lName = req.body.lName;
  let birthDate = req.body.birthDate;
  let deathDate = req.body.deathDate;
  let sex = req.body.sex;
  let prof = req.body.prof;
  let country = req.body.country;
  let bio = req.body.bio;
  let purl = req.body.url;
  let sql = `INSERT INTO q_authors (firstName,
lastName, dob, dod, sex, profession, country, portrait, biography) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);` // 8 total?
  let params = [fName, lName, birthDate, deathDate, sex, prof, country, purl, bio];
  let rows = await executeSQL(sql, params);
  res.render('newAuthor', { "message": "Author added!" });
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
  // console.log("quote get");
  res.render('newQuote', { "authorDB": authorDB, "catDB": catDB, "message": "Quote added!" }); // index.ejs route and author db results  
  // res.send('Hello Express app!')
  // res.render('newQuote');
});

// post request, uses body of http request for submitting values
// from the form post method in newQuote.ejs
app.post('/quote/new', async function (req, res) {
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
  // console.log("quote post");
  res.render('newQuote', { "authorDB": authorDB, "catDB": catDB, "message": "Quote added!" });

  // res.render('newQuote', {"message": "Quote added!"});
});

// get authors to list
app.get("/authors", async function (req, res) {
  let sql = `SELECT *
FROM q_authors
ORDER BY lastName`;
  let rows = await executeSQL(sql);
  res.render("authorList", { "authors": rows });
});

// UPDATING
// GET
app.get("/author/edit", async function (req, res) {
  let authorId = req.query.authorId;
  // console.log("get id:", authorId); // becomes undefined here after post request
  let sql = `SELECT *, DATE_FORMAT(dob, '%Y-%m-%d') dobISO
    FROM q_authors
    WHERE authorId = ${authorId}`;
  let rows = await executeSQL(sql);
  res.render("editAuthor", { "authorInfo": rows });
});

//POST 
app.post("/author/edit", async function (req, res) {
  const id = req.body.authorId;
  let sql = `UPDATE q_authors
    SET firstName = ?,
    lastName = ?,
    dob = ?,
    sex = ?
    WHERE authorId = ?`;
  let params = [req.body.fName,
  req.body.lName,
  req.body.dob,
  req.body.sex,
    id];
  let postsql = await executeSQL(sql, params);
  // execute update, then redisplay the new information
  sql = `SELECT *, DATE_FORMAT(dob, '%Y-%m-%d') dobISO
    FROM q_authors WHERE authorId = ${id}`;
  //  console.log("before post sql");
  let rows = await executeSQL(sql);
  // console.log("post id:" + id);
  res.render("editAuthor", {
    "authorInfo": rows,
    "message": "Author Updated!"
  });
});

// DELETE
app.get('/author/delete', async (req, res) => {
  let sql = `DELETE FROM q_authors 
  WHERE authorId = ${req.body.authorId}`;

  let rows = await executeSQL(sql);
  res.redirect('/authors'); // redirect back to listing the authors.

});

// get authors to list
app.get("/quotes", async function (req, res) {
  let sql = `SELECT *
FROM q_quotes
ORDER BY quoteId ASC`;
  let rows = await executeSQL(sql);
  res.render("quoteList", { "quotes": rows });
});

// GET
app.get("/quote/edit", async function (req, res) {
  let quoteId = req.query.quoteId;
// NATURAL JOIN q_authors
  let qsql = `SELECT *
  FROM q_quotes  
  WHERE quoteId = ${quoteId}`;
  let qrows = await executeSQL(qsql);
  let aqsl = `SELECT DISTINCT firstName, lastName, authorId
              FROM q_authors `;
  let arows = await executeSQL(aqsl);  
  let csql = `SELECT DISTINCT category FROM q_quotes`;
  let cats = await executeSQL(csql);
  // console.dir(arows);
  res.render("editQuote", { "quoteInfo": qrows, "authorInfo": arows, "cats": cats });
});


//POST 
app.post("/quote/edit", async function (req, res) {
  const id = req.body.quoteId;
  let sql = `UPDATE q_quotes
    SET quote = ?,
    category = ?,  
    likes = ?,
    authorId = ?
    WHERE quoteId = ?`;
  let params = [req.body.quote,
  req.body.category, // from the drop down of categories
  req.body.likes,
  req.body.authorId, // from the drop down of authors
    id];
  let postsql = await executeSQL(sql, params);
  // execute update, then redisplay the new information
  sql = `SELECT *, DATE_FORMAT(dob, '%Y-%m-%d') dobISO
    FROM q_authors WHERE authorId = ${id}`;

  let rows = await executeSQL(sql);

  res.render("editQuote", {
    "quoteInfo": rows,
    "message": "Quote Updated!"
  });
});

// DELETE
app.get('/quote/delete', async (req, res) => {
  let sql = `DELETE FROM q_quote 
  WHERE quoteId = ${req.body.quoteId}`;

  let rows = await executeSQL(sql);
  res.redirect('/quotes'); // redirect back to listing the authors.
});


// TESTING
app.get("/dbTest", async function (req, res) {
  let sql = "SELECT CURDATE()";
  let rows = await executeSQL(sql);
  res.send(rows);
});//dbTest


//functions
async function executeSQL(sql, params) {
  return new Promise(function (resolve, reject) {
    // console.log("inside sql");
    pool.query(sql, params, function (err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });
}//executeSQL


//start server
app.listen(3000, () => {
  console.log("Expresss server running...")
})

