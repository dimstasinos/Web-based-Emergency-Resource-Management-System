<?php

//PHP script που εισάγει ένα νέο είδος
//στην βάση δεδομένων

session_start();

include("../../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την εισαγωγή του νέου είδους
  $add_stmt = $db->prepare("INSERT INTO items VALUES (?,?,?,0)");

  $add_stmt->bind_param(
    "isi",
    $data->id,
    $data->name,
    $data->category
  );
  $add_stmt->execute();

  $add_stmt->close();

  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
