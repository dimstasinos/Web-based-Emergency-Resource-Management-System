document.addEventListener('DOMContentLoaded', function () {

  var map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  var markersLayers = {};

  markersLayers["Lines"] = L.layerGroup();

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
                iconSize: [50, 50],
                iconAnchor: [15, 15],
                popupAnchor: [0, -15]
              });
            }
          })(),
          draggable: category === "Base" ||
            category === "Truck Active" ||
            category === "Truck Inactive",
          category: (function () {
            if (category === "Base") {
              return "Base";
            } else if (category === "Request Pending") {
              return "Request Pending";
            } else if (category === "Request Accepted") {
              return "Request Accepted";
            } else if (category === "Offer Accepted") {
              return "Offer Accepted";
            } else if (category === "Offer Pending") {
              return "Offer Pending";
            } else if (category === "Truck Active") {
              return "Truck Active";
            } else if (category === "Truck Inactive") {
              return "Truck Inactive";
            }
          })(),
          id: (function () {
            if (category === "Base") {
              return 1;
            } else if (category === "Request Pending") {
              return parseInt(feature.properties.citizen_id);
            } else if (category === "Request Accepted") {
              return parseInt(feature.properties.citizen_id);
            } else if (category === "Offer Accepted") {
              return parseInt(feature.properties.citizen_id);
            } else if (category === "Offer Pending") {
              return parseInt(feature.properties.citizen_id);
            } else if (category === "Truck Active") {
              return parseInt(feature.properties.vehicle_id);
            } else if (category === "Truck Inactive") {
              return parseInt(feature.properties.vehicle_id);
            }
          })(),
        });



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
          var requests = [];
          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Citizen</strong><br>
          <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
          <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
          ----------------------------------`;

          feature.properties.details.forEach((request) => {
            if (request.vehicle_id === null) {
              var info = `<br><strong>Request</strong><br>
            <strong>Submission date:</strong> ${request.submission_date}<br>
            <strong>Item:</strong> ${request.item_name}<br>
            <strong>Quantity:</strong> ${request.quantity}<br>
            ----------------------------------`;
            } else {
              var info = `<br><strong>Request</strong><br>
              <strong>Submission date:</strong> ${request.submission_date}<br>
              <strong>Item:</strong> ${request.item_name}<br>
              <strong>Quantity:</strong> ${request.quantity}<br>
              <strong>Pickup date:</strong> ${request.pickup_date}<br>
              <strong>Vehicle username:</strong> ${request.vehicle_username}<br>
              ----------------------------------`;
            }
            info_citizen = info_citizen + info;
            requests.push(request.request_id);
          });


          info_citizen = info_citizen + `</div>`;


          customMarkers.bindPopup(info_citizen);
          customMarkers.options.request_id = requests;


        } else if (category === "Request Accepted") {
          var requests = [];
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
            requests.push(request.request_id);
          });

          info_citizen = info_citizen + `</div>`;
          customMarkers.bindPopup(info_citizen);
          customMarkers.options.request_id = requests;
        } else if (category === "Offer Accepted") {
          var offers = [];
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

            offers.push(offer.offer_id);
            info_citizen = info_citizen + info + ` ----------------------------------`;
          });

          info_citizen = info_citizen + `</div>`;
          customMarkers.bindPopup(info_citizen);
          customMarkers.options.offer_id = offers;

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

          console.log(feature.properties.cargo.lenght);
          if (feature.properties.cargo.lenght===0) {
            var info = `<br>The truck do not have any cargo`
            info_truck = info_truck + info;
          } else {
            feature.properties.cargo.forEach(cargo => {
              var info = `<br><strong>Cargo</strong><br>
            <strong>Item name:</strong> ${cargo.item_name}<br>
            <strong>Quantity:</strong> ${cargo.quantity}<br>`
              info_truck = info_truck + info;
            });
          }
          feature.properties.requests.forEach((cargo) => {
            data.features.forEach((detail) => {
              if (detail.properties.category === "Request Pending" || detail.properties.category === "Request Accepted") {
                detail.properties.details.forEach((id) => {
                  if (id.request_id === cargo.request_id) {

                    const line_details = L.polyline([
                      [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
                      [detail.geometry.coordinates[0], detail.geometry.coordinates[1]]
                    ], {
                      color: 'blue',
                      dashArray: '5, 10',
                      interactive: false,
                      truck_id: parseInt(feature.properties.vehicle_id),
                      request_id: id.request_id
                    }).addTo(markersLayers["Lines"]);
                  }
                });
              }
            });
          });

          feature.properties.offers.forEach((cargo) => {
            data.features.forEach((detail) => {
              if (detail.properties.category === "Offer Pending" || detail.properties.category === "Offer Accepted") {
                detail.properties.details.forEach((id) => {
                  if (id.offer_id === cargo.offer_id) {

                    const line_details = L.polyline([
                      [feature.geometry.coordinates[0], feature.geometry.coordinates[1]],
                      [detail.geometry.coordinates[0], detail.geometry.coordinates[1]]
                    ], {
                      color: 'blue',
                      dashArray: '5, 10',
                      interactive: false,
                      truck_id: parseInt(feature.properties.vehicle_id),
                      offer_id: id.offer_id
                    }).addTo(markersLayers["Lines"]);
                  }
                });
              }
            });
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


            markersLayers["Lines"].eachLayer(line => {
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

          customMarkers.on('dragend', function (event) {
            const marker = event.target;

            if (marker.options.category === "Truck Active") {
              const position = marker.getLatLng();

              const data = {
                id: marker.options.id,
                lat: position.lat,
                lng: position.lng,
              };

              fetch("/server/map_admin/truck_upload.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then(data => {

                })
                .catch((error) => console.error("Error:", error));
            }
          });

        }
      });


      map.on('layerremove', function (event) {
        var removedLayer = event.layer;

        if (removedLayer.options.category === "Request Pending") {
          markersLayers["Lines"].eachLayer(line => {
            if (removedLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 0 });
            }
          });
        } else if (removedLayer.options.category === "Request Accepted") {

          markersLayers["Lines"].eachLayer(line => {
            if (removedLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 0 });
            }
          });
        } else if (removedLayer.options.category === "Offer Accepted") {

          markersLayers["Lines"].eachLayer(line => {
            if (removedLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 0 });
            }
          });
        }
      });

      map.on('layeradd', function (event) {
        var addLayer = event.layer;

        if (addLayer.options.category === "Request Pending") {

          markersLayers["Lines"].eachLayer(line => {

            if (addLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 1 });
            }

          });
        } else if (addLayer.options.category === "Request Accepted") {

          markersLayers["Lines"].eachLayer(line => {

            if (addLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        } else if (addLayer.options.category === "Offer Accepted") {

          markersLayers["Lines"].eachLayer(line => {
            if (addLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        }
      });

      markersLayers["Lines"].addTo(map);
      L.control.layers(null, markersLayers).addTo(map);


    })
    .catch(error => console.error('Error:', error));

});


