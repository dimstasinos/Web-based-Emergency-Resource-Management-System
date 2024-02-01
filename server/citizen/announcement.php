<?php

//PHP script που στέλνει στον client
//τις ανακοινώσεις που περιέχει 
//η βάση δεδομένων

session_start();

include("../Mysql_connection.php");

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την ανάκτηση τως ανακοινώσεων
  $announcement = $db->prepare("SELECT * from announcements");
  $announcement->execute();
  $announcement_response = $announcement->get_result();

  $announcements = array();

  if ($announcement_response->num_rows > 0) {
    while ($announcement_row = $announcement_response->fetch_assoc()) {

      $announcements_array = array(
        "announcement_id" => $announcement_row["announcement_id"]
      );

      $announcement_items = $db->prepare("SELECT * FROM announcement_items where announcement_id=?");
      $announcement_items->bind_param("i", $announcement_row["announcement_id"]);
      $announcement_items->execute();
      $announcement_items_response = $announcement_items->get_result();

      $items = array();

      while ($announcement_items_row = $announcement_items_response->fetch_assoc()) {

        $item = $db->prepare("SELECT item_name FROM items where item_id=?");
        $item->bind_param("i", $announcement_items_row["announcement_item_id"]);
        $item->execute();
        $item_response = $item->get_result();
        $item_row = $item_response->fetch_assoc();
        $items_details = array(
          "item_name" => $item_row["item_name"],
          "item_id" => $announcement_items_row["announcement_item_id"],
          "quantity" => $announcement_items_row["announcement_item_quantity"]
        );
        $items[] = $items_details;
      }
      $announcements_array["items"] = $items;
      $announcements[] = $announcements_array;
    }
  }

  $data = $announcements;

  $db->close();

  //Αποστολή των ανακοινώσεων στον client
  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
