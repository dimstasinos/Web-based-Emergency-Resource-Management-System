<?php

//PHP script που εισάγει μια νέα 
//προσφορά στην βάση δεδομένων

session_start();

include("../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την εισαγωγή της νέας προσφοράς
  $offer = $db->prepare("INSERT INTO citizen_offers values 
  (NULL,now(),NULL,NULL,?,?)");
  $offer->bind_param(
    "ii",
    $_SESSION["user_id"],
    $data->announcement_id,
  );
  $offer->execute();

  $offer_id = "SELECT LAST_INSERT_ID() as offer_id";
  $offer_id_responce =  $db->query($offer_id);
  $offer_id_row = $offer_id_responce->fetch_assoc();

  $send["id"] = $offer_id_row["offer_id"];

  $db->close();

  //Αποστολή στον client το id της προσφοράς
  $json_data = json_encode($send);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
