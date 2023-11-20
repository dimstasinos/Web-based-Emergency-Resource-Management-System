const http = require("http");
const login = require('./login');
const host = `localhost`;
const port = 8000;


login.validation("test",123);

const server = http.createServer();

