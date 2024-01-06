<?php
include("../../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();
try {

  $announcement_items = $db->prepare("INSERT INTO announcement_items 
  values (?,?,?)");
  $announcement_items->bind_param(
    "iii",
    $data->id,
    $data->item_id,
    $data->quantity
  );
  $announcement_items->execute();

  $db->close();
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
