<?php

include("Mysql_connection.php");

$db = db_connect();

$mysql = "SELECT * FROM requests";
$response = $db->query($mysql);


$requests = array();

if ($response->num_rows > 0) {

  while ($row = $response->fetch_assoc()) {
    $request_array = array(
      "citizen_name" => $row["citizen_name"],
      "phone_number" => $row["phone_number"],
      "submission_date" => $row["submission_date"],
      "request_type" => $row["request_type"],
      "quantity" => $row["quantity"],
      "pickup_date" => $row["pickup_date"],
      "veh_username" => $row["veh_username"],
      "citizen_id" => $row["citizen_id"]     
    );

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
