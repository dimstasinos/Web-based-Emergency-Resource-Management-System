<?php

session_start();

include("../Mysql_connection.php");
$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();
try {

  $request = $db->prepare("INSERT INTO citizen_requests VALUES
  (NULL,now(),?,NULL,NULL,?,?)");
  $request->bind_param(
    "iii",
    $data->quantity,
    $_SESSION["user_id"],
    $data->id
  );
  $request->execute();

  $db->close();
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success', $data]);
} catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
