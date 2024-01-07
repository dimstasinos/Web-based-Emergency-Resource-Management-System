<?php
include("../../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

try {

  $db = db_connect();
  $offer_items = $db->prepare("INSERT INTO offer_items 
  values (?,?,?)");
  $offer_items->bind_param(
    "iii",
    $data->id,
    $data->item_id,
    $data->quantity
  );
  $offer_items->execute();

  $db->close();
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
