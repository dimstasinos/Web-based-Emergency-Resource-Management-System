<?php

//PHP script που αλλάζει την τοποθεσία της
//βάσης

session_start();

include("../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Query για διαγραφή προηγούμενης θέσης
  //και αποθήκευση της νέας
  $delete_base_loc = "DELETE FROM base";
  $db->query($delete_base_loc);

  $update_base_loc = $db->prepare("INSERT INTO base VALUES (?,?)");

  $update_base_loc->bind_param(
    "dd",
    $data->lati,
    $data->long
  );

  $update_base_loc->execute();
  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage(), $data]);
}
