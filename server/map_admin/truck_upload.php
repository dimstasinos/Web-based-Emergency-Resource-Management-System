<?php

//PHP script που ανανεώνει την 
//τοποθεσία ενός οχήματος

session_start();

include("../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Query για ανανέωση της τοποθεσίας
  $update_truck_loc = $db->prepare("UPDATE vehicle SET latitude=?,longitude=?
  WHERE vehicle_id=?");

  $update_truck_loc->bind_param(
    "ddi",
    $data->lat,
    $data->lng,
    $data->id,
  );
  $update_truck_loc->execute();

  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage(), $data]);
}
