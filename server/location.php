
<?php

include("Mysql_connection.php");

$locId = isset($_GET['id']) ? $_GET['id'] : null;
echo "locId: " . $locId . "\n";  //for debugging
$db = db_connect();

if ($db !== null && $db instanceof mysqli) {
    if ($locId !== null) {
        $sql = "SELECT lat, longi FROM locations WHERE id = $locId";
        $result = $db->query($sql);

        if ($result !== false && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $locData = array(
                'lat' => $row['lat'],
                'longi' => $row['longi']
            );
            echo json_encode($locData);
        } else {
            echo json_encode(array('error' => 'Location not found'));
        }
    } else {
        echo json_encode(array('error' => 'Missing or invalid location ID'));
    }

    $db->close();
} else {
    echo json_encode(array('error' => 'Database connection error'));
}
?>