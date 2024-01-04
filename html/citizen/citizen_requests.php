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

    #tables table {
      margin-right: 20px;
      /* Adjust the margin as needed */
    }

    #autocomlete {
      position: relative;
      display: inline-block;
    }

    #search {
      padding: 8px;
      width: 200px;
    }

    #results {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      max-height: 150px;
      overflow-y: auto;
      border: 1px solid #ccc;
      border-top: none;
      list-style: none;
      padding: 0;
      margin: 0;
      background-color: white;
    }

    .results_item {
      padding: 8px;
      cursor: pointer;
    }

    .results_item:hover {
      background-color: #f0f0f0;
    }
  </style>
</head>

<body>
  <h1>Requests</h1>

  <div class="sidebar">
    <a href="/html/citizen/citizen_offers.php">Offers</a>
    <a href="/server/logout.php">Logout</a>
  </div>


  <div>
    <label for="categories">Κατηγορίες ειδών</label>
    <select id="categories"></select>
  </div>
  <div id="autocomlete">
    <input type="text" id="search" placeholder="Items search..." autocomplete="off">
    <ul id="results"></ul>
  </div>
  <div id="tables">
    <div>
      Warehouse
      <table id="table_admin_request">
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
            <th>Persons</th>
          </tr>
        </thead>
        <tbody id="itemSelected"></tbody>
      </table>
      <button id="submitRequest">Submit</button>
    </div>
    <div>
      Requests
      <table id="table_request">
        <thead>
          <tr>
            <th>Item</th>
            <th>Persons</th>
            <th>Submission Date</th>
            <th>Pickup Date</th>
            <th>Complete Date</th>
          </tr>
        </thead>
        <tbody id="requests"></tbody>
      </table>
    </div>
  </div>

  <script src="/scripts/citizen_requests.js"></script>
</body>

</html>