<?php

session_start();

include("../Mysql_connection.php");
$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();

$cancel_request = $db->prepare("UPDATE citizen_offers SET offer_veh_id=NULL, pickup_date=NULL
where offer_id=?");
$cancel_request->bind_param(
  "i",
  $data->id,
);

$cancel_request->execute();

$db->close();

header('Content-Type: application/json');
echo json_encode(['status' => 'success']);