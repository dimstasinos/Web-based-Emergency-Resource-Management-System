<?php

//PHP script που ολοκληρώνει κάποια προσφορά
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

  //Queries που μεταφέρουν την προσφορά στον πίνακα των ολοκληρωμένων
  //και προσθήκη των προιοντων στο όχημα
  $offer_complete = $db->prepare("INSERT INTO citizen_offers_complete
  (offer_id,submission_date,pickup_date,offer_veh_id,offer_citizen_id,complete_date)
  SELECT offer_id,submission_date,pickup_date,offer_veh_id,offer_citizen_id,now()
   FROM citizen_offers where offer_id=?");
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

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage(), $data]);
}
