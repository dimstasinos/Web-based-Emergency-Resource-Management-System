<?php

$name = "localhost";
$user="root";
$password= "2002";


$db = new mysqli($name,$user,$password);

if($db->connect_error){
  die("Connection Error: " .$db->connect_error);
}

echo "Connected to database";
?>