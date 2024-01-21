<?php

//PHP script που αλλάζει το όνομα μια κατηγορίας

session_start();
include("../../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();

try {

  $update_stmt = $db->prepare("UPDATE item_category SET category_name=? where 
  category_id=?");

  $update_stmt->bind_param(
    "si",
    $data->new_name,
    $data->id
  );

  $update_stmt->execute();
  $db->close();

  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
