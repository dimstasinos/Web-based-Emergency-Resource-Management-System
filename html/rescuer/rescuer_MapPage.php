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
  <title>Rescuer</title>
  <link rel="stylesheet" href="/css/rescuer_map.css">
  <link rel="stylesheet" href="/leaflet/leaflet.css">
</head>

<body>

  <div class="header">
    <h1>Rescuer</h1>
  </div>

  <div class="sidebar">
    <a href="#">Map</a>
    <a href="#">DataBase</a>
    <a href="/server/logout.php">Logout</a>
  </div>

  <div class="main">

    <div id="map"></div>

    <div id="tasks_panel">
      <table id="tasks">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Type</th>
            <th>Submission Date</th>
            <th>Item</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody id=tasks_info></tbody>
      </table>
    </div>

    <div>
      <label for="categorySelect">Categories of species</label>
      <select id="categorySelect"></select>
    </div>

    <div id="tables">
      <div>
        Warehouse
        <table id="tableOfItems">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Details</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody id="items"></tbody>
        </table>
      </div>
      <div>
        Item Selected
        <table id="tableSelected">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody id="itemSelected"></tbody>
        </table>
        <button id="load">Load</button>
      </div>
      <div>
        Truck Cargo
        <table id="Cargo">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody id="itemCargo"></tbody>
        </table>
        <button id="unload">Unload</button>
      </div>
    </div>

  </div>
  <p id="text"></p>
  <script src="/leaflet/leaflet.js"></script>
  <script src="/scripts/rescuer_map.js"></script>

</body>

</html>