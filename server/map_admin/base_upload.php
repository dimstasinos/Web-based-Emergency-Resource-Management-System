<?php
session_start();
include("../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

  
try {
  $db = db_connect();
  
  $delete_base_loc ="DELETE FROM base";
  $db->query($delete_base_loc);

  $update_base_loc = $db->prepare("INSERT INTO base VALUES (?,?)");

  $update_base_loc->bind_param(
    "dd",
    $data->lati,
    $data->long
  );

  $update_base_loc->execute();
  $db->close();

  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);

} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage(),$data]);
}
