<?php

include("Mysql_connection.php");

$db = db_connect();

$mysql = "SELECT * FROM locations";
$response = $db->query($mysql);


$locations = array();

if ($response->num_rows > 0) {

  while ($row = $response->fetch_assoc()) {
    $location_array = array(
      "id" => $row["id"],
      "lat" => $row["lat"],
      "longi" => $row["longi"],
      "typeloc" => $row["typeloc"]
    );

    $locations[] = $location_array;
  }
}



$data = array(
  "locations" => $locations,
);


$db->close();

$json_data = json_encode($data);

header('Content-Type: application/json');

echo $json_data;
