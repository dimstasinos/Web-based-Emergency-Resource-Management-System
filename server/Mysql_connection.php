<?php

function db_connect()
{

  $name = "localhost";
  $user = "root";


  $db = new mysqli($name, $user, $password, $database_name);

  if ($db->connect_error) {
    die("Connection Error: " . $db->connect_error);
  }

  return $db;
}

?>