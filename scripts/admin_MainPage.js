document.addEventListener('DOMContentLoaded', function () {

  var map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  var markersLayers = {};
   markersLayers["lines"] = L.layerGroup();

  var linesLayer = L.layerGroup().addTo(map);

  fetch('/server/map_admin/map.php')
    .then(response => response.json())
    .then(data => {

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
            } else if (category === "Offer Accepted") {
              return L.icon({
                iconUrl: '/leaflet/images/offer-green.png',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -15]
              });
            } else if (category === "Offer Pending") {
              return L.icon({
                iconUrl: '/leaflet/images/offer-red.png',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -15]
              });
            } else if (category === "Truck Active") {
              return L.icon({
                iconUrl: '/leaflet/images/marker-truck-green.png',
                iconSize: [50, 50],
                iconAnchor: [15, 15],
                popupAnchor: [0, -15]
              });
            } else if (category === "Truck Inactive") {
              return L.icon({
                iconUrl: '/leaflet/images/marker-truck-red.png',
                iconSize: [40, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -15]
              });
            }
          })(),
          draggable: category === "Base",
          draggable: category === "Truck Active"
        });
    
        var line = {};

        if (category === "Base") {

          customMarkers.bindPopup('<strong>Base</strong>');

          customMarkers.on('dragend', function (event) {
            let marker = event.target;
            let position = marker.getLatLng();

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

          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Citizen</strong><br>
          <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
          <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
          ----------------------------------`;

          feature.properties.details.forEach((request) => {
            var info = `<br><strong>Request</strong><br>
            <strong>Submission date:</strong> ${request.submission_date}<br>
            <strong>Item:</strong> ${request.item_name}<br>
            <strong>Quantity:</strong> ${request.quantity}<br>
            ----------------------------------`;
            info_citizen = info_citizen + info;
          });

          info_citizen = info_citizen + `</div>`;

          customMarkers.bindPopup(info_citizen);

        } else if (category === "Request Accepted") {

          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Citizen</strong><br>
          <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
          <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
          ----------------------------------`;

          feature.properties.details.forEach((request) => {
            var info = `<br><strong>Request</strong><br>
            <strong>Submission date:</strong> ${request.submission_date}<br>
            <strong>Item:</strong> ${request.item_name}<br>
            <strong>Quantity:</strong> ${request.quantity}<br>
            <strong>Pickup date:</strong> ${request.pickup_date}<br>
            <strong>Vehicle username:</strong> ${request.vehicle_username}<br>
            ----------------------------------`;
            info_citizen = info_citizen + info;
          });

          info_citizen = info_citizen + `</div>`;
          customMarkers.bindPopup(info_citizen);
        } else if (category === "Offer Accepted") {
          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Citizen</strong><br>
          <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
          <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
          ----------------------------------`;

          feature.properties.details.forEach((offer) => {
            var info = `<br><strong>Offer</strong><br>
            <strong>Submission date:</strong> ${offer.submission_date}<br>
            <strong>Pickup date:</strong> ${offer.pickup_date}<br>
            <strong>Vehicle username:</strong> ${offer.vehicle_username}<br>`;

            offer.items.forEach((item) => {
              info = info + `<br><strong>Item:</strong> ${item.item_name}<br>
               <strong>Quantity:</strong> ${item.quantity}<br>`;
            });

            info_citizen = info_citizen + info + ` ----------------------------------`;
          });

          info_citizen = info_citizen + `</div>`;
          customMarkers.bindPopup(info_citizen);

        } else if (category === "Offer Pending") {
          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Citizen</strong><br>
          <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
          <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
          ----------------------------------`;

          feature.properties.details.forEach((offer) => {
            var info = `<br><strong>Offer</strong><br>
            <strong>Submission date:</strong> ${offer.submission_date}<br>`

            offer.items.forEach((item) => {
              info = info + `<br><strong>Item:</strong> ${item.item_name}<br>
               <strong>Quantity:</strong> ${item.quantity}<br>`
            });

            info_citizen = info_citizen + info + ` ----------------------------------`;
          });

          info_citizen = info_citizen + `</div>`;
          customMarkers.bindPopup(info_citizen);
        } else if (category === "Truck Active") {
          var info_truck = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Truck</strong><br>
          <strong>Username:</strong> ${feature.properties.vehicle_username}<br>
          <strong>Status:</strong> ${feature.properties.category}<br>
          ----------------------------------`;

          feature.properties.requests.forEach((cargo) => {
            var info = `<br><strong>Request</strong><br>
            <strong>Item name:</strong> ${cargo.item_name}<br>
            <strong>Quantity:</strong> ${cargo.quantity}<br>`

            data.features.forEach((detail) => {

              if (detail.properties.category === "Request Pending" || detail.properties.category === "Request Accepted") {
                detail.properties.details.forEach((id) => {
                  if (id.request_id === cargo.request_id) {

                    const line_details = L.polyline([
                      [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
                      [detail.geometry.coordinates[0], detail.geometry.coordinates[1]]
                    ], {
                      color: 'blue',
                      dashArray: '5, 10'
                    }).addTo(linesLayer);
                  }
                });
              }
            });

            info_truck = info_truck + info + ` ----------------------------------`;
          });

          feature.properties.offers.forEach((cargo) => {
            var info = `<br><strong>Offer</strong><br>`

            cargo.items.forEach((item) => {
              info = info + `<br><strong>Item:</strong> ${item.item_name}<br>
              <strong>Quantity:</strong> ${item.quantity}<br>`
            });

            info_truck = info_truck + info + ` ----------------------------------`;
          });

          info_truck = info_truck + `</div>`;
          customMarkers.bindPopup(info_truck);
        }
        

        markersLayers[category].addLayer(customMarkers);
        markersLayers[category].addTo(map);

        if (category === "Truck Active") {
          customMarkers.on('drag', function (event) {
            const marker = event.target;
            const position = marker.getLatLng();

            markersLayers["lines"].eachLayer(line => {
              const line_position = line.getLatLngs();
              const line_end1 = line_position[0].lat === feature.geometry.coordinates[0] && line_position[0].lng === feature.geometry.coordinates[1];
              const line_end2 = line_position[1].lat === feature.geometry.coordinates[0] && line_position[1].lng === feature.geometry.coordinates[1];

              if (line_end1 || line_end2) {
                let line_update;
                if (line_end1) {
                  line_update = [position.lat, position.lng];
                } else {
                  line_update = line_position[0];
                }

                if (line_end2) {
                  line.setLatLngs([
                    line_update,
                    [position.lat, position.lng]
                  ]);
                } else {
                  line.setLatLngs([
                    line_update,
                    line_position[1]
                  ]);
                }
              }
            });

            feature.geometry.coordinates[0] = position.lat;
            feature.geometry.coordinates[1] = position.lng;
          });



          map.on('layerremove', function (event) {
            var removedLayer = event.layer;
            console.log(removedLayer);
            if (removedLayer === "Request Pending") {
              const marker = event.target;
              const position = marker.getLatLng();

              markersLayers["lines"].eachLayer(line => {
                const line_position = line.getLatLngs();
                const line_end1 = line_position[0].lat === marker.geometry.coordinates[0] && line_position[0].lng === feature.geometry.coordinates[1];
                const line_end2 = line_position[1].lat === marker.geometry.coordinates[0] && line_position[1].lng === feature.geometry.coordinates[1];

                if (line_end1 || line_end2) {
                 linesLayer.removeLayer(line);
                }
              });

            }
          });


          /*map.on('layeradd', function (event) {
            var addedLayer = event.layer;
            if (addedLayer === markerGroup1) {
              linesLayer.addLayer(line1);
            } else if (addedLayer === markerGroup2) {
              linesLayer.addLayer(line1);
              linesLayer.addLayer(line2);
            } else if (addedLayer === markerGroup3) {
              linesLayer.addLayer(line2);
            }
          });*/


        }


      });

      linesLayer.eachLayer(layer =>{
        console.log(getLayersId(layer));
      });



      markersLayers["lines"]=linesLayer;
      L.control.layers(null,markersLayers).addTo(map);

    })
    .catch(error => console.error('Error:', error));

});


