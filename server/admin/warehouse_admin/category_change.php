<?php

//PHP script που αλλάζει την κατηγορία
//από ένα είδος

session_start();

include("../../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την αλλαγή της κατηγορίας
  $update_cat_stmt = $db->prepare("UPDATE items SET item_category=?
  where item_id=?");

  $update_cat_stmt->bind_param(
    "ii",
    $data->new_cat,
    $data->id
  );
  $update_cat_stmt->execute();

  $db->close();


  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
