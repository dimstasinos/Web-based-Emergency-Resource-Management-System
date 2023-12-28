<?php
session_start();

session_destroy();

header('Location: /html/login_page.php');
?>