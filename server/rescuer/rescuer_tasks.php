<?php

session_start();

include("../Mysql_connection.php");

$db = db_connect();

$request_task = $db->prepare("SELECT * FROM citizen_requests WHERE req_veh_id=?");
$request_task->bind_param("i", $_SESSION["truck_id"]);
$request_task->execute();
$request_task_response = $request_task->get_result();
$requests = array();
if ($request_task_response->num_rows > 0) {
  while ($request_task_row = $request_task_response->fetch_assoc()) {

    $request_task_array = array(
      "request_id" => $request_task_row["request_id"],
      "submission_date" => $request_task_row["submission_date"],
      "quantity" => $request_task_row["persons"],
      "citizen_id" => $request_task_row["req_citizen_id"],
      "item_id" => $request_task_row["req_item_id"],
    );


    $item = $db->prepare("SELECT item_name FROM items where item_id=?");
    $item->bind_param("i", $request_task_row["req_item_id"]);
    $item->execute();
    $item_response = $item->get_result();
    $item_row = $item_response->fetch_assoc();
    $request_task_array["item_name"] = $item_row["item_name"];

    $requests[] = $request_task_array;
  }

}

$data = array(
  "requests" => $requests,
);

$json_data = json_encode($data);
header('Content-Type: application/json');
echo $json_data;