var opt = {
    'AttachStdin': true,
    'AttachStdout': true,
    'AttachStderr': true,
    'Tty': true,
    'OpenStdin': true,
    'StdinOnce': false,
    'Env': null,
    'Cmd': ['bash'],
    // put your image name here, I'm using the Dockerfile from files/Dockerfile
    // $ docker build -t='cpp' files
    'Image': 'cpp'
};

module.exports = opt;
