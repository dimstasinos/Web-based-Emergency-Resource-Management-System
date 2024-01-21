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
    <a href="/html/admin/adminAnnouncement.php">Announcements</a>
    <a href="/html/admin/adminRegisterRescuer.php">Register Rescuer</a>
    <a href="/html/admin/base_warehouse.php">DataBase</a>
    <a href="/server/logout.php">Logout</a>
  </div>
  <div class="main">
    <div id="map"></div>
  </div>

  <h2 class="chart-heading">Progress of Offers and Requests</h2>
  <label for="startdate">Start Date:</label>
  <input type="date" id="startdate" name="selectedDate" required>
  <label for="enddate">End Date:</label>
  <input type="date" id="enddate" name="selectedDate" required>
  <button id="submitdate">Submit</button>

  <canvas id="serverchart" width="500" height="50"></canvas>

  <script src="/scripts/admin_MainPage.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="/leaflet/leaflet.js"></script>
</body>

</html>