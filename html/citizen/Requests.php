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
  <link rel="stylesheet" href="/css/Header.css">
  <link rel="icon" href="/images/favicon.png" type="image/x-icon">
  <title>Requests</title>
</head>

<body>
  <div class="headerall">
    <div id="pic"><img src="/images/favicon.png" alt="Icon" class="title-icon">
    </div>
    <div class="topHeader">
      <div class="header">
        <h1 class="page-title">Αιτήματα</h1>
      </div>
      <div class="topBar">
      <div class="topButton"><a href="/html/citizen/Offers">Προσφορές</a></div>
      <div class="topButton"><a href="/server/logout.php">Αποσύνδεση</a></div>
      </div>
    </div>
  </div>

  <div id="main_container">
    
  <div class="autocomplete-category">
  <div class="label-select">
  <label for="categories">Κατηγορίες Προϊόντων</label>
        <select id="categories"></select>
  </div>
  <div class="autocomplete">
          <label for="search">Αναζήτηση Προϊόντων</label>
          <div id="input-list">
          <input type="text" id="search" placeholder="Αναζήτηση" autocomplete="off">
          <div id="list">
            <ul id="result_list"></ul>
          </div>
        </div>
      </div>
    </div>

    <div id="table_start">
    <h2>Αποθήκη</h2>
    <div id="table_req">
        <table id="table_admin_request">
        <div>
          <thead>
            
              <tr>
                <th>ID</th>
                <th>'Ονομα Προϊόντος</th>
                <th>Κατηγορία</th>
                <th>Λεπτομέρειες</th>
                <th>Ποσότητα</th>

              </tr>
      
          </thead>
          </div>
          <tbody id="itemsTable"></tbody>
        </table>
      </div>
    </div>

    
    <div id="table_start">
    <h2>Επιλεγμένα Προϊόντα </h2>
    <div id="selected_t">
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
    </div>
    <div id="button-container">
      <button id="submitRequest">Καταχώρηση</button>
    </div>
    </div>
   


    <div id="table_start">
    <h2>Αιτήματα</h2>
    <div id="request_t">
      <table id="tableRequest">
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
  </div>
  </div>

  <script src="/scripts/citizen_requests.js"></script>
</body>

</html>