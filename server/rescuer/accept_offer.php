<?php

//PHP script που προσθέτει μια προσφορά
//ως επιλεγμένη από το όχημα

session_start();

include("../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Query που ανανεώνει την προσφορά σε επιλεγμένη
  $citizen_request_update = $db->prepare("UPDATE citizen_offers SET pickup_date=now(), offer_veh_id=?
  where offer_id=?");
  $citizen_request_update->bind_param(
    "ii",
    $_SESSION["truck_id"],
    $data->offer,
  );
  $citizen_request_update->execute();

  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage(), $data]);
}
