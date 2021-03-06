/* Author: Daniel Semeniuta
 * server.js 
 */

//attach express to the server
var express = require('express');
var app = express();

const https = require('https');
var parseString = require('xml2js').parseString;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// set ejs
app.set('view engine', 'ejs');

// index will hold the app, about the description/instructions

// index page 
app.get('/', function(req, res) {
    res.render('pages/index', {
		query: false
	});
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});

//search results display
app.get('/search', function(req, response) {
    
	var requestPath = buildRequestPath(req.query);
	//sends request to SEC website for the RSS feed of results
	https.get(requestPath, res => {
		res.setEncoding('utf8');
		let body = '';
		res.on('data', data => {
			body += data;
		});
		res.on('end', () => {
			
			//parses the xml object returned by the RSS feed of the edgar search
			//populates a list of objects which becomes the search results
			parseString(body, function (err, res) {
				if(!res){
					response.render('pages/search',{
						loadResults: false,
						query: req.query
					});
				} else {
					var entries = [];
					var resEntries = res.feed.entry;
					for (ent in resEntries){
						var entryObj = new Object();
						var content = resEntries[ent].content[0];
						entryObj.filingType = content['filing-type'];
						entryObj.description = content['form-name'];
						entryObj.date = content['filing-date'];
						entryObj.link = content['filing-href'];
						entries.push(entryObj);
					}
					
					response.render('pages/search', {
						loadResults: true,
						filings: entries,
						numResults: entries.length,
						query: req.query	
					});
					response.end();
				}
			});
		});
	});
});

app.post('/getHTML', function(req, response) {
	var indexUrl = req.body.filing_index;
	indexUrl = indexUrl.replace('http', 'https')
	var txtUrl = indexUrl.split('-');
	txtUrl.pop();
	txtUrl = txtUrl.join('-') + '.txt';
	https.get(txtUrl, res => {
		res.setEncoding('utf8');
		let body = '';
		res.on('data', data => {
			body += data;
		});
		res.on('end', () => {
			var file = body.match(/<FILENAME>.*/g);
			//older filings don't have HTML files, redirect to the index
			if(file == null){
				response.writeHead(307, {
					Location: indexUrl
				});
				response.end();
			} else {
				file = file[0].split('>')[1];
				var htmlUrl = txtUrl.split('/');
				htmlUrl.pop()
				htmlUrl.push(file);
				htmlUrl = htmlUrl.join('/');
				response.writeHead(307, {
					Location: htmlUrl
				});
				response.end();
			}
		});
	});
});


//puts together the request url to the SEC server
function buildRequestPath(query){
	var baseUrl = 'https://www.sec.gov/cgi-bin/browse-edgar?';
	var queryParams = {
		action: 'getcompany',
		CIK: query.ticker_symbol,
		owner: 'exclude',
		start: (query.page - 1)*query.num_results,
		count: query.num_results,
		output: 'atom'
	};
	var queryString = toQueryString(queryParams);
	var requestUrl = baseUrl + queryString;
	return requestUrl;
}

//no need for jQuery
function toQueryString(obj){
	var parts = [];
	for(var i in obj){
		if (obj.hasOwnProperty(i)) {
			parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
		}
	}
	return parts.join('&');
}


app.listen(8000);
console.log('Listening on port 8000');