<?php
session_start();

if (!isset($_SESSION["type"]) || $_SESSION["type"] != "admin") {
  header("Location: /html/login.php");
  exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Administrator</title>
  <link rel="stylesheet" href="/css/admin_mainPageStyle.css">
  <link rel="stylesheet" href="/leaflet/leaflet.css">
  <script src="/scripts/admin_MainPage.js"></script>
  <style>
    #map {
      height: 500px;
    }
  </style>
</head>

<body>
  <div class="header">
    <h1>Administrator</h1>
  </div>
  <div class="sidebar">
    <a href="#">Map</a>
    <a href="#">DataBase</a>
    <a href="#">Logout</a>
  </div>
  <div class="main">
    <div id="map"></div>
  </div>



  <script src="/leaflet/leaflet.js"></script>
</body>

</html>