#!/usr/bin/env node

var ayah = require('../index');
var http = require('http');
var querystring = require('querystring');

// get your own at http://www.areyouahuman.com/
// FIXME: add a command line prompt here for people to get started
ayah.configure(XXXXX, XXXXX);

http.createServer(function (request, response) {
		if (request.url !== "/") {
			response.setHeader('Content-Type', 'text/plain');
			response.write("404");
			return response.end();
		}

		var buf = '';
		request.on('data', function (data) {
			buf += data;
		});
		request.on('error', function (error) {
			console.log(error);
		});
		request.on('end', function () {
			if (buf.length) {
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
				response.setHeader('Content-Type', 'text/html');
				response.write('<html>');
				response.write('<body>');
				response.write('<form method="POST" action="/">');
				response.write(ayah.getPublisherHTML());
				response.write('<input type="submit"/>');
				response.write('</form>');
				response.write('</body>');
				response.write('</html>');
				response.end();
			}
		});
}).listen(8080);

console.log('http://localhost:8080/');
