<?php

//PHP script που διαγράφει μια προσφορά
//κάποιου πολίτη και την προσθέτει
//πάλι ως ανακοίνωση

session_start();

include("../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Query για την διαγραφή της προσφοράς
  $delete_offer = $db->prepare("DELETE FROM citizen_offers WHERE offer_id=?");
  $delete_offer->bind_param("i", $data->offer_id);
  $delete_offer->execute();

  //Queries για την προσθήκη της προσφοράς ως ανακοίνωση
  $announcement_check = $db->prepare("SELECT * from announcements where
   announcement_id=?");
  $announcement_check->bind_param("i", $data->announcement_id);
  $announcement_check->execute();
  $announcement_response = $announcement_check->get_result();

  //Εάν υπάρχει ήδη η ανακοίνωση
  if ($announcement_response->num_rows > 0) {
    foreach ($data->items as $item) {
      $announcement = $db->prepare("INSERT INTO announcement_items VALUES
    (?,?,?)");

      $announcement->bind_param(
        "iii",
        $data->announcement_id,
        $item->item_id,
        $item->quantity
      );
      $announcement->execute();
    }
  } else if ($announcement_response->num_rows == 0) {

    //Εάν δεν υπάρχει η ανακοίνωση θα προστίθεται
    $announcement_insert = $db->prepare("INSERT INTO announcements VALUES
      (NULL)");
    $announcement_insert->execute();

    $announcement_id = "SELECT LAST_INSERT_ID() as announcement_id";
    $announcement_id_responce =  $db->query($announcement_id);
    $announcement_id_row = $announcement_id_responce->fetch_assoc();
    foreach ($data->items as $item) {
      $announcement = $db->prepare("INSERT INTO announcement_items VALUES
        (?,?,?)");

      $announcement->bind_param(
        "iii",
        $announcement_id_row["announcement_id"],
        $item->item_id,
        $item->quantity
      );
      $announcement->execute();
    }
  }

  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success', $data]);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
