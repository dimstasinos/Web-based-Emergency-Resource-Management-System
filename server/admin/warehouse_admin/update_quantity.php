<?php

include("../../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

try {
  $db = db_connect();

  $update_stmt = $db->prepare("UPDATE items SET item_quantity=? where 
  item_id=?");

  $update_stmt->bind_param(
    "ii",
    $data->quantity,
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

?>