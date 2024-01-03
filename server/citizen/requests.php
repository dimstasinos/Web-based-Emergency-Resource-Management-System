<?php

session_start();

include("../Mysql_connection.php");

try {

  $db = db_connect();

  $request = $db->prepare("SELECT * FROM citizen_requests where
  req_citizen_id=?")

  $$db->close();

  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
