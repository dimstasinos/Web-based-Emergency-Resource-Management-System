<?php

//PHP script που αφαιρεί το αίτημα από τα tasks
//του οχήματος

session_start();

include("../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Query που αφαιρεί το αίτημα από τo όχημα
  $cancel_request = $db->prepare("UPDATE citizen_requests SET req_veh_id=NULL, pickup_date=NULL
  where request_id=?");
  $cancel_request->bind_param(
    "i",
    $data->id,
  );
  $cancel_request->execute();

  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage(), $data]);
}
