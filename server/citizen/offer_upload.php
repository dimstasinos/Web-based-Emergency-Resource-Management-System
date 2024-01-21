<?php
session_start();
include("../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

try {

  $db = db_connect();


  foreach ($data->items as $item) {
    $offer_items = $db->prepare("INSERT INTO offer_items 
  values (?,?,?)");

    $offer_items->bind_param(
      "iii",
      $data->offer_id,
      $item->item_id,
      $item->quantity
    );
    $offer_items->execute();

    $announcement_check = $db->prepare("SELECT * FROM announcement_items 
  where announcement_id=?");
    $announcement_check->bind_param(
      "i",
      $data->announcement_id
    );
    $announcement_check->execute();
    $announcement_response = $announcement_check->get_result();

    if ($announcement_response->num_rows > 1) {
      $announcement_delete = $db->prepare("DELETE FROM announcement_items
    where announcement_item_id=? and announcement_id=?");
      $announcement_delete->bind_param(
        "ii",
        $item->item_id,
        $data->announcement_id
      );
      $announcement_delete->execute();
    } else if ($announcement_response->num_rows == 1) {
      $announcement_delete = $db->prepare("DELETE FROM announcements
    where announcement_id=?");
      $announcement_delete->bind_param(
        "i",
        $data->announcement_id
      );
      $announcement_delete->execute();
    }
  }


  $db->close();
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
