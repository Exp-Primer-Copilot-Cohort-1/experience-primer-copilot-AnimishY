import http from 'http';

const server = http.createServer((_, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!');
});

server.listen(3000, 'localhost', () => {
    console.log('Server running at http://localhost:3000/');
});
