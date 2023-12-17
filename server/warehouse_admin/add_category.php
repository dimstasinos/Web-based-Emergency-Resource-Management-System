<?php

include("../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();

try {

  $add_stmt = $db->prepare("INSERT INTO item_category VALUES (?,?)");

  $add_stmt->bind_param(
    "is",
    $data->id,
    $data->new_cat
  );

  $add_stmt->execute();
  $db->close();

  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
?>