<?php
session_start();

include("../Mysql_connection.php");
$receive = file_get_contents('php://input');
$data = json_decode($receive);

try {
  $db = db_connect();

  $request_complete = $db->prepare("INSERT INTO citizen_requests_complete
    SELECT * FROM citizen_requests where request_id=?");
  $request_complete->bind_param(
    "i",
    $data->id,
  );

  $request_complete->execute();

  $request_delete = $db->prepare("DELETE FROM citizen_requests where 
    request_id=?");
  $request_delete->bind_param(
    "i",
    $data->id,
  );
  $request_delete->execute();

  $quantity_check = $db->prepare("SELECT str_quantity FROM vehicle_storage
  WHERE str_vehicle_id=? and str_item_id=?");
  $quantity_check->bind_param(
    "ii",
    $_SESSION["truck_id"],
    $data->item_id,
  );
  $quantity_check->execute();
  $quantity_check_response = $quantity_check->get_result();
  $quantity_row = $quantity_check_response->fetch_assoc();

  if ((int)$data->quantity < (int)$quantity_row["str_quantity"]) {
    $new_quantity = (int)$quantity_row["str_quantity"] - (int)$data->quantity;
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
    $delete_item = $db->prepare("DELETE FROM vehicle_storage where
    str_vehicle_id=? and str_item_id=?");
    $delete_item->bind_param(
      "i",
      $data->item_id,
    );
    $delete_item->execute();
  }

  $db->close();

  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage(), $data]);
}
