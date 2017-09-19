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

app.get('/search', function(req, res) {
    res.render('pages/index');
	buildRequest(req.query.ticker_symbol);
});

function buildRequest(ticker){
	var base_url = "https://www.sec.gov/cgi-bin/browse-edgar?"
	console.log('About to build request for: ' + ticker + '!');
	var query_params = {
		action: "getcompany",
		CIK: ticker,
		owner: "exclude",
		start: 0,
		count: 40,
		output: "atom"
	}
}

app.listen(8000);
console.log('Listening on port 8000');