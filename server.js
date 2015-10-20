var Ws = require('ws');
var Fs = require('fs');
var Docker = require('dockerode');

var Server = Ws.Server;
var port = process.env.PORT || 8000;
var server = new Server({port: port});

// FIXME: stat the docket socket first!
var docker = new Docker();

server.on('connection', function (ws) {
    ws.send('please wait...');
    docker.createContainer(require('./opt'), function(err, container) {

        var attachOptions = {
            stream: true,
            stdin: true,
            stdout: true,
            stderr: true
        };

        var line = '';

        container.attach(attachOptions, function(err, stream) {

            ws.send('attached.');

            ws.on('message', function(message) {
                stream.write(message);
                stream.write(String.fromCharCode(13));
            });

            stream.on('data', function(chunk) {
                var str = chunk.toString();
                for (var i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) === 13) {
                        ws.send(line);
                        line = '';
                    }
                    line += str.charAt(i);
                }
            });

            container.start(function(err, data) {

                ws.send('started.');

                container.wait(function(err) {

                    // FIXME: cleanup

                });
            });
        });
    });

    ws.on('close', function() {
        // FIXME: stop and remove container
    });
});

console.log('~> running at', port);
console.log('To connect you can use wscat (npm install -g wscat)');
console.log('$ wscat -c ws://localhost:' + port);
