<?php
session_start();

if (!isset($_SESSION["type"]) || $_SESSION["type"] != "rescuer") {
  header("Location: /html/login.php");
  exit();
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Διασώστης</title>
  <link rel="stylesheet" href="/css/rescuer_map.css">
  <link rel="stylesheet" href="/leaflet/leaflet.css">
  <link rel="stylesheet" href="/css/general.css">
</head>

<body>

  <div class="headerall">
    <div id="pic"><img src="/images/favicon.png" alt="Icon" class="title-icon">
    </div>
    <div class="side_header">
      <div class="header">
        <h1 class="page-title">Διασώστης</h1>
      </div>
      <p id="text"></p>
      <div class="sidebar">
        <a href="/server/logout.php">Αποσύνδεση</a>
      </div>
    </div>
  </div>

  <div class="main">

    <div id="map"></div>

    <div id="tasks_panel">
      <table id="tasks">
        <thead>
          <tr>
            <th>Όνομα</th>
            <th>Κινητό Τηλεφωνο</th>
            <th>Τύπος</th>
            <th>Ημερομηνία Καταχώρησης</th>
            <th>Προϊόv</th>
            <th>Ποσότητα</th>
          </tr>
        </thead>
        <tbody id=tasks_info></tbody>
      </table>
    </div>
    <div>
      <h3>Κατηγορίες Ειδών</h3>
      <select id="categorySelect"></select>
    </div>

    <div id="tables">
      <div>
        <h2>Αποθήκη</h2>
        <table id="tableOfItems">
          <thead>
            <tr>
              <th>ID</th>
              <th>Όνομα</th>
              <th>Κατηγορία</th>
              <th>Λεπτομέρειες</th>
              <th>Ποσότητα</th>
            </tr>
          </thead>
          <tbody id="items"></tbody>
        </table>
      </div>
      <div>
        <h3>Επιλεγμένο Προϊόν</h3>
        <table id="tableSelected">
          <thead>
            <tr>
              <th>ID</th>
              <th>Όνομα</th>
              <th>Ποσότητα</th>
            </tr>
          </thead>
          <tbody id="itemSelected"></tbody>
        </table>
        <button id="load">Φόρτωση</button>
      </div>
      <div>
        <h4>Φορτίο Οχήματος</h4>
        <table id="Cargo">
          <thead>
            <tr>
              <th>ID</th>
              <th>Όνομα</th>
              <th>Ποσότητα</th>
            </tr>
          </thead>
          <tbody id="itemCargo"></tbody>
        </table>
        <button id="unload">Ξεφόρτωση</button>
      </div>
    </div>

  </div>

  <script src="/leaflet/leaflet.js"></script>
  <script src="/scripts/rescuer_map.js"></script>

</body>

</html>