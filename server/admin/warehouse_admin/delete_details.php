<?php

session_start();
include("../../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();

try {
  $delete_stmt = $db->prepare("DELETE FROM item_details WHERE
      item_detail_id=? AND item_detail_name=? AND item_detail_value=?");

  $delete_stmt->bind_param(
    "iss",
    $data->id,
    $data->detail_name,
    $data->detail_value
  );

  $delete_stmt->execute();
  $db->close();

  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
