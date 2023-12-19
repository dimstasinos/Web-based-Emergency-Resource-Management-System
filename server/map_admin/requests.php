<?php

include("Mysql_connection.php");

$db = db_connect();

$mysql = "SELECT submission_date,persons,pickup_date FROM citizen_requests";
$response = $db->query($mysql);


$requests = array();

if ($response->num_rows > 0) {

  while ($row = $response->fetch_assoc()) {

    $request_array = array(
      "submission_date" => $row["submission_date"],
      "quantity" => $row["persons"],
      "pickup_date" => $row["pickup_date"]
    );

    $mysql = "SELECT f_name,l_name,phone_number FROM citizen INNER JOIN 
    citizen_requests ON citizen.citizen_id=citizen_requests.req_citizen_id";

    $request_array = array(
      "f_name" => $row["f_name"],
      "l_name" => $row["l_name"],
      "phone_number" => $row["phone_number"]
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
