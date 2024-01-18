<?php

session_start();

include("Mysql_connection.php");

try{






} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}