<?php

  include("Mysql_connection.php");

  $db = db_connect();

  if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $qr  = "SELECT * FROM users";
      $result = $db->query($qr);

    if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo "<br>" ." - Name: " . $row["username"]. " " . $row["password"]. "<br>";
  }
} else {
  echo "0 results";
  }
}

?>