#!/usr/bin/env node

var ayah = require('../index');
var fs = require('fs');
var http = require('http');
var querystring = require('querystring');

var config;

try {
	config = fs.readFileSync('config.json'); // {"publisherKey": "abc…", "scoringKey": "0123…"}
	config = JSON.parse(config);
} catch (e) {
	console.log("please create config.json from config.json.example: " + e);
	process.exit(1);
}
if (config.publisherKey.indexOf("get your") === 0) {
	console.log(config.publisherKey);
	console.log(config.scoringKey);
	process.exit(1);
}

ayah.configure(config.publisherKey, config.scoringKey);
var server = http.createServer(function (request, response) {
	console.log("got request for " + request.url);
	
	if (request.url !== "/") {
		response.setHeader('Content-Type', 'text/plain');
		response.write("404");
		return response.end();
	}
	
	var buf = '';
	request.on('data', function (data) {
		console.log("  got %d bytes…");
		buf += data;
	});
	request.on('error', function (error) {
		console.log(error);
	});
	request.on('end', function () {
		if (buf.length) {
			console.log("  collected %d bytes of data", buf.length);
			buf = querystring.parse(buf);
			ayah.getScore(buf.session_secret, function (error, result) {
				if (error) {
					response.setHeader('Content-Type', 'text/plain');
					response.statusCode = 500;
					response.write('' + error);
				} else {
					response.setHeader('Content-Type', 'text/html');
					response.write('<html><body><p>Your call was a success</p><pre>' + JSON.stringify(result) + '</pre>' + ayah.recordConversion() + '</html>');
				}
				response.end();
			});
		} else {
			console.log("  without data", buf.length);
			response.setHeader('Content-Type', 'text/html');
			response.write('<html>');
			response.write('<body>');
			response.write('<form method="POST" action="/">');
			response.write('<input type="input" value="Hello World!"/>');
			response.write(ayah.getPublisherHTML());
			response.write('<input type="submit"/>');
			response.write('</form>');
			response.write('</body>');
			response.write('</html>');
			response.end();
		}
	});
});

server.listen(8080);
console.log('the server is running on http://localhost:8080/');

