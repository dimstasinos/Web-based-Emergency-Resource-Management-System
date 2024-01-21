<?php

//PHP script για το ανέβασμα ενός
//αιτήματος του πολίτη στην βάση
//δεδομένων

session_start();

include("../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Quary για την πρσθήκη του αιτήματος στην βάση δεδομένων
  $request = $db->prepare("INSERT INTO citizen_requests VALUES
  (NULL,now(),?,NULL,NULL,?,?)");
  $request->bind_param(
    "iii",
    $data->quantity,
    $_SESSION["user_id"],
    $data->id
  );
  $request->execute();

  $db->close();

   //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
