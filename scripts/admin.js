document.addEventListener('DOMContentLoaded', function () {
  var map = L.map('map').setView([37.9838, 23.7275], 13);  //Athens

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);


  fetch('/server/location.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      createAndPinMarker(data);

    })
    .catch(error => console.error('Error:', error));


});




function createAndPinMarker(data) {
 
    var lat = data.lat;
    var long = data.longi;
    var typeloc = data.typeloc;

    // Customize marker based on type
    var markerColor;
    var popupContent;
}
/*
    switch (typeloc) {
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
        console.error('Unknown marker type:', typeloc);
        return;
    }

    // Create and add the marker to the map
    var marker = L.marker([lat, long], { icon: L.divIcon({ className: 'map-marker', html: markerColor }) }).addTo(map);
    marker.bindPopup(popupContent).openPopup();

    // Store the marker for future reference
    switch (typeloc) {
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
  }

/*
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

/*
// Connect two markers with a straight line
function connectMarkers(coords1, coords2) {
if (coords1 && coords2) {
  var line = L.polyline([coords1, coords2.getLatLng()], { color: 'black' }).addTo(map);
}
}
;
*/