<?php

//PHP script που ξεφορτώνει το φορτίο του 
//στην βάση

session_start();

include("../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries που μεταφέρουν τα είδη από το όχημα στην βάση
  $unload_truck = $db->prepare("SELECT * from vehicle_storage
  where str_vehicle_id=?");
  $unload_truck->bind_param(
    "i",
    $_SESSION["truck_id"],
  );
  $unload_truck->execute();
  $unload_truck_response = $unload_truck->get_result();
  while ($unload_truck_row = $unload_truck_response->fetch_assoc()) {
    $old_quantity = $db->prepare("SELECT item_quantity from items
    where item_id=?");
    $old_quantity->bind_param(
      "i",
      $unload_truck_row["str_item_id"]
    );
    $old_quantity->execute();
    $old_quantity_response = $old_quantity->get_result();
    $old_quantity_row = $old_quantity_response->fetch_assoc();
    $new_quantity = (int)$old_quantity_row["item_quantity"] + (int)$unload_truck_row["str_quantity"];

    $update_quantity = $db->prepare("UPDATE items
    SET item_quantity=? where item_id=?");
    $update_quantity->bind_param(
      "ii",
      $new_quantity,
      $unload_truck_row["str_item_id"],
    );
    $update_quantity->execute();

    $delete_item = $db->prepare("DELETE FROM vehicle_storage where
    str_vehicle_id=? and str_item_id=?");

    $delete_item->bind_param(
      "ii",
      $_SESSION["truck_id"],
      $unload_truck_row["str_item_id"]
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
