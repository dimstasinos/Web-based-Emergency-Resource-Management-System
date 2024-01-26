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
  <link rel="stylesheet" href="/css/citizen_offers.css">
  <link rel="stylesheet" href="/css/header.css">
</head>

<body>
  <div class="headerall">
    <div id="pic"><img src="/images/favicon.png" alt="Icon" class="title-icon">
    </div>
    <div class="topHeader">
      <div class="header">
        <h1 class="page-title">Προσφορές</h1>
      </div>
      <div class="topBar">
        <div class="topButton"><a href="/html/citizen/Requests">Αιτήματα</a></div>
        <div class="topButton"><a href="/server/logout.php">Αποσύνδεση</a></div>
      </div>
    </div>
  </div>


  <div id="main_container">
    <div id="table_start">
      <h2> Ανακοινώσεις </h2>
      <div id="tableAnnouncements-container">
        <table id="tableAnnouncements">
          <thead>
            <tr>
              <th>Eπιλογή</th>
              <th>ID</th>
              <th>'Ονομα Προϊόντος</th>
              <th>Ποσότητα</th>
            </tr>
          </thead>
          <tbody id="announcements"></tbody>
        </table>
      </div>
    </div>


    <div id="table_start">
      <h2>Επίλογη Προσφοράς </h2>
      <div id="offer_select_container">
        <table id="tableSelectedOffer">
          <thead>
            <tr>
              <th>ID</th>
              <th>'Ονομα Προϊόντος</th>
              <th>Ποσότητα</th>
              <th>Eπιλογή</th>
            </tr>
          </thead>
          <tbody id="OfferSelected"></tbody>
        </table>
      </div>
      <div id="button-container">
          <button id="submitAnnouncement">Καταχώρηση</button>
          <button id="clear">Αφαίρεση</button>
        </div>
    </div>


    <div id="table_start">
      <h2>Αποδοχή Προσφοράς</h2>
      <div id="offers_t">
        <table id="table_offers">
          <thead>
            <tr>
              <th>Προϊόν</th>
              <th>Ποσότητα</th>
              <th>Ημερομηνία Καταχώρησης</th>
              <th>Ημερομηνία Παραλαβής</th>
              <th>Ημερομηνία Ολοκλήρωσης</th>
            </tr>
          </thead>
          <tbody id="offers"></tbody>
        </table>
      </div>
    </div>
  </div>


  <script src="/scripts/citizen_offers.js"></script>
</body>

</html>