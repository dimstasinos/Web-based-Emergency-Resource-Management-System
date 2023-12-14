document.addEventListener('DOMContentLoaded', function () {
  var map = L.map('map').setView([37.9838, 23.7275], 13);  //Athens

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);


  fetch('/server/map_admin/location.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      createAndPinMarker(data);

    })
    .catch(error => console.error('Error:', error));


});
   fetch('/server/map_admin/requests.php')
   .then(response => response.json())
   .then(data => {
     console.log(data);
 
   })
   .catch(error => console.error('Error:', error));



   fetch('/server/map_admin/offers.php')
   .then(response => response.json())
   .then(data => {
     console.log(data);
 
   })
   .catch(error => console.error('Error:', error));
  
   fetch('/server/map_admin/vehicles.php')
   .then(response => response.json())
   .then(data => {
     console.log(data);
 
   })
   .catch(error => console.error('Error:', error));

   fetch('/server/map_admin/citizen.php')
   .then(response => response.json())
   .then(data => {
     console.log(data);
 
   })
   .catch(error => console.error('Error:', error));
  

/*
function createAndPinMarker(data) {
 
    var lat = data.lat;
    var long = data.longi;
    var typeloc = data.typeloc;

    // Customize marker based on type
    var markerColor;
    var popupContent;
}

    switch (typeloc) {
      case 'off':
        markerColor = 'green';
        popupContent = '<b>Base</b><br>Base Location';
        break;

        case 'veh':
        markerColor = 'blue';
        popupContent = 'Username: ' + data.username + '<br>Load: ' + data.load +
          '<br>Condition: ' + data.condition;

          connectMarkers([lat, long], tasksMarkers[data.username]);
        break;
      
        case 'req':
        markerColor = 'red';
        popupContent = 'Username: ' + data.username + '<br>Load: ' + data.load +
          '<br>Condition: ' + data.condition;

      default:
        console.error('Unknown marker type:', typeloc);
        return;
    }

    // Create and add the marker to the map
    var marker = L.marker([lat, long], { icon: L.divIcon({ className: 'map-marker', html: markerColor }) }).addTo(map);
    marker.bindPopup(popupContent).openPopup();

    // Store the marker for future reference
    switch (typeloc) {
      case 'veh':
        vehiclesMarkers[data.username] = marker;
        break;
      case 'req':
        requestsMarkers[data.id] = marker;
        break;
      case 'off':
        offersMarkers[data.id] = marker;
        break;
    }
  }


// Connect two markers with a straight line
function connectMarkers(coords1, coords2) {
if (coords1 && coords2) {
  var line = L.polyline([coords1, coords2.getLatLng()], { color: 'black' }).addTo(map);
}
}
;
*/