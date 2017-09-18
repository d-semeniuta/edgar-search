/* Author: Daniel Semeniuta
 * server.js 
 */

//attach express to the server
var express = require('express');
var app = express();

// set ejs
app.set('view engine', 'ejs');

// index will hold the app, about the description/instructions

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.listen(8000);
console.log('Listening on port 8000');