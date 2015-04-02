// Module dependencies.
var application_root = __dirname,
    express = require( 'express' );

function createVirtualHost(domainName, dirPath) {
    var vhost = express();
    //parses request body and populates request.body
    vhost.use( express.bodyParser() );
    //checks request.body for HTTP method overrides
    vhost.use( express.methodOverride() );
    //Where to serve static content
    vhost.use( express.static( dirPath ) );
    //Show errors
    vhost.use( express.errorHandler({ dumpExceptions: true, showStack: true }));

    return express.vhost(domainName, vhost)
}

//Create server
var app = express();

//Create the virtual hosts
var potatoHost = createVirtualHost("www.potato.com", "potato");
var tomatoHost = createVirtualHost("www.tomato.com", "tomato");

//Use the virtual hosts
app.use(potatoHost);
app.use(tomatoHost);

//Start server
var port = 80;
app.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
});