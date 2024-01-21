<?php

//PHP script που ολοκληρώνει κάποιο αίτημα
//από το όχημα

session_start();

include("../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries που μεταφέρουν το αίτημα στον πίνακα των ολοκληρωμένων
  //και την αφαίρεση των προιόντων από το όχημα
  $request_complete = $db->prepare("INSERT INTO citizen_requests_complete
    SELECT *,now() FROM citizen_requests where request_id=?");
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
      "ii",
      $_SESSION["truck_id"],
      $data->item_id,
    );
    $delete_item->execute();
  }

  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage(), $data]);
}
