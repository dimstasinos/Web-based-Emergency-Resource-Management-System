<?php

include("../Mysql_connection.php");

$db = db_connect();

$mysql = "SELECT * FROM citizen_requests";
$response = $db->query($mysql);


$requests = array();

if ($response->num_rows > 0) {

  while ($row = $response->fetch_assoc()) {

    $request_array = array(
      "citizen_request_id" => $row["citizen_requert_id"],
      "submission_date" => $row["submission_date"],
      "quantity" => $row["persons"],
      "pickup_date" => $row["pickup_date"],
      "vehicle_id" => $row["req_veh_id"],
      "citizen_id" => $row["req_citizen_id"],
      "item_id" => $row["req_item_id"]
    );

    $mysql = $db->prepare("SELECT f_name,l_name,phone_number,lat,longi FROM citizen 
    INNER JOIN citizen_requests ON citizen.citizen_id=?");
    $mysql->bind_param("i", $row["req_citizen_id"]);
    $mysql->execute();
    $requests_rensponse = $mysql->get_result();
    $requests_row = $requests_rensponse->fetch_assoc();

    $request_array["first_name"] = $requests_row["f_name"];
    $request_array["last_name"] = $requests_row["l_name"];
    $request_array["phone_number"] = $requests_row["phone_number"];
    $request_array["lati"] = (string)$requests_row["lat"];
    $request_array["long"] = (string)$requests_row["longi"];

    $mysql = $db->prepare("SELECT item_name FROM items INNER JOIN 
    citizen_requests ON items.item_id=?");
    $mysql->bind_param("i", $row["req_item_id"]);
    $mysql->execute();
    $requests_rensponse = $mysql->get_result();
    $requests_row = $requests_rensponse->fetch_assoc();

    $request_array["item_name"] = $requests_row["item_name"];

    $mysql = $db->prepare("SELECT vehicle_username FROM vehicle 
    INNER JOIN citizen_requests ON vehicle.vehicle_id=?");
    $mysql->bind_param("i", $row["req_veh_id"]);
    $mysql->execute();
    $requests_rensponse = $mysql->get_result();

    if ($requests_rensponse->num_rows > 0) {
      $requests_row = $requests_rensponse->fetch_assoc();
      $request_array["veh_username"] = $requests_row["vehicle_username"];
    }else{
      $request_array["veh_username"] =null;
    }

    $requests[] = $request_array;
  }
}





$data = array(
  "requests" => $requests,
);


$db->close();

$json_data = json_encode($data);

header('Content-Type: application/json');

echo $json_data;
