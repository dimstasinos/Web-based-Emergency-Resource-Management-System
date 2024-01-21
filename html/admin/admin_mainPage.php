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
  <img src="/images/favicon.png" alt="Icon" class="title-icon"> 
  <h1 class="page-title">||Διαχειριστής||</h1>
  </div>

  <div class="container">
    <div class="sidebar">
      <a href="/html/admin/adminAnnouncement.php">Ανακοινώσεις</a>
      <a href="/html/admin/adminRegisterRescuer.php">Εγγραφή Διασώστη</a>
      <a href="/html/admin/base_warehouse.php">Βάση Δεδομένων</a>
      <a href="/server/logout.php">Αποσύνδεση</a>
    </div>
    <div class="main">
      <div id="map"></div>
      <hr class="separator-line">
      <hr class="separator-line">
      <h2 class="chart-heading">Κατάσταση προσφορών και αιτημάτων</h2>
      <hr class="separator-line">
      <hr class="separator-line">     
      <label for="startdate">Ημερομηνία έναρξης:</label>
      <input type="date" id="startdate" name="selectedDate" required>
      <div>
        <br>
      <label for="enddate">Ημερομηνία τερματισμού:</label>
      <input type="date" id="enddate" name="selectedDate" required>
      </div>
      <button id="submitdate">Καταχώρηση</button>

      <canvas id="serverchart" width="500" height="50"></canvas>
    </div>
  </div>

  <script src="/scripts/admin_MainPage.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="/leaflet/leaflet.js"></script>
</body>

</html>
