const mysql = require('mysql2');

const database_connect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2002',
  database: 'web',
});



function validation(username, password){

  database_connect.connect(function(error) {

    if(error){
      console.error('Can\'t connect to Database:', error);
      return;
    }
    console.log('Connected to Database');
  });

  database_connect.query("SELECT * FROM users WHERE username=? AND password=?", [username, password] ,function(error, result,fields){
  
    if(result.length > 0){
      
      console.log(result);
      
      database_connect.end(); 
      return 1;
    }

    database_connect.end(); 
    return 0;
    
  });
};

module.exports = {
  validation,
};