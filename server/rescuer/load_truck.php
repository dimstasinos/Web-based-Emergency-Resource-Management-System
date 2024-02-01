<?php

//PHP script που τοποθετεί τα είδη που έχουν 
//επιλεχθεί στο φορτίο του οχήματος

session_start();

include("../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την τοποθέτηση των ειδών στο φορτίο του οχήαμτος
  $load_truck_check = $db->prepare("SELECT * from vehicle_storage
  where str_vehicle_id=? and str_item_id=?");
  $load_truck_check->bind_param(
    "ii",
    $_SESSION["truck_id"],
    $data->id,
  );
  $load_truck_check->execute();
  $load_truck_check_response = $load_truck_check->get_result();

  if ($load_truck_check_response->num_rows > 0) {
    $load_truck_check_row = $load_truck_check_response->fetch_assoc();

    $new_quantity = (int)$load_truck_check_row["str_quantity"] + (int)$data->quantity;
    $load_truck = $db->prepare("UPDATE vehicle_storage SET
    str_quantity=? where str_vehicle_id=? and str_item_id=?");
    $load_truck->bind_param(
      "iii",
      $new_quantity,
      $_SESSION["truck_id"],
      $data->id,
    );
    $load_truck->execute();
  } else {

    $load_truck = $db->prepare("INSERT INTO vehicle_storage VALUES
    (?,?,?)");
    $load_truck->bind_param(
      "iii",
      $_SESSION["truck_id"],
      $data->id,
      $data->quantity,
    );
    $load_truck->execute();
  }

  $old_quantity = $db->prepare("SELECT item_quantity from items
  where item_id=?");
  $old_quantity->bind_param(
    "i",
    $data->id
  );
  $old_quantity->execute();
  $old_quantity_response = $old_quantity->get_result();
  $old_quantity_row = $old_quantity_response->fetch_assoc();
  $new_quantity = (int)$old_quantity_row["item_quantity"] - (int)$data->quantity;

  $update_quantity = $db->prepare("UPDATE items
  SET item_quantity=? where item_id=?");
  $update_quantity->bind_param(
    "ii",
    $new_quantity,
    $data->id,
  );
  $update_quantity->execute();

  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage(), $data]);
}
