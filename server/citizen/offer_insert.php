<?php

session_start();
session_start();

include("../Mysql_connection.php");
$receive = file_get_contents('php://input');
$data = json_decode($receive);

try {

  $db = db_connect();
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

  $json_data = json_encode($send);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
