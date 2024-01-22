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
  <link rel="stylesheet" href="/css/citizen_requests.css">
  <title>Requests</title>
</head>

<body>
  <div class="sidebar">
    <a href="/html/citizen/citizen_offers.php">Προσφορές</a>
    <a href="/server/logout.php">Αποσύνδεση</a>
  </div>
  <h1>ΑΙΤΗΜΑΤΑ</h1>

  <div>
    <h5>Kατηγορίες</h5>
    <label for="categories"></label>
    <select id="categories"></select>
  </div>
  <div id="autocomlete">
    <input type="text" id="search" placeholder="Items search..." autocomplete="off">
    <ul id="results"></ul>
  </div>
  <div id="tables">
    <div id=table_req>
      <h2>Αποθήκη</h2>
      <div class="table-data">
      <table id="table_admin_request">
        <thead>
          <tr>
            <th>ID</th>
            <th>'Ονομα Προϊόντος</th>
            <th>Κατηγορία</th>
            <th>Λεπτομέρειες</th>
            <th>Ποσότητα</th>
            
          </tr>
        </thead>
        <tbody id="itemsTable"></tbody>
      </table>
      </div>
    </div>
    <div>
      <h3>Επιλεγμένα Προϊόντα </h3>
      <table id="tableSelected">
        <thead>
          <tr>
            <th>ID</th>
            <th>Όνομα Προϊόντος</th>
            <th>Άτομα</th>
            <th>Ακύρωση</th>
          </tr>
        </thead>
        <tbody id="itemSelected"></tbody>
      </table>
      <button id="submitRequest">Καταχώρηση</button>
    </div>
  </div>
  <div>
  <h4>Αιτήματα</h4>
      <table id="table_request">
        <thead>
          <tr>
            <th>Αντικείμενα</th>
            <th>Άτομα</th>
            <th>Ημερομηνία Καταχώρησης</th>
            <th>Ημερομηνία Παραλαβής</th>
            <th>Ημερομηνία Ολοκλήρωσης</th>
            <th>Ακύρωση</th>
          </tr>
        </thead>
        <tbody id="requests"></tbody>
      </table>
    </div>

  <script src="/scripts/citizen_requests.js"></script>
</body>

</html>