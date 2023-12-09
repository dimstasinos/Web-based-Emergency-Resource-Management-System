<?php

include("Mysql_connection.php");

$db = db_connect();

if ($db !== null && $db instanceof mysqli) {
    if (isset($_GET['locationId'])) {
        // Fetch individual location data
        $locationId = $_GET['locationId'];
        $sql = "SELECT id, lat, longi, type FROM locations WHERE id = $locationId";
    } else {
        // Fetch all location data
        $sql = "SELECT id, lat, longi, type FROM locations";
    }

    $result = $db->query($sql);

    if ($result !== false && $result->num_rows > 0) {
        $locationData = array();

        while ($row = $result->fetch_assoc()) {
            $locationData[] = $row;
        }

        $data = array(
            "locdata" => $locationData,
        );

        echo json_encode($data);
    } else {
        echo json_encode(array('error' => 'No data found'));
    }

    $db->close();
} else {
    echo json_encode(array('error' => 'Database connection error'));
}
?>
