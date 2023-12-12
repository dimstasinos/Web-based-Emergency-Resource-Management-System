document.addEventListener('DOMContentLoaded', function () {
  var map = L.map('map').setView([37.9838, 23.7275], 13);  //Athens

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Marker vashs
  var baseMarker = L.marker([37.9755, 23.7348],).addTo(map);
  baseMarker.bindPopup("<b>Base</b><br>Base location").openPopup();

  
  fetch('/server/location.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => console.error('Error:', error));


});

/*$(document).ready(function () {
  // Make an AJAX request to get all location data
  $.ajax({
    url: '/server/location.php',
    method: 'GET',
    success: function (data) {
      try {
        // Ensure data is an array
        var allLocationData = Array.isArray(data.locdata) ? data.locdata : [data.locdata];

        console.log('All Location Data:', allLocationData);

        // Iterate through each location data
        allLocationData.forEach(function (locationData) {
          // Call the function to create and pin the marker
          createAndPinMarker(locationData);
        });
      } catch (error) {
        console.error('Error processing location data:', error);
      }
    },
    error: function (error) {
      console.error('Error fetching location data:', error);
    }
  });*/

/*function createAndPinMarker(data) {
  console.log('Received data:', data);

  // Check if data has the expected properties
  if (data && data.lat && data.longi && data.type) {
    var lat = data.lat;
    var long = data.longi;
    var type = data.type;

    // Customize marker based on type
    var markerColor;
    var popupContent;

    switch (type) {
      case 'base':
        markerColor = 'green';
        popupContent = '<b>Base</b><br>Base Location';
        break;
      // Add other cases for different types
      case 'vehicle':
        markerColor = 'blue';
        popupContent = 'Username: ' + data.username + '<br>Load: ' + data.load +
          '<br>Condition: ' + data.condition;
        // Connect vehicle marker to tasks with straight lines
        connectMarkers([lat, long], tasksMarkers[data.username]);
        break;
      // Add cases for other types
      default:
        console.error('Unknown marker type:', type);
        return;
    }

    // Create and add the marker to the map
    var marker = L.marker([lat, long], { icon: L.divIcon({ className: 'map-marker', html: markerColor }) }).addTo(map);
    marker.bindPopup(popupContent).openPopup();

    // Store the marker for future reference
    switch (type) {
      case 'base':
        baseMarker = marker;
        break;
      case 'vehicle':
        vehiclesMarkers[data.username] = marker;
        break;
      case 'request':
        requestsMarkers[data.id] = marker;
        break;
      case 'offer':
        offersMarkers[data.id] = marker;
        break;
    }
  } else {
    console.error('Invalid data structure:', data);
  }
}

// Create and add the marker to the map
var marker = L.marker([lat, long], { icon: L.divIcon({ className: 'map-marker', html: markerColor }) }).addTo(map);
marker.bindPopup(popupContent).openPopup();

// Store the marker for future reference
switch (type) {
  case 'base':
    baseMarker = marker;
    break;
  case 'vehicle':
    vehiclesMarkers[data.username] = marker;
    break;
  case 'request':
    requestsMarkers[data.id] = marker;
    break;
  case 'offer':
    offersMarkers[data.id] = marker;
    break;
}


// Connect two markers with a straight line
function connectMarkers(coords1, coords2) {
if (coords1 && coords2) {
  var line = L.polyline([coords1, coords2.getLatLng()], { color: 'black' }).addTo(map);
}
}
;*/
