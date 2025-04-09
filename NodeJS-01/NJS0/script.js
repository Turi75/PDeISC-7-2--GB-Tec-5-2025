// server.mjs
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1  style="color: crimson;"> Esto es un titulo </h1>');
});

// starts a simple http server locally on port 3000
server.listen(8082, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:8082');
});

// run with `node server.mjs`
