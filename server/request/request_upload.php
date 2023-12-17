<?php
include("../Mysql_connection.php");

$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();
try{

$add_stmt = $db->prepare("INSERT INTO request(weneed,date,persons) VALUES (?,now(),?)");


$add_stmt->bind_param(
  "si",
  $data->weneed,
  $data->persons
);

$add_stmt->execute();
$db->close();
header('Content-Type: application/json');
echo json_encode(['status' => 'success', $data]);
}
catch (Exception $error) {
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', "Error" => $error->getMessage()]);
}
?>