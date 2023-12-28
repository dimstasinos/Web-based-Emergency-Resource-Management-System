<?php

session_start();

if (
  isset($_SESSION["username"]) && isset($_SESSION["type"])
  && isset($_SESSION["user_id"])
) {

  $response = [
    'status' => 'success',
    'username' => $_SESSION['username'],
    'user_id' => $_SESSION['user_id'],
    'Name' => $_SESSION['Name']
  ];


  header('Content-Type: application/json');
  echo json_encode($response);
}
