<?php

include("../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();

try {

  $update_stmt = $db->prepare("UPDATE item_quantity SET item_qua=? where 
  item_qua_id=?");

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
  echo json_encode(['status' => 'error', "Error: " . $error->getMessage()]);
}

?>