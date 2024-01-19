<?php

include("Mysql_connection.php");

try {

  $db = db_connect();

  $vehicle = "SELECT vehicle_username from vehicle";
  $vehicle_response = $db->query($vehicle);

  $vehicle_user = array();

  if ($vehicle_response->num_rows > 0) {
    while ($vehicle_row = $vehicle_response->fetch_assoc()) {
      $vehicle_username["username"] = $vehicle_row["vehicle_username"];
      $vehicle_user[] = $vehicle_username;
    }
  }

  $data = array(
    "Trucks" => $vehicle_user,
  );

  $db->close();

  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
