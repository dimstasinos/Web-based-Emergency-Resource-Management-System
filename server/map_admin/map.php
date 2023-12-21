<?php

include("../Mysql_connection.php");

$db = db_connect();
$features = array();


$mysql = "SELECT DISTINCT req_citizen_id FROM citizen_requests;";
$response = $db->query($mysql);

$check;

if ($response->num_rows > 0) {
  while ($requests_row = $response->fetch_assoc()) {

    $check = 0;
    $mysql = $db->prepare("SELECT f_name,l_name,phone_number,latitude,longitude FROM citizen
    where citizen_id=?");
    $mysql->bind_param("i", $requests_row["req_citizen_id"]);
    $mysql->execute();
    $citizen_rensponse = $mysql->get_result();
    $citizen_row = $citizen_rensponse->fetch_assoc();

    $citizen_data["first_name"] = $citizen_row["f_name"];
    $citizen_data["last_name"] = $citizen_row["l_name"];
    $citizen_data["phone_number"] = $citizen_row["phone_number"];
    $location["latitude"] = $citizen_row["latitude"];
    $location["longitude"] = $citizen_row["longitude"];

    $coordinates = array((float)$location["latitude"], (float)$location["longitude"]);
    $gemetry = array(
      "type" => "Point",
      "coordinates" => $coordinates
    );


    $mysql = $db->prepare("SELECT * FROM citizen_requests where req_citizen_id=?");
    $mysql->bind_param("i", $requests_row["req_citizen_id"]);
    $mysql->execute();
    $citizen_rensponse = $mysql->get_result();
    $requests_details = array();

    while ($citizen_row = $citizen_rensponse->fetch_assoc()) {

      $request_array["requert_id"] = $citizen_row["requert_id"];
      $request_array["submission_date"] = $citizen_row["submission_date"];
      $request_array["quantity"] = $citizen_row["persons"];
      $request_array["pickup_date"] = $citizen_row["pickup_date"];
      $request_array["vehicle_id"] = $citizen_row["req_veh_id"];
      $request_array["citizen_id"] = $citizen_row["req_citizen_id"];
      $request_array["item_id"] = $citizen_row["req_item_id"];

      $mysql = $db->prepare("SELECT item_name FROM items where item_id=?");
      $mysql->bind_param("i", $request_array["item_id"]);
      $mysql->execute();
      $item_rensponse = $mysql->get_result();
      $item_row = $item_rensponse->fetch_assoc();
      $request_array["item_name"] = $item_row["item_name"];

      if ($citizen_row["req_veh_id"] != null) {
        $mysql = $db->prepare("SELECT vehicle_username FROM vehicle where vehicle_id=?");
        $mysql->bind_param("i", $request_array["vehicle_id"]);
        $mysql->execute();
        $vehicle_rensponse = $mysql->get_result();
        $vehicle_row = $vehicle_rensponse->fetch_assoc();
        $request_array["vehicle_username"] = $vehicle_row["vehicle_username"];
      }else{
        $request_array["vehicle_username"] = null;
      }


      if ($citizen_row["req_veh_id"] == null) {
        $check = 1;
      }

      $requests_details[] = $request_array;
    }

    if ($check == 1) {
      $citizen_data["category"] = "Request Pending";
    } else {
      $citizen_data["category"] = "Request Accepted";
    }


    $citizen_data["details"] = $requests_details;
    $properties = $citizen_data;


    $feature = array(
      "type" => "Feature",
      "geometry" => $gemetry,
      "properties" => $properties,
    );
    $features[] = $feature;
  }
}









$mysql = "SELECT * from base";
$response = $db->query($mysql);
$response_row = $response->fetch_assoc();
$base_array = array(
  "latitude" => $response_row["latitude"],
  "longitude" => $response_row["longitude"],
);

$coordinates = array((float)$base_array["latitude"], (float)$base_array["longitude"]);
$gemetry = array(
  "type" => "Point",
  "coordinates" => $coordinates
);

$category["category"] = "Base";

$feature = array(
  "type" => "Feature",
  "geometry" => $gemetry,
  "properties" => $category,
);

$features[] = $feature;

$featureCollection = array(
  "type" => "FeatureCollection",
  "features" => $features,
);


header('Content-Type: application/json');
echo json_encode($featureCollection);
