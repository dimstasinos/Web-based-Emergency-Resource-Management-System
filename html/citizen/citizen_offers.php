<?php
session_start();

if (!isset($_SESSION["type"]) || $_SESSION["type"] != "citizen") {
  header("Location: /html/login.php");
  exit();
}
?>


<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Requests</title>
</head>

<body>
  <h1>Offers</h1>

  <div class="sidebar">
    <a href="/html/citizen/citizen_requests.php">Requets</a>
    <a href="/server/logout.php">Logout</a>
  </div>

  <script src="/scripts/citizen_offers.js"></script>
</body>

</html>