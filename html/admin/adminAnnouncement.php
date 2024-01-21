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
  <title>Announcements</title>
  <link rel="stylesheet" href="/css/announcement_table.css">
   
</head>

<body>

  <h1>Announcements</h1>


  <div>
    Announcements
    <table id="tableAnnouncements">
      <thead>
        <tr>
          <th>ID</th>
          <th>Item Name</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody id="announcements"></tbody>
    </table>
  </div>


  <div id="autocomlete">
    <input type="text" id="search" placeholder="Items search..." autocomplete="off">
    <ul id="results"></ul>
  </div>
  <div>
    <label for="categories">Κατηγορίες ειδών</label>
    <select id="categories"></select>
  </div>
  <div id="tables">
    <div>
      Warehouse
      <table id="table_warehouse">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Details</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody id="itemsTable"></tbody>
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
      <button id="submitAnnouncement">Submit</button>
    </div>
  </div>

  <script src="/scripts/announcement.js"></script>
</body>

</html>