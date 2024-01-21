<?php

//PHP script που εισάγει τα είδη της ανακοίνωσης

session_start();

include("../../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την εισαγή των προιόντων της ανακοίνωσης
  $announcement_items = $db->prepare("INSERT INTO announcement_items 
  values (?,?,?)");
  $announcement_items->bind_param(
    "iii",
    $data->id,
    $data->item_id,
    $data->quantity
  );
  $announcement_items->execute();

  //Κλέισιμο σύνδεσης με την βάση δεδομένων
  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
