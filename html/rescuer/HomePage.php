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
  <link rel="stylesheet" href="/css/Rescuer_HomePage.css">
  <link rel="stylesheet" href="/leaflet/leaflet.css">
  <link rel="stylesheet" href="/css/header.css">
  <link rel="icon" href="/images/favicon.png" type="image/x-icon">
</head>

<body>

  <div class="headerall">
    <div id="pic"><img src="/images/favicon.png" alt="Icon" class="title-icon">
    </div>
    <div class="topHeader">
      <div class="header">
        <h1 class="page-title">Διασώστης</h1>
      </div>
     
      <div class="topBar">
      <div><p id="text"></p></div>
      <div class="topButton"><a href="/server/logout.php">Αποσύνδεση</a></div>
      </div>
    </div>
  </div>

  <div id="main-container">

    <div id="map"></div>

    <div id="title_tasks_panel-container">
      <h1>Tasks</h1>
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
              <th>Ολοκλήρωση/Ακύρωση</th>
            </tr>
          </thead>
          <tbody id=tasks_info></tbody>
        </table>
      </div>
    </div>


    <div id="table_truck-container">
      <h2>Φορτίο Οχήματος</h2>
      <div id="table_cargo">
        <table id="Cargo">
          <thead>
            <tr>
              <th>ID</th>
              <th>Είδος</th>
              <th>Ποσότητα</th>
            </tr>
          </thead>
          <tbody id="itemCargo"></tbody>
        </table>
      </div>
      <div id="unload_button-container">
        <button id="unload">Εκφόρτωση</button>
      </div>
    </div>


    <div id="warehouse_selected-container">

      <div id="title_table_warehouse-container">
        <h2>Αποθήκη</h2>

        <div id="category_select-container">
          <label for="categorySelect">Κατηγορίες Ειδών</label>
          <select id="categorySelect"></select>
        </div>

        <div id="table_warehouse">
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
      </div>

      <div id="title_table_selected-container">
        <h2>Επιλεγμένα Προϊόντα</h2>
        <div id="table_selected-container">
          <table id="tableSelected">
            <thead>
              <tr>
                <th>ID</th>
                <th>Όνομα</th>
                <th>Ποσότητα</th>
                <th>Αφαίρεση</th>
              </tr>
            </thead>
            <tbody id="itemSelected"></tbody>
          </table>
        </div>
        <div id="load_button-container">
          <button id="load">Φόρτωση</button>
        </div>
      </div>
    </div>

  </div>


  <script src="/leaflet/leaflet.js"></script>
  <script src="/scripts/rescuer_map.js"></script>

</body>

</html>