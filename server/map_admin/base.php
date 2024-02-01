<?php

//PHP script που στέλνει στον client 
//την θέση της βασης

session_start();

include("../Mysql_connection.php");

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Query που παίρνει την θέση της βάσης
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

  //Αποστολή της θέσης στον client
  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
