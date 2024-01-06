<?php

include("../Mysql_connection.php");

$db = db_connect();

try{
$mysql = "SELECT COUNT(*) FROM request WHERE req_veh_id = NULL ";
$response = $db->query($mysql);

$request = array();

if ($response->num_rows > 0) {

    while ($row = $response->fetch_assoc()) {
      $request_array = array(
        "id" => $row["id"],
        "weneed" => $row["weneed"],
        "date" => $row["date"],
        "persons" => $row["persons"]
      );
  
      $request[] = $request_array;
    }
  }
  
  $data = array(
    "request" => $request,
  );
  
  
  $db->close();
  
  $json_data = json_encode($data);
  
  header('Content-Type: application/json');
  
  echo $json_data;
}
catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
  
  ?>
