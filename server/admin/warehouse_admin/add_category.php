<?php

//PHP script που προσθέτει μια νέα
//κατηγορία είδους στην βάση δεδομέων

session_start();

include("../../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την εισαγωγή της νέας κατηγορίας
  $add_stmt = $db->prepare("INSERT INTO item_category VALUES (?,?)");

  $add_stmt->bind_param(
    "is",
    $data->id,
    $data->new_cat
  );
  $add_stmt->execute();

  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
