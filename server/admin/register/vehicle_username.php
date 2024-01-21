<?php

//PHP script που στέλνει στον client
//τα usernames των οχημάτων

session_start();

include("../../Mysql_connection.php");

try {

  //Σύνδεση με την βάση δεδομένων
  $db = db_connect();

  //Queries για την ανάκτηση των usernames
  $vehicle = "SELECT vehicle_username,vehicle_id from vehicle";
  $vehicle_response = $db->query($vehicle);

  $vehicle_user = array();

  if ($vehicle_response->num_rows > 0) {
    while ($vehicle_row = $vehicle_response->fetch_assoc()) {
      $vehicle_data=array(
         "username" => $vehicle_row["vehicle_username"],
          "id" => $vehicle_row["vehicle_id"],
      );

      $vehicle_user[] = $vehicle_data;
    }
  }

  $data = array(
    "trucks" => $vehicle_user,
  );


  $db->close();

  //Αποστολή usernames στον client
  $json_data = json_encode($data);
  header('Content-Type: application/json');
  echo $json_data;
} catch (Exception $error) {

  //Αποστολή μηνύματος ανεπιτυχούς εκτέλεσης στον client
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
