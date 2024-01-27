<?php

//PHP script που στέλνε στον client τις πληροφορίες
//του SESSION

session_start();

if (
  isset($_SESSION["username"]) && isset($_SESSION["type"])
  && isset($_SESSION["user_id"])
) {

  //Συλλογή πληροφοριών
  if($_SESSION["type"]=="rescuer"){
  $response = [
    'status' => 'success',
    'username' => $_SESSION['username'],
    'user_id' => $_SESSION['user_id'],
    'Name' => $_SESSION['Name'],
    'truck_id' => $_SESSION["truck_id"],
  ];
  }else if($_SESSION["type"]=="citizen"){
    $response=[
      'status'=> 'success',
      'Name' =>$_SESSION['Name'],
    ];
  }

  //Αποστολή των πληροφοριών στον client
  header('Content-Type: application/json');
  echo json_encode($response);
}
