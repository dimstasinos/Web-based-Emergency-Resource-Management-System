<?php

include("Mysql_connection.php");

$db = db_connect();

$mysql = "SELECT * FROM offers";
$response = $db->query($mysql);


$offers = array();

if ($response->num_rows > 0) {

  while ($row = $response->fetch_assoc()) {
    $offer_array = array(
      "citizen_name" => $row["citizen_name"],
      "phone_number" => $row["phone_number"],
      "submission_date" => $row["submission_date"],
      "offer_type" => $row["offer_type"],
      "quantity" => $row["quantity"],
      "pickup_date" => $row["pickup_date"],
      "veh_username" => $row["veh_username"],
      "citizen_id" => $row["citizen_id"]     
    );
    


    $offers[] = $offer_array;
  }
}



$data = array(
  "offers" => $offers,
);


$db->close();

$json_data = json_encode($data);

header('Content-Type: application/json');

echo $json_data;
   
    
    
    
    
    
    
