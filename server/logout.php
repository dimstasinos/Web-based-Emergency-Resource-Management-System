<?php

//PHP script που διαγράφει το session

session_start();

session_destroy();

header('Location: /html/login.php');
