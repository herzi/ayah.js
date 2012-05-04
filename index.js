/**
 * ajah.js - the main module
 */

var AYAH = {};
var https = require('https');
var querystring = require('querystring');

var publisherKey;
var scoringKey;
var webServiceHost = "ws.areyouahuman.com";

AYAH.configure = function (newPublisherKey, newScoringKey) {
	publisherKey = newPublisherKey;
	scoringKey = newScoringKey;
};

AYAH.getPublisherHTML = function () {
	var url = 'https://' + webServiceHost + "/ws/script/" + encodeURI(publisherKey);
	
	return "<div id='AYAH'></div><script src='" + url  +"' type='text/javascript' language='JavaScript'></script>";
	// FIXME: try w/ async js loading
};

AYAH.getScore = function (sessionSecret, callback) {
	var data = querystring.stringify({session_secret: encodeURI(sessionSecret), scoring_key: scoringKey});
	https.request({
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		host: webServiceHost,
		method: "POST",
		path: "/ws/scoreGame"
	}, function (response) {
		if (response.statusCode !== 200) {
			return callback(new Error("the server returned status code " + response.statusCode), null);
		}
		var buf = '';
		response.on('data', function (data) {
			buf += data;
		});
		response.on('error', function (error) {
			callback(error, null);
		});
		response.on('end', function () {
			buf = JSON.parse(buf);
			if (buf.status_code !== 1) {
				return callback(new Error("the server sent an error response: " + buf.status_code), null);
			}
			callback(null, buf);
		});
	}).on('error', function (error) {
		return callback(error, null);
	}).end(data);
};

AYAH.recordConversion = function (sessionSecret) {
	return '<iframe style="border: none;" height="0" width="0" src="https://' +
		webServiceHost + '/ws/recordConversion/' +  encodeURI(sessionSecret) + '"></iframe>';
};

module.exports = AYAH;
