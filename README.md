Are you a Human - node.js binding
=================================

How to use it
-------------

Install the module with npm:

    npm install ayah

Include in your project:

    var ayah = require('ayah');

Decorate your form with the PlayThru code:

    var form = "<form>" + ayah.getPublisherHTML() + /* add more form elements + */ "</form>";

Verify the game result:

    /* this can be within request.on('end', function () {…}) */
    var parsed = querystring.parse(buf); // buf starts with "" and gets filled during 'data' requests
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

For a full example, see `examples/server.js`.

