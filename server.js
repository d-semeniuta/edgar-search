/* Author: Daniel Semeniuta
 * server.js 
 */

//attach express to the server
var express = require('express');
var app = express();

const https = require('https');
var parseString = require('xml2js').parseString;

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

//search
app.get('/search', function(req, res) {
    res.render('pages/search');
	var requestPath = buildRequestPath(req.query);
	//var ticker = req.query.ticker_symbol;
	https.get(requestPath, res => {
		res.setEncoding("utf8");
		let body = "";
		res.on("data", data => {
			body += data;
		});
		res.on("end", () => {
			//body = JSON.parse(body);
			parseString(body, function (err, res) {
				
				for (ent in res.feed.entry){
					console.log(res.feed.entry[ent]);
				}
				
				//console.log(res);
			})
		});
	});
});

function buildRequestPath(query){
	console.log('About to build request for: ' + query + '!');
	var baseUrl = "https://www.sec.gov/cgi-bin/browse-edgar?";
	var queryParams = {
		action: "getcompany",
		CIK: query.ticker_symbol,
		owner: "exclude",
		start: 0,
		count: query.num_results,
		output: "atom"
	};
	var queryString = toQueryString(queryParams);
	var requestUrl = baseUrl + queryString;
	console.log('Sending request to ' + requestUrl);
	return requestUrl;
}

//eliminates need for jQuery
function toQueryString(obj){
	var parts = [];
	for(var i in obj){
		if (obj.hasOwnProperty(i)) {
			parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
		}
	}
	return parts.join("&");
}


app.listen(8000);
console.log('Listening on port 8000');