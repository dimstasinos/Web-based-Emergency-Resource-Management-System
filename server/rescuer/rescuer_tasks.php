<?php

//PHP tasks που στέλνει στον client
//όλα τα tasks του οχήματος

session_start();

include("../Mysql_connection.php");

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries που εξάγουν τις πληροφορίες για τα tasks του οχήματος
  $request_task = $db->prepare("SELECT * FROM citizen_requests WHERE req_veh_id=?");
  $request_task->bind_param("i", $_SESSION["truck_id"]);
  $request_task->execute();
  $request_task_response = $request_task->get_result();
  $requests = array();
  if ($request_task_response->num_rows > 0) {
    while ($request_task_row = $request_task_response->fetch_assoc()) {

      $request_task_array = array(
        "request_id" => $request_task_row["request_id"],
        "submission_date" => $request_task_row["submission_date"],
        "quantity" => $request_task_row["persons"],
        "citizen_id" => $request_task_row["req_citizen_id"],
        "item_id" => $request_task_row["req_item_id"],
      );


      $item = $db->prepare("SELECT item_name FROM items where item_id=?");
      $item->bind_param("i", $request_task_row["req_item_id"]);
      $item->execute();
      $item_response = $item->get_result();
      $item_row = $item_response->fetch_assoc();
      $request_task_array["item_name"] = $item_row["item_name"];


      $citizen = $db->prepare("SELECT f_name,l_name,phone_number FROM citizen where citizen_id=?");
      $citizen->bind_param("i", $request_task_row["req_citizen_id"]);
      $citizen->execute();
      $citizen_response = $citizen->get_result();
      $citizen_row = $citizen_response->fetch_assoc();
      $request_task_array["citizen_name"] = $citizen_row["f_name"] . " " . $citizen_row["l_name"];
      $request_task_array["phone_number"] = $citizen_row["phone_number"];

      $requests[] = $request_task_array;
    }
  }

  $offer_task = $db->prepare("SELECT * FROM citizen_offers WHERE offer_veh_id=?");
  $offer_task->bind_param("i", $_SESSION["truck_id"]);
  $offer_task->execute();
  $offer_task_response = $offer_task->get_result();
  $offers = array();

  if ($offer_task_response->num_rows > 0) {
    while ($offer_task_row = $offer_task_response->fetch_assoc()) {

      $offer_task_array = array(
        "offer_id" => $offer_task_row["offer_id"],
        "submission_date" => $offer_task_row["submission_date"],
        "citizen_id" => $offer_task_row["offer_citizen_id"],
      );

      $item_offer = $db->prepare("SELECT * FROM offer_items WHERE offer_id_item=?");
      $item_offer->bind_param("i",  $offer_task_row["offer_id"]);
      $item_offer->execute();
      $item_offer_response = $item_offer->get_result();
      $items = array();

      while ($item_offer_row = $item_offer_response->fetch_assoc()) {

        $item = $db->prepare("SELECT item_name FROM items where item_id=?");
        $item->bind_param("i", $item_offer_row["item_id_offer"]);
        $item->execute();
        $item_response = $item->get_result();
        $item_row = $item_response->fetch_assoc();
        $item_array = array(
          "item_id" =>  $item_offer_row["item_id_offer"],
          "item_name" => $item_row["item_name"],
          "quantity" => $item_offer_row["quantity"],
        );

        $items[] = $item_array;
      }

      $citizen = $db->prepare("SELECT f_name,l_name,phone_number FROM citizen where citizen_id=?");
      $citizen->bind_param("i", $offer_task_row["offer_citizen_id"]);
      $citizen->execute();
      $citizen_response = $citizen->get_result();
      $citizen_row = $citizen_response->fetch_assoc();
      $offer_task_array["citizen_name"] = $citizen_row["f_name"] . " " . $citizen_row["l_name"];
      $offer_task_array["phone_number"] = $citizen_row["phone_number"];
      $offer_task_array["items"] = $items;

      $offers[] = $offer_task_array;
    }
  }


  $data = array(
    "requests" => $requests,
    "offers" => $offers,
  );

  //Αποστολή του JSON στον client
  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
