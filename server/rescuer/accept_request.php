<?php
session_start();

include("../Mysql_connection.php");
$receive = file_get_contents('php://input');
$data = json_decode($receive);

$db = db_connect();

$citizen_request_update = $db->prepare("UPDATE citizen_requests SET pickup_date=now(), req_veh_id=?
where request_id=?");
$citizen_request_update->bind_param(
"ii",
$_SESSION["truck_id"],
$data->request,
);
$citizen_request_update->execute();

$db->close();

header('Content-Type: application/json');
echo json_encode(['status' => 'success']);