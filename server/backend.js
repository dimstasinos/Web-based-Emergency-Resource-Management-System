const http = require("http");
const login = require('./login');
const host = `localhost`;
const port = 8000;

const server = http.createServer((req, res) => {

  

});


server.listen(port, ()=>{
  
  console.log(`Server running at http://${host}:${port}/`);

});