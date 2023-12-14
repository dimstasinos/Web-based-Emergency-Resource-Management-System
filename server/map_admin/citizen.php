<?php

include("Mysql_connection.php");

$db = db_connect();

$mysql = "SELECT * FROM citizen";
$response = $db->query($mysql);


$citizen = array();

if ($response->num_rows > 0) {

  while ($row = $response->fetch_assoc()) {
    $citizen_array = array(
      "citizen_id" => $row["citizen_id"],
      "name" => $row["name"],
      "phone_number" => $row["phone_number"]   
    );

    $citizen[] = $citizen_array;
  }
}



$data = array(
  "citizen" => $citizen,
);


$db->close();

$json_data = json_encode($data);

header('Content-Type: application/json');

echo $json_data;




