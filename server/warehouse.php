<?php
  $web_storage = file_get_contents("http://usidas.ceid.upatras.gr/web/2023/export.php");

  header('Content-Type: application/json');
  echo $web_storage;
  
?>