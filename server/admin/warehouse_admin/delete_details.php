<?php

//PHP script το οποίπ δοαγράφει από ένα
//είδος μια λεπτομέρια

session_start();

include("../../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την διαγραφή της λεπτομέριας
  $delete_stmt = $db->prepare("DELETE FROM item_details WHERE
      item_detail_id=? AND item_detail_name=? AND item_detail_value=?");

  $delete_stmt->bind_param(
    "iss",
    $data->id,
    $data->detail_name,
    $data->detail_value
  );
  $delete_stmt->execute();

  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
