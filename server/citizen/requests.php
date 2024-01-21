<?php

//PHP script που στέλνει στον client
//όλα τα αιτήματα του πολίτη

session_start();

include("../Mysql_connection.php");

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την δημιουργία JSON με τα αιτήματα
  //του πολίτη
  $request = $db->prepare("SELECT * FROM citizen_requests where
  req_citizen_id=?");
  $request->bind_param("i", $_SESSION["user_id"]);
  $request->execute();
  $request_response = $request->get_result();

  $requests = array();

  if ($request_response->num_rows > 0) {
    while ($request_row = $request_response->fetch_assoc()) {
      $request_task_array = array(
        "request_id" => $request_row["request_id"],
        "submission_date" => $request_row["submission_date"],
        "quantity" => $request_row["persons"],
        "pickup_date" => $request_row["pickup_date"],
        "citizen_id" => $request_row["req_citizen_id"],
        "req_veh_id" => $request_row["req_veh_id"],
        "item_id" => $request_row["req_item_id"],
      );

      $item = $db->prepare("SELECT item_name FROM items where item_id=?");
      $item->bind_param("i", $request_row["req_item_id"]);
      $item->execute();
      $item_response = $item->get_result();
      $item_row = $item_response->fetch_assoc();
      $request_task_array["item_name"] = $item_row["item_name"];

      if ($request_row["req_veh_id"] != NULL) {
        $vehicle = $db->prepare("SELECT vehicle_username FROM vehicle where vehicle_id=?");
        $vehicle->bind_param("i", $request_row["req_veh_id"]);
        $vehicle->execute();
        $vehicle_response = $vehicle->get_result();
        $vehicle_row = $vehicle_response->fetch_assoc();
        $request_task_array["vehicle_username"] = $vehicle_row["vehicle_username"];
      } else {
        $request_task_array["vehicle_username"] = NULL;
      }

      $requests[] = $request_task_array;
    }
  }

  $request = $db->prepare("SELECT * FROM citizen_requests_complete where
  req_citizen_id=?");
  $request->bind_param("i", $_SESSION["user_id"]);
  $request->execute();
  $request_response = $request->get_result();

  if ($request_response->num_rows > 0) {
    while ($request_row = $request_response->fetch_assoc()) {
      $request_task_array = array(
        "request_id" => $request_row["request_id"],
        "submission_date" => $request_row["submission_date"],
        "quantity" => $request_row["persons"],
        "pickup_date" => $request_row["pickup_date"],
        "citizen_id" => $request_row["req_citizen_id"],
        "req_veh_id" => $request_row["req_veh_id"],
        "item_id" => $request_row["req_item_id"],
        "complete_date" => $request_row["complete_date"],
      );

      $item = $db->prepare("SELECT item_name FROM items where item_id=?");
      $item->bind_param("i", $request_row["req_item_id"]);
      $item->execute();
      $item_response = $item->get_result();
      $item_row = $item_response->fetch_assoc();
      $request_task_array["item_name"] = $item_row["item_name"];

      $vehicle = $db->prepare("SELECT vehicle_username FROM vehicle where vehicle_id=?");
      $vehicle->bind_param("i", $request_row["req_veh_id"]);
      $vehicle->execute();
      $vehicle_response = $vehicle->get_result();
      $vehicle_row = $vehicle_response->fetch_assoc();
      $request_task_array["vehicle_username"] = $vehicle_row["vehicle_username"];

      $requests[] = $request_task_array;
    }
  }

  $data = $requests;

  //Αποστολή του JSON στον client
  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {
  
  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
