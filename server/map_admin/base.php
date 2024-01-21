<?php
session_start();
include("../Mysql_connection.php");

try {
  $db = db_connect();

  $mysql = "SELECT * from base";
  $response = $db->query($mysql);

  if ($response->num_rows > 0) {
    $row = $response->fetch_assoc();
    $base_array = array(
      "lat" => $row["lat"],
      "lng" => $row["longi"],
    );
  }


  $base = $base_array;

  $data = array(
    "base_location" => $base,
  );

  $db->close();

  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
