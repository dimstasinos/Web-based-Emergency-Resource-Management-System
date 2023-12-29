<?php

include("../Mysql_connection.php");

$db = db_connect();
$features = array();


$mysql = "SELECT DISTINCT req_citizen_id FROM citizen_requests;";
$response = $db->query($mysql);

$check = 0;

if ($response->num_rows > 0) {
  while ($requests_row = $response->fetch_assoc()) {

    $check = 0;
    $citizen_info = $db->prepare("SELECT f_name,l_name,phone_number,latitude,longitude FROM citizen
    where citizen_id=?");
    $citizen_info->bind_param("i", $requests_row["req_citizen_id"]);
    $citizen_info->execute();
    $citizen_response = $citizen_info->get_result();
    $citizen_row = $citizen_response->fetch_assoc();

    $citizen_data["citizen_id"] = $requests_row["req_citizen_id"];
    $citizen_data["first_name"] = $citizen_row["f_name"];
    $citizen_data["last_name"] = $citizen_row["l_name"];
    $citizen_data["phone_number"] = $citizen_row["phone_number"];
    $location["latitude"] = $citizen_row["latitude"];
    $location["longitude"] = $citizen_row["longitude"];

    $coordinates = array((float)$location["latitude"], (float)$location["longitude"]);
    $geometry = array(
      "type" => "Point",
      "coordinates" => $coordinates
    );


    $request_citizen = $db->prepare("SELECT * FROM citizen_requests where req_citizen_id=?");
    $request_citizen->bind_param("i", $requests_row["req_citizen_id"]);
    $request_citizen->execute();
    $requests_response  = $request_citizen->get_result();

    $requests_details = array();

    while ($citizen_request_row = $requests_response->fetch_assoc()) {


      $request_array = array(
        "request_id" => $citizen_request_row["request_id"],
        "submission_date" => $citizen_request_row["submission_date"],
        "quantity" => $citizen_request_row["persons"],
        "pickup_date" => $citizen_request_row["pickup_date"],
        "vehicle_id" => $citizen_request_row["req_veh_id"],
        "citizen_id" => $citizen_request_row["req_citizen_id"],
        "item_id" => $citizen_request_row["req_item_id"]
      );

      $item_info = $db->prepare("SELECT item_name FROM items where item_id=?");
      $item_info->bind_param("i", $request_array["item_id"]);
      $item_info->execute();
      $item_rensponse = $item_info->get_result();
      $item_row = $item_rensponse->fetch_assoc();
      $request_array["item_name"] = $item_row["item_name"];

      if ($citizen_request_row["req_veh_id"] != null) {
        $vehicle_info = $db->prepare("SELECT vehicle_username FROM vehicle where vehicle_id=?");
        $vehicle_info->bind_param("i", $request_array["vehicle_id"]);
        $vehicle_info->execute();
        $vehicle_rensponse = $vehicle_info->get_result();
        $vehicle_row = $vehicle_rensponse->fetch_assoc();
        $request_array["vehicle_username"] = $vehicle_row["vehicle_username"];
      } else {
        $request_array["vehicle_username"] = null;
      }


      if ($citizen_request_row["req_veh_id"] == null) {
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



    $feature = array(
      "type" => "Feature",
      "geometry" => $geometry,
      "properties" => $citizen_data,
    );

    $features[] = $feature;
  }
}


$citizen_offer = "SELECT DISTINCT offer_citizen_id FROM citizen_offers;";
$response = $db->query($citizen_offer);

$check = 0;


if ($response->num_rows > 0) {
  while ($offer_row = $response->fetch_assoc()) {

    $check = 0;

    $citizen_info = $db->prepare("SELECT f_name,l_name,phone_number,latitude,longitude FROM citizen
    where citizen_id=?");
    $citizen_info->bind_param("i", $offer_row["offer_citizen_id"]);
    $citizen_info->execute();
    $citizen_rensponse = $citizen_info->get_result();
    $citizen_row = $citizen_rensponse->fetch_assoc();

    $citizen_data["citizen_id"] = $offer_row["offer_citizen_id"];
    $citizen_data["first_name"] = $citizen_row["f_name"];
    $citizen_data["last_name"] = $citizen_row["l_name"];
    $citizen_data["phone_number"] = $citizen_row["phone_number"];
    $location["latitude"] = $citizen_row["latitude"];
    $location["longitude"] = $citizen_row["longitude"];

    $coordinates = array((float)$location["latitude"], (float)$location["longitude"]);
    $geometry = array(
      "type" => "Point",
      "coordinates" => $coordinates
    );

    $offer_citizen = $db->prepare("SELECT * FROM citizen_offers where offer_citizen_id=?");
    $offer_citizen->bind_param("i", $offer_row["offer_citizen_id"]);
    $offer_citizen->execute();
    $offer_rensponse = $offer_citizen->get_result();
    $offer_details = array();

    while ($citizen_offer_row = $offer_rensponse->fetch_assoc()) {


      $offer_array = array(
        "offer_id" => $citizen_offer_row["offer_id"],
        "submission_date" => $citizen_offer_row["submission_date"],
        "pickup_date" => $citizen_offer_row["pickup_date"],
        "vehicle_id" => $citizen_offer_row["offer_veh_id"],
        "citizen_id" => $citizen_offer_row["offer_citizen_id"]
      );


      $item_info = $db->prepare("SELECT * FROM offer_items where offer_id_item=?");
      $item_info->bind_param("i", $offer_array["offer_id"]);
      $item_info->execute();
      $item_rensponse = $item_info->get_result();
      $items_info = array();

      while ($item_row = $item_rensponse->fetch_assoc()) {

        $item_details = array(
          "item_id" => $item_row["item_id_offer"],
          "quantity" =>  $item_row["quantity"]
        );



        $item_name = $db->prepare("SELECT item_name FROM items where item_id=?");
        $item_name->bind_param("i", $item_details["item_id"]);
        $item_name->execute();
        $item_rensponse_name = $item_name->get_result();
        $item_name_row = $item_rensponse_name->fetch_assoc();
        $item_details["item_name"] = $item_name_row["item_name"];

        $items_info[] = $item_details;
      }


      if ($citizen_offer_row["offer_veh_id"] != null) {
        $vehicle_info = $db->prepare("SELECT vehicle_username FROM vehicle where vehicle_id=?");
        $vehicle_info->bind_param("i", $offer_array["vehicle_id"]);
        $vehicle_info->execute();
        $vehicle_rensponse = $vehicle_info->get_result();
        $vehicle_row = $vehicle_rensponse->fetch_assoc();
        $offer_array["vehicle_username"] = $vehicle_row["vehicle_username"];
      } else {
        $offer_array["vehicle_username"] = null;
      }

      $offer_array["items"] = $items_info;

      if ($citizen_offer_row["offer_veh_id"] == null) {
        $check = 1;
      }

      $offer_details[] = $offer_array;
    }

    if ($check == 1) {
      $citizen_data["category"] = "Offer Pending";
    } else {
      $citizen_data["category"] = "Offer Accepted";
    }

    $citizen_data["details"] = $offer_details;


    $feature = array(
      "type" => "Feature",
      "geometry" => $geometry,
      "properties" => $citizen_data,
    );
    $features[] = $feature;
  }
}



$truck_info = "SELECT * FROM vehicle";
$truck_response = $db->query($truck_info);

$truck_check = 0;

if ($truck_response->num_rows > 0) {
  while ($truck_row = $truck_response->fetch_assoc()) {
    $truck_check = 0;
    $truck_array = array(
      "vehicle_id" => $truck_row["vehicle_id"],
      "vehicle_username" => $truck_row["vehicle_username"]
    );

    $location["latitude"] = $truck_row["latitude"];
    $location["longitude"] = $truck_row["longitude"];

    $coordinates = array((float)$location["latitude"], (float)$location["longitude"]);
    $geometry = array(
      "type" => "Point",
      "coordinates" => $coordinates
    );


    $storage_veh_req = $db->prepare("SELECT * FROM citizen_requests where req_veh_id=?");
    $storage_veh_req->bind_param("i", $truck_array["vehicle_id"]);
    $storage_veh_req->execute();
    $storage_response_req  = $storage_veh_req->get_result();

    if ($storage_response_req->num_rows > 0) {
      $truck_check = 1;
    }

    $cargo_array_req = array();

    while ($storage_req_row = $storage_response_req->fetch_assoc()) {
      $storage_array = array(
        "request_id" => $storage_req_row["request_id"],
        "quantity" => $storage_req_row["persons"],
        "item_id" => $storage_req_row["req_item_id"]
      );

      $item_name = $db->prepare("SELECT item_name FROM items where item_id=?");
      $item_name->bind_param("i", $storage_req_row["req_item_id"]);
      $item_name->execute();
      $item_rensponse_name = $item_name->get_result();
      $item_name_row = $item_rensponse_name->fetch_assoc();
      $storage_array["item_name"] = $item_name_row["item_name"];





      $cargo_array_req[] = $storage_array;
    }


    $storage_veh_off = $db->prepare("SELECT offer_id FROM citizen_offers where offer_veh_id=?");
    $storage_veh_off->bind_param("i", $truck_array["vehicle_id"]);
    $storage_veh_off->execute();
    $storage_response_off  = $storage_veh_off->get_result();

    if ($storage_response_off->num_rows > 0) {
      $truck_check = 1;
    }
    $cargo_array_off = array();

    while ($storage_off_row = $storage_response_off->fetch_assoc()) {

      $item_offers = $db->prepare("SELECT * FROM offer_items where offer_id_item=?");
      $item_offers->bind_param("i", $storage_off_row["offer_id"]);
      $item_offers->execute();
      $item_rensponse = $item_offers->get_result();

      $items = array();

      while ($item_row = $item_rensponse->fetch_assoc()) {

        $item_array = array(
          "item_id" => $item_row["item_id_offer"],
          "quantity" => $item_row["quantity"],
        );

        $item_name = $db->prepare("SELECT item_name FROM items where item_id=?");
        $item_name->bind_param("i",  $item_array["item_id"]);
        $item_name->execute();
        $item_rensponse_name = $item_name->get_result();
        $item_name_row = $item_rensponse_name->fetch_assoc();
        $item_array["item_name"] = $item_name_row["item_name"];


        $items[] = $item_array;
      }
      $offer = array(
        "offer_id" => $storage_off_row["offer_id"],
        "items" => $items
      );

      $cargo_array_off[] = $offer;
    }

    $cargo = array();
    $cargo_vehicle = $db->prepare("SELECT str_item_id,str_quantity FROM vehicle_storage where str_vehicle_id=?");
    $cargo_vehicle->bind_param("i", $truck_row["vehicle_id"]);
    $cargo_vehicle->execute();
    $cargo_response = $cargo_vehicle->get_result();
    if ($cargo_response->num_rows > 0) {
      while ($cargo_vehicle_row = $cargo_response->fetch_assoc()) {
      
        $item_array = array(
          "item_id" => $cargo_vehicle_row["str_item_id"],
          "quantity" => $cargo_vehicle_row["str_quantity"],
        );

        $item_name = $db->prepare("SELECT item_name FROM items where item_id=?");
        $item_name->bind_param("i",  $item_array["item_id"]);
        $item_name->execute();
        $item_rensponse_name = $item_name->get_result();
        $item_name_row = $item_rensponse_name->fetch_assoc();
        $item_array["item_name"] = $item_name_row["item_name"];
      
         $cargo[]=$item_array;
      }

      
    }

    if ($truck_check == 1) {
      $truck_array["category"] = "Truck Active";
    } else {
      $truck_array["category"] = "Truck Inactive";
    }

    $truck_array["cargo"] = $cargo;
    $truck_array["requests"] = $cargo_array_req;
    $truck_array["offers"] = $cargo_array_off;




    $feature = array(
      "type" => "Feature",
      "geometry" => $geometry,
      "properties" => $truck_array,
    );

    $features[] = $feature;
  }
}



$base_info = "SELECT * from base";
$response = $db->query($base_info);
$response_row = $response->fetch_assoc();
$base_array = array(
  "latitude" => $response_row["latitude"],
  "longitude" => $response_row["longitude"],
);

$coordinates = array((float)$base_array["latitude"], (float)$base_array["longitude"]);
$geometry = array(
  "type" => "Point",
  "coordinates" => $coordinates
);

$category["category"] = "Base";

$feature = array(
  "type" => "Feature",
  "geometry" => $geometry,
  "properties" => $category,
);

$features[] = $feature;

$featureCollection = array(
  "type" => "FeatureCollection",
  "features" => $features,
);


header('Content-Type: application/json');
echo json_encode($featureCollection);
