<?php
session_start();

include("../Mysql_connection.php");

try {

  $db = db_connect();
  $offer = $db->prepare("INSERT INTO citizen_offers values 
  (NULL,now(),NULL,NULL,?)");
  $offer->bind_param(
    "i",
    $_SESSION["user_id"]
  );
  $offer->execute();

  $offer_id = "SELECT LAST_INSERT_ID() as offer_id";
  $offer_id_responce =  $db->query($offer_id);
  $offer_id_row = $offer_id_responce->fetch_assoc();

  $data["id"] = $offer_id_row["offer_id"];

  $db->close();

  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
