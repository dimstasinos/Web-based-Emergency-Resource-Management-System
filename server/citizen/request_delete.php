<?php

session_start();

include("../Mysql_connection.php");
$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();
try {

  $request_delete = $db->prepare("DELETE FROM citizen_requests where
  request_id=?");
  $request_delete->bind_param(
    "i",
    $data->id,
  );
  $request_delete->execute();

  $db->close();
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success', $data]);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
