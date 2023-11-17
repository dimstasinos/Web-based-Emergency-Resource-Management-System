const http = require("http");
const host = 'localhost';
const port = 8000;

const requestListener = fuction (req, res) {
  res.writeHead(200);
  res.end("My first server!");
}