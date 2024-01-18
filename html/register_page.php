<?php
session_start();

if (isset($_SESSION['username'])) {
  if ($_SESSION['type'] == "rescuer") {
    header("Location: /html/rescuer/rescuer_MapPage");
    exit();
  } else if ($_SESSION['type'] == "citizen") {
    header("Location: /html/citizen/request");
    exit();
  }

  exit();
}

?>

<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width initial-scale=1">
  <link rel="stylesheet" href="/leaflet/leaflet.css">
  <link rel="stylesheet" href="/css/register_page.css">

  <title>Register</title>
</head>

<body>
  <div class="registerbox" id="registerbox">
    <img src="/images/loginuser.png" class="registeruser">
    <h1>Register</h1>
    <form id="registerForm">
      <div class="fnameBox">
        <label for="fname">First Name</label>
        <input type="username" id="fname" placeholder="Enter First Name" maxlength="12" required>
      </div>
      <div class="lnameBox">
        <label for="lname">Last Name</label>
        <input type="username" id="lname" placeholder="Enter Last Name" maxlength="12" required>
      </div>
      <div class="phoneBox">
        <label for="user">Phone Number</label>
        <input type="tel" id="phone" placeholder="Enter Phone Number" maxlength="12" required>
      </div>
      <div class="userBox">
        <label for="user">Username</label>
        <input type="username" id="user" placeholder="Enter Username" maxlength="12" required>
      </div>
      <div class="passBox">
        <label for="pass">Password</label>
        <input type="password" id="pass" placeholder="Enter password" required>
      </div>
      <div class="passBox">
        <label for="confpass">Confirm Password</label>
        <input type="password" id="confpass" placeholder="Re-Enter password" required>
      </div>

      <div id="map"></div>

      <div class="login">
        <p>Already have an account?
          <a href="/html/login.php"><br><strong>Login</strong></a>
        </p>
      </div>
      <div>
        <button type="button" id="registerButton"><strong>REGISTER</strong></button>
      </div>
    </form>

    <script src="/leaflet/leaflet.js"></script>
</body>

<script src="/scripts/register.js"></script>

</html>