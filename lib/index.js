var Docker = require('dockerode');
var docker = new Docker();

module.exports = function (ws, options) {

    var attachOptions = {
        stream: true,
        stdin: true,
        stdout: true,
        stderr: true
    };

    docker.createContainer(options, function (err, container) {

        var line = '';

        container.attach(attachOptions, function(err, stream) {

            ws.on('message', function(message) {

                try {
                    message = JSON.parse(message);
                }
                catch(ex) {

                }

                if (message.type == 'compile') {
                    var source = new Buffer(message.source, 'base64').toString();
                    stream.write('printf \'' + source + '\' > main.cpp');
                    stream.write(String.fromCharCode(13));
                    stream.write('g++ main.cpp');
                    stream.write(String.fromCharCode(13));
                    stream.write('./a.out');
                    stream.write(String.fromCharCode(13));
                }
            });

            stream.on('data', function(chunk) {

                ws.send(chunk.toString(), function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });

            container.start(function(err, data) {

                ws.send('started');
            });
        });

        ws.on('close', function() {
            container.stop(function(err) {
                // FIXME: log the error

                container.remove(function(err) {
                    // FIXME: log the error
                    console.log(err || container.id + 'removed');
                });
            });
        });
    });
}
