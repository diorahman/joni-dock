var Ws = require('ws');
var St = require('st');
var Http = require('http');
var HttpHashRouter = require('http-hash-router');
var dock = require('./lib');

var router = HttpHashRouter();
router.set('*', St(__dirname + '/static'));

var port = process.env.PORT || 8000;
var server = Http.createServer(function handler(req, res) {
    router(req, res, {}, onError);

    function onError(err) {
        if (err) {
            res.statusCode = err.statusCode || 500;
            res.end(err.message);
        }
    }
});
var websocketServer = new Ws.Server({server: server});
websocketServer.on('connection', function(ws) {
    dock(ws, require('./opts'));
});
server.listen(port);

