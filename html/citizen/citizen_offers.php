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
  <style>
    #tables {
      display: flex;
      border-collapse: collapse;
      width: 100%;
    }
  </style>
</head>

<body>
  <h1>Offers</h1>

  <div class="sidebar">
    <a href="/html/citizen/citizen_requests.php">Requets</a>
    <a href="/server/logout.php">Logout</a>
  </div>

  <div id="tables">
    <div>
      Announcements
      <table id="tableAnnouncements">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Item Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody id="announcements"></tbody>
      </table>
    </div>
    <div>
      Offer Selected
      <table id="tableSelectedOffer">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="OfferSelected"></tbody>
      </table>
      <button id="clear">Clear</button>
      <button id="submitAnnouncement">Submit</button>
    </div>
  </div>

  <script src="/scripts/citizen_offers.js"></script>
</body>

</html>