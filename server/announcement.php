<?php

include("Mysql_connection.php");

$db = db_connect();

$mysql = "SELECT * from announcements";
$response = $db->query($mysql);

$announcements = array();

if ($response->num_rows > 0) {

  while ($row = $response->fetch_assoc()) {
    $announcement_array = array(
      "id" => $row["id"],
      "title" => $row["title"],
      "date" => $row["date"],
      "content" => $row["content"]
    );

    $announcements[] = $announcement_array;
}


  $data = array(
    "announcements" => $announcements,
  );


  $db->close();

  $json_data = json_encode($data);

  header('Content-Type: application/json');

  echo $json_data;
}

?>