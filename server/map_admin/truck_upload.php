<?php
include("../Mysql_connection.php");
$receive = file_get_contents('php://input');
$data = json_decode($receive);


try {
  $db = db_connect();
  
  $update_truck_loc = $db->prepare("UPDATE vehicle SET latitude=?,longitude=?
  WHERE vehicle_id=?");

  $update_truck_loc->bind_param(
    "ddi",
    $data->lat,
    $data->lng,
    $data->id,
  );

  $update_truck_loc->execute();
  $db->close();

  header('Content-Type: application/json');
  echo json_encode(['status' => 'success']);

} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage(),$data]);
}

?>