const mysql = require('mysql2');

const database_connect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2002',
  database: 'web',
});

database_connect.connect(e => {

  if(e){
    console.error('Can\'t connect to Database:', e);
    return;
  }
  console.log('Connected to Database');
});

function validation(username, password){

  

}