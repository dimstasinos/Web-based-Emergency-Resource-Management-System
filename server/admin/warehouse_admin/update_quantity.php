<?php

//PHP script το οποίο ανανεώνει την
//ποσότητα κάπιου είδους

session_start();

include("../../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την ανανέωση της ποσότητας
  $update_stmt = $db->prepare("UPDATE items SET item_quantity=? where 
  item_id=?");

  $update_stmt->bind_param(
    "ii",
    $data->quantity,
    $data->id
  );
  $update_stmt->execute();

  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
