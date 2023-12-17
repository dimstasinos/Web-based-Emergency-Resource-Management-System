
document.addEventListener('DOMContentLoaded', function () {

  var map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);



  fetch("/server/map_admin/base.php")
    .then((jsonResponse) => jsonResponse.json())
    .then((data) => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        //////////BASE MARKER LOCATION///////////
        var BaseMarker = L.marker([data.base_location[0].lat, data.base_location[0].longi], {
          draggable: true
        }).addTo(map);

        BaseMarker.on('dragend', function (event) {
          var marker = event.target;
          var position = marker.getLatLng();

          //Base Location confirm
          var isConfirmed = confirm('Do you want to confirm this location?');
          if (isConfirmed) {
            //confirmation 
            alert('Base Location confirmed: ' + position.lat + ', ' + position.lng);
          } else {
            //cancellation
            alert('Base Location not confirmed');
          }
        });
      }
    })
    .catch((error) => console.error("Error:", error));


  fetch('/server/map_admin/requests.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);

      var requestsData = data.requests;

      for (var i = 0; i < requestsData.length; i++) {
        var request = requestsData[i];

        var requestMarker = L.marker([request.lat, request.longi], {
        }).addTo(map);

        var popupContent = `<b>Name:</b> ${request.citizen_name}<br>
                             <b>Phone:</b> ${request.phone_number}<br>
                             <b>Date:</b> ${request.submission_date}<br>
                             <b>Type:</b> ${request.request_type}<br>
                             <b>Quantity:</b> ${request.quantity}<br>
                             <b>Pickup Date:</b> ${request.pickup_date}<br>
                             <b>Vehicle Username:</b> ${request.veh_username}`;

        requestMarker.bindPopup(popupContent);
      }
    })
    .catch(error => console.error('Error:', error));
});


  /*fetch('/server/location.php')
    .then(response => response.json())
    .then(data => {
      console.log(data);

    })
    .catch(error => console.error('Error:', error));*/


/*
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

});*/
/*
function createAndPinMarker(data) {
 
    var lat = data.lat;
    var long = data.longi;
    var typeloc = data.typeloc;
    var markerColor;
    var popupContent;
}
if (typeloc === 'off') {
  markerColor = 'green';
  popupContent = '<b>Base</b><br>Base Location';
} else if (typeloc === 'veh') {
  markerColor = 'blue';
  popupContent = 'Username: ' + data.username + '<br>Load: ' + data.load +
    '<br>Condition: ' + data.condition;

  connectMarkers([lat, long], tasksMarkers[data.username]);
} else if (typeloc === 'req') {
  markerColor = 'red';
  popupContent = 'Username: ' + data.username + '<br>Load: ' + data.load +
    '<br>Condition: ' + data.condition;
} else {
  console.error('Unknown marker type:', typeloc);
  return;
}

var marker = L.marker([lat, long], { icon: L.divIcon({ className: 'map-marker', html: markerColor }) }).addTo(map);
marker.bindPopup(popupContent).openPopup();


if (typeloc === 'veh') {
  vehiclesMarkers[data.username] = marker;
} else if (typeloc === 'req') {
  requestsMarkers[data.id] = marker;
} else if (typeloc === 'off') {
  offersMarkers[data.id] = marker;
}

function connectMarkers(coords1, coords2) {
if (coords1 && coords2) {
  var line = L.polyline([coords1, coords2.getLatLng()], { color: 'black' }).addTo(map);
}
}
;
*/


/*
////////////////VEHICLE MARKER////////////////////
var vehIcon = L.icon({

  iconSize: [300, 300], 
    iconAnchor: [15, 15] 
  });

 */
/*
var vehMarker = L.marker([37.9838, 23.7275], {
    draggable: true,
    icon: vehIcon 
  }).addTo(map);   

  // Event listener for marker dragend event
  /*
  vehMarker.on('dragend', function (event) {
    var marker = event.target;
    var position = marker.getLatLng();
    alert('Location confirmed: ' + position.lat + ', ' + position.lng);
  });*/