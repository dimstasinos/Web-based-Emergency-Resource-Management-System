<?php

//PHP script το οποίο ανανεώνει μια λεπτομέρια
//κάποιου είδους

session_start();

include("../../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Querie για την αλλαγή της λεπτομέριας
  $update_stmt = $db->prepare("UPDATE item_details SET item_detail_name
  =?, item_detail_value=? where item_detail_id=?
  and item_detail_name=? and item_detail_value=?");

  $update_stmt->bind_param(
    "ssiss",
    $data->new_name,
    $data->new_value,
    $data->id,
    $data->prev_product_name,
    $data->prev_product_value
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
