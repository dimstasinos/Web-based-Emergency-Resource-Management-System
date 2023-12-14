<?php


function db_connect()
{

  $name = "localhost";
  $user = "root";
<<<<<<< HEAD
  $password = "7458";
=======
  $password = "3003";
>>>>>>> 0bef056781a0c75b53246150956b1ebdc53871b9
  $database_name = "project";

  $db = new mysqli($name, $user, $password, $database_name);

  if ($db->connect_error) {
    die("Connection Error: " . $db->connect_error);
  }

  return $db;
}

?>