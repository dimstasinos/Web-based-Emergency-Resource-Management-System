<?php
header('Content-Type: application/json');


if (isset($_FILES['jsonfile'])) {
  $json_file = $_FILES['jsonfile'];
  $file_name = $_FILES['jsonfile']['name'];
  $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);

  if ($file_extension === 'json') {
    $file_content = file_get_contents($_FILES['jsonfile']['tmp_name']);
    $jsonData = json_decode($file_content);

    if ($jsonData !== null) {
 
      echo json_encode(['status' => 'success']);

    } else {
    
      echo json_encode(['status' => 'error', 'message' => 'To αρχείο δεν έχει μορφή JSON']);
    }
  } else {

    echo json_encode(['status' => 'error', 'message' => ' Το αρχείο δεν έχει extention \'.json\'']);
  }


 
}
