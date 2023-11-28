const express = require('express');
const app = express();
const pool = require("./dbPool.js"); // get our module.exports
app.set("view engine", "ejs");
app.use(express.static("public"));
//routes
app.get("/", async function (req, res) {
  let sql_a = `SELECT authorId, firstName, lastName 
             FROM q_authors 
             ORDER BY lastName`;
  let authorDB = await executeSQL(sql_a);
  let sql_c = `SELECT DISTINCT category 
             FROM q_quotes 
             ORDER BY category ASC`; // grab the categories to display in order
  let catDB = await executeSQL(sql_c);
    res.render('index', {"authorDB": authorDB, "catDB": catDB}); // index.ejs route and author db results
});//dbTest

// database test page
app.get("/dbTest", async function (req, res) {
    let sql = `SELECT * FROM q_quotes`; // ? is param var, prolly in order
    // let params = ['Joe'];
    let rows = await executeSQL(sql);
    // res.send(rows[0].username);
   res.send(rows);
});//dbTest

// by keyword
app.get("/searchByKeyword", async function (req, res) { // request, and response
  let userKeyword = req.query.keyword;
  // console.log(userKeyword);
  let sql = `SELECT quote, authorId, firstName, lastName
FROM q_quotes
NATURAL JOIN q_authors
WHERE quote LIKE ?`; // ? is param var, prolly in order
  let params = [`%${userKeyword}%`]; // prevent sql injection
  // let params = ['Joe'];
  let rows = await executeSQL(sql,params);    
   // res.send(rows); // send just this data
  res.render('results', {"quotes": rows}); // render and send data(as 'quotes') to the render
});

// by author
app.get("/searchByAuthor", async function (req, res) { // request, and response
  let author = req.query.authorId;
  // console.log(userKeyword);
  let sql = `SELECT quote, authorId, firstName, lastName
FROM q_quotes
NATURAL JOIN q_authors
WHERE authorId = ?`; // ? is param var, prolly in order
  let params = [author]; // prevent sql injection
  // let params = ['Joe'];
  let rows = await executeSQL(sql,params);    
   // res.send(rows); // send just this data
  res.render('results', {"quotes": rows}); // render and send data(as 'quotes') to the render
});//dbTest

// by category
app.get("/searchByCategory", async function (req, res) { // request, and response
  let cat = req.query.category;
    let sql = `SELECT quote, authorId, firstName, lastName
  FROM q_quotes
  NATURAL JOIN q_authors
  WHERE category LIKE ?
  ORDER BY quote ASC`; // ? is param var, prolly in order
    let params = [`%${cat}%`]; // prevent sql injection
    // let params = ['Joe'];
    let rows = await executeSQL(sql,params);    
     // res.send(rows); // send just this data
    res.render('results', {"quotes": rows}); // render and send data(as 'quotes') to the render
});

// by likes
app.get("/searchByLikes", async function (req, res) { // request, and response
  let min = req.query.likesmin;
  let max = req.query.likesmax;
    let sql = `SELECT quote, authorId, firstName, lastName
  FROM q_quotes
  NATURAL JOIN q_authors
  WHERE likes > ? 
  AND likes < ?
  ORDER BY likes ASC`; // ? is param var, prolly in order
  // maybe need to deal with invalid input?
  let params = [`${min}`, `${max}`  ]; // prevent sql injection
  // > min, < max

    let rows = await executeSQL(sql,params);
    res.render('results', {"quotes": rows}); // render and send data(as 'quotes') to the render
});

// route parameter - :id --> req.params.id
app.get("/api/author/:id", async (req,res) => {
  let authorId = req.params.id;
  // console.log(authorId); // these log in the repl console, opposed to browser
  let sql =`SELECT * 
  FROM q_authors
  WHERE authorId = ?`;
  let rows = await executeSQL(sql, [authorId]);
  res.send(rows);
});

// -------------------------------------------
app.listen(3000, () => {
    console.log("Express server running...")
})
// -------------------------------------------


//functions
async function executeSQL(sql, params) {
    return new Promise(function (resolve, reject) {
        pool.query(sql, params, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
}