<?php

//PHP script που αλλάζει το όνομα μια κατηγορίας

session_start();

include("../../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);


try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την αλλαγή του ονόματος
  $update_stmt = $db->prepare("UPDATE item_category SET category_name=? where 
  category_id=?");

  $update_stmt->bind_param(
    "si",
    $data->new_name,
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
