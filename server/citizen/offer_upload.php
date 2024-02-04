<?php

//PHP script που εισάγει τα είδη της προσφοράς
//στην βάση δεδομένων

session_start();

include("../Mysql_connection.php");

//Παραλαβή δεδομένων από js
$receive = file_get_contents('php://input');

//Αποκωδικοποίηση δεδομένων
$data = json_decode($receive);

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();


  //Queries που εισάγουν τα είδη της προσφοράς
  //και τις πληροφορίες τους
  foreach ($data->items as $item) {
    $offer_items = $db->prepare("INSERT INTO offer_items 
    values (?,?,?)");

    $offer_items->bind_param(
      "iii",
      $data->offer_id,
      $item->item_id,
      $item->quantity
    );
    $offer_items->execute();

    //Query για το εάν η ανακοίνωση έχει άλλα είδη ή μπορεί
    //να σβηστεί
    $announcement_check = $db->prepare("SELECT * FROM announcement_items 
    where announcement_id=?");
    $announcement_check->bind_param(
      "i",
      $data->announcement_id
    );
    $announcement_check->execute();
    $announcement_response = $announcement_check->get_result();

    //Αφαίρεση είδους από την ανακοίνωση
    if ($announcement_response->num_rows > 1) {
      $announcement_delete = $db->prepare("DELETE FROM announcement_items
      where announcement_item_id=? and announcement_id=?");
      $announcement_delete->bind_param(
        "ii",
        $item->item_id,
        $data->announcement_id
      );
      $announcement_delete->execute();
    } else if ($announcement_response->num_rows == 1) {

      $announcement_delete = $db->prepare("DELETE FROM announcement_items
      where announcement_item_id=? and announcement_id=?");
      $announcement_delete->bind_param(
        "ii",
        $item->item_id,
        $data->announcement_id
      );
      $announcement_delete->execute();

      //Διαγραφή ανακοίνωσης
      $announcement_delete = $db->prepare("DELETE FROM announcements
      where announcement_id=?");
      $announcement_delete->bind_param(
        "i",
        $data->announcement_id
      );
      $announcement_delete->execute();
    }
  }


  $db->close();

  //Αποστολή μηνύματος επιτυχής εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
