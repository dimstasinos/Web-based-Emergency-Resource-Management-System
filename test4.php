<?php

// Create Point geometries with different coordinates and properties
$point1 = array(
    "type" => "Point",
    "coordinates" => array(10.0, 20.0),
);

$point2 = array(
    "type" => "Point",
    "coordinates" => array(15.0, 25.0),
);

$point3 = array(
    "type" => "Point",
    "coordinates" => array(12.0, 22.0),
);

// Create Features with the Point geometries and properties
$feature1 = array(
    "type" => "Feature",
    "geometry" => $point1,
    "properties" => array(
        "name" => "Sample Location 1",
        "category" => "A",
    ),
);

$feature2 = array(
    "type" => "Feature",
    "geometry" => $point2,
    "properties" => array(
        "name" => "Sample Location 2",
        "category" => "B",
    ),
);

$feature3 = array(
    "type" => "Feature",
    "geometry" => $point3,
    "properties" => array(
        "name" => "Sample Location 3",
        "category" => "C",
    ),
);

// Create a FeatureCollection with the Features
$featureCollection = array(
    "type" => "FeatureCollection",
    "features" => array($feature1, $feature2, $feature3),
);

// Convert the PHP array to a JSON string
$geoJSONString = json_encode($featureCollection, JSON_PRETTY_PRINT);

// Output the GeoJSON string
header('Content-Type: application/json');
echo $geoJSONString;
?>
