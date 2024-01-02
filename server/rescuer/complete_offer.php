<?php
session_start();

include("../Mysql_connection.php");
$receive = file_get_contents('php://input');
$data = json_decode($receive);

try {
  $db = db_connect();

  $offer_complete = $db->prepare("INSERT INTO citizen_offers_complete
  SELECT * FROM citizen_offers where offer_id=?");
  $offer_complete->bind_param(
    "i",
    $data->id,
  );

  $offer_complete->execute();

  $offer_delete = $db->prepare("DELETE FROM citizen_offers where 
  offer_id=?");
  $offer_delete->bind_param(
    "i",
    $data->id,
  );
  $offer_delete->execute();

  $item_check = $db->prepare("SELECT str_quantity FROM vehicle_storage 
  where str_vehicle_id=? and str_item_id=?");
  $item_check->bind_param(
    "ii",
    $_SESSION["truck_id"],
    $data->item_id,
  );
  $item_check->execute();
  $item_check_response = $item_check->get_result();
  if ($item_check_response->num_rows > 0) {
    $item_check_row = $item_check_response->fetch_assoc();
    $new_quantity = (int)$item_check_row["str_quantity"] + (int)$data->quantity;
    $update_quantity = $db->prepare("UPDATE vehicle_storage
      SET str_quantity=? where str_vehicle_id=? and str_item_id=?");
    $update_quantity->bind_param(
      "iii",
      $new_quantity,
      $_SESSION["truck_id"],
      $data->item_id,
    );
    $update_quantity->execute();
  } else {
    $update_quantity = $db->prepare("INSERT INTO vehicle_storage VALUES (?,?,?)");
    $update_quantity->bind_param(
      "iii",
      $_SESSION["truck_id"],
      $data->item_id,
      $data->quantity,
    );
    $update_quantity->execute();
  }


  $db->close();

  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage(), $data]);
}
