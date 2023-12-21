document.addEventListener('DOMContentLoaded', function () {

  var map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);


  fetch('/server/map_admin/map.php')
    .then(response => response.json())
    .then(data => {

      const markersLayers = {};

      data.features.forEach(feature => {
        const category = feature.properties.category;


        if (!markersLayers[category]) {
          markersLayers[category] = L.layerGroup();
        }

        const customMarkers = L.marker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
          icon: (function () {
            if (category === "Base") {
              return L.icon({
                iconUrl: '/leaflet/images/offices.png',
                iconSize: [50, 50],
                iconAnchor: [20, 20],
                popupAnchor: [0, 0],
                shadowAnchor: [10, 10]
              });
            } else if (category === "Request Pending") {

              return L.icon({
                iconUrl: '/leaflet/images/request-red.png',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -15]
              });
            } else if (category === "Request Accepted") {
              return L.icon({
                iconUrl: '/leaflet/images/request-green.png',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -15]
              });
            }
          })(),
          draggable: category === "Base"
        });


        if (category === "Base") {


          customMarkers.bindPopup('<strong>Base</strong>');


          customMarkers.on('dragend', function (event) {
            let marker = event.target;
            let position = marker.getLatLng();

            //Base Location confirm
            let newPositionConfirmed = confirm('Do you want to confirm this location?');

            if (newPositionConfirmed) {

              const new_position = {
                lati: position.lat,
                long: position.lng,
              };

              fetch("/server/map_admin/base_upload.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(new_position),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.status === "error") {
                    console.error("Server Error:", data.Error);
                  } else {

                    feature.geometry.coordinates[0] = position.lat;
                    feature.geometry.coordinates[1] = position.lng;
                    alert('Base Location confirmed: ' + position.lat + ', ' + position.lng);
                  }
                })
                .catch((error) => console.error("Error:", error));

            } else {

              customMarkers.setLatLng([feature.geometry.coordinates[0], feature.geometry.coordinates[1]])
              alert('Base Location not confirmed');
            }
          });
        } else if (category === "Request Pending") {

          var info_citizen = `<div style="max-height: 200px; overflow-y: auto;">
          <p><strong>Citizen</strong><br>
          <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
          <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
          ----------------------------------`;


          feature.properties.details.forEach((request) => {
            info = `<br><strong>Request</strong><br>
            <strong>Pickup date:</strong> ${request.submission_date}<br>
            <strong>Itam name:</strong> ${request.item_name}<br>
            <strong>Quantity:</strong> ${request.quantity}<br>
            ----------------------------------`;
            info_citizen = info_citizen + info;
          });

          info_citizen = info_citizen + `</p></div>`;

          customMarkers.bindPopup(info_citizen);

        } else if (category === "Request Accepted") {

          var info_citizen = `<div style="max-height: 200px; overflow-y: auto;">
          <p><strong>Citizen</strong><br>
          <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
          <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
          ----------------------------------`;

          feature.properties.details.forEach((request) => {
            info = `<br><strong>Request</strong><br>
            <strong>Pickup date:</strong> ${request.submission_date}<br>
            <strong>Itam name:</strong> ${request.item_name}<br>
            <strong>Quantity:</strong> ${request.quantity}<br>
            <strong>Quantity:</strong> ${request.quantity}<br>
            <strong>Quantity:</strong> ${request.quantity}<br>
            ----------------------------------`;
            info_citizen = info_citizen + info;
          });

          info_citizen = info_citizen + `</p></div>`;
          customMarkers.bindPopup(info_citizen);
        }



        markersLayers[category].addLayer(customMarkers);
        markersLayers[category].addTo(map);
      });




      L.control.layers(null, markersLayers,).addTo(map);



    })
    .catch(error => console.error('Error:', error));








});


