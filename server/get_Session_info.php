<?php

session_start();

if (
  isset($_SESSION["username"]) && isset($_SESSION["type"])
  && isset($_SESSION["user_id"])
) {

  if($_SESSION["type"]=="rescuer"){
  $response = [
    'status' => 'success',
    'username' => $_SESSION['username'],
    'user_id' => $_SESSION['user_id'],
    'Name' => $_SESSION['Name'],
    'truck_id' => $_SESSION["truck_id"],
  ];
  }

  header('Content-Type: application/json');
  echo json_encode($response);
}
