<?php

//PHP script που εξάγει τα είδη, τις πληροφοίες τους
//και τις κατηγορίες της βάσης δεδομένων

session_start();

include("../Mysql_connection.php");

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την εξαγωγή των πληροφορίών σε JSON
  //δομή
  $mysql = "SELECT * from items";
  $response = $db->query($mysql);

  $items = array();

  if ($response->num_rows > 0) {

    while ($row = $response->fetch_assoc()) {
      $item_array = array(
        "id" => $row["item_id"],
        "name" => $row["item_name"],
        "category" => $row["item_category"],
        "quantity" => $row["item_quantity"]
      );

      $details = array();
      $mysql = $db->prepare("SELECT * FROM item_details where item_detail_id=?");
      $mysql->bind_param("i", $row["item_id"]);
      $mysql->execute();
      $details_response = $mysql->get_result();

      if ($details_response->num_rows > 0) {
        while ($det_row = $details_response->fetch_assoc()) {
          $detail_array = array(
            "detail_name" => $det_row["item_detail_name"],
            "detail_value" => $det_row["item_detail_value"]
          );
          $details[] = $detail_array;
        }
      }

      $item_array["details"] = $details;

      $items[] = $item_array;
    }
  }

  $mysql = "SELECT * from item_category";
  $response = $db->query($mysql);

  $categories = array();

  if ($response->num_rows > 0) {
    while ($row = $response->fetch_assoc()) {
      $category = array(
        "id" => $row['category_id'],
        "category_name" => $row['category_name']
      );
      $categories[] = $category;
    }
  }

  //Συλλογή των πληροφοριων
  $data = array(
    "items" => $items,
    "categories" => $categories,
  );

  $db->close();

  //Αποστολή του JSON στον client
  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
