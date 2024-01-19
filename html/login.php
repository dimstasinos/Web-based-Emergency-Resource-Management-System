<?php

session_start();

if (isset($_SESSION['type'])) {
  if ($_SESSION['type'] == "rescuer") {
    header("Location: /html/rescuer/rescuer_MapPage");
    exit();
  } else if ($_SESSION['type'] == "citizen") {
    header("Location: /html/citizen/request");
    exit();
  } else if ($_SESSION['type'] == "admin") {
    header("Location: /html/citizen/admin_mainPage");
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
  <link rel="stylesheet" href="/css/login_style.css">
  <title>Login</title>
</head>

<body>
  <div id="loginbox">
    <img src="/images/loginuser.png" alt="Login image" id="loginuser">
    <h1>Login</h1>
    <form id="loginForm">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required>

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>

      <input type="checkbox" id="check">
      <label for="check">Show password</label>

      <div id="register">
        <p>Don't have an account?
          <a href="/html/register_page"><br><strong>Register</strong></a>
        </p>
      </div>

      <button type="button" id="loginButton">Login</button>
    </form>
  </div>

  <script src="/scripts/login_script.js"></script>
</body>

</html>