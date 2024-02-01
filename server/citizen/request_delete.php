<?php

//PHP script που αφαιρεί ένα αίτημα του πολίτη

session_start();

include("../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Query για την διαγραφή του αιτήματος
  $request_delete = $db->prepare("DELETE FROM citizen_requests where
  request_id=?");
  $request_delete->bind_param(
    "i",
    $data->id,
  );
  $request_delete->execute();

  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success', $data]);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
