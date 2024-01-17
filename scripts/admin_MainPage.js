var map;
var map_control;
var layerSelected;

document.addEventListener('DOMContentLoaded', function () {

  var map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);



  layerSelected = {
    "Request Pending": true,
    "Request Accepted": true,
    "Offer Accepted": true,
    "Offer Pending": true,
    "Truck Active": true,
    "Truck Inactive": true,
    "Lines": true,
    "Base": true,
  };


  var markersLayers = {};
  markersLayers["Lines"] = L.layerGroup();
  var geoJson;

  fetch('/server/map_admin/map.php')
    .then(response => response.json())
    .then(data => {

      data.features.forEach((feature, index) => {
        const category = feature.properties.category;

        if (!markersLayers[category]) {
          markersLayers[category] = L.layerGroup();
        }
        var check = 0;

        data.features.forEach((features_check, index_check) => {
          if (features_check.geometry.coordinates[0] === feature.geometry.coordinates[0] &&
            features_check.geometry.coordinates[1] === feature.geometry.coordinates[1] &&
            (category !== "Base" || category !== "Truck Active" || category !== "Truck Inactive") &&
            index !== index_check) {
            check = 1;
          }

        });

        const customMarkers = L.marker([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
          icon: (function () {
            if (category === "Base") {
              return L.icon({
                iconUrl: '/leaflet/images/offices.png',
                iconSize: [50, 50],
                iconAnchor: [25, 50],
                popupAnchor: [0, -52],
              });
            } else if (category === "Request Pending") {
              if (check === 0) {
                return L.icon({
                  iconUrl: `/leaflet/images/request-red.png`,
                  iconSize: [40, 40],
                  iconAnchor: [19, 34],
                  popupAnchor: [2.5, -20]
                });
              } else {
                return L.icon({
                  iconUrl: `/leaflet/images/request-red-rotate.png`,
                  iconSize: [40, 40],
                  iconAnchor: [8, 34],
                  popupAnchor: [13, -35]
                });
              }
            } else if (category === "Request Accepted") {
              if (check === 0) {
                return L.icon({
                  iconUrl: '/leaflet/images/request-green.png',
                  iconSize: [40, 40],
                  iconAnchor: [19, 34],
                  popupAnchor: [0, -15]
                });
              } else {
                return L.icon({
                  iconUrl: '/leaflet/images/request-green-rotate.png',
                  iconSize: [40, 40],
                  iconAnchor: [8, 34],
                  popupAnchor: [15, -35]
                });
              }
            } else if (category === "Offer Accepted") {
              if (check === 0) {
                return L.icon({
                  iconUrl: '/leaflet/images/offer-green.png',
                  iconSize: [40, 40],
                  iconAnchor: [20.5, 38],
                  popupAnchor: [0, -15]
                });
              } else {
                return L.icon({
                  iconUrl: '/leaflet/images/offer-green-rotate.png',
                  iconSize: [40, 40],
                  iconAnchor: [34, 35],
                  popupAnchor: [-20, -35]
                });
              }
            } else if (category === "Offer Pending") {
              if (check === 0) {
                return L.icon({
                  iconUrl: `/leaflet/images/offer-red.png`,
                  iconSize: [40, 40],
                  iconAnchor: [19, 34],
                  popupAnchor: [0, -15]
                });
              } else {
                return L.icon({
                  iconUrl: `/leaflet/images/offer-red-rotate.png`,
                  iconSize: [40, 40],
                  iconAnchor: [34, 35],
                  popupAnchor: [-17, -35]
                });
              }
            } else if (category === "Truck Active") {
              return L.icon({
                iconUrl: '/leaflet/images/marker-truck-green.png',
                iconSize: [50, 50],
                iconAnchor: [25, 43],
                popupAnchor: [0, -15]
              });
            } else if (category === "Truck Inactive") {
              return L.icon({
                iconUrl: '/leaflet/images/marker-truck-red.png',
                iconSize: [50, 50],
                iconAnchor: [25, 43],
                popupAnchor: [0, -15]
              });
            }
          })(),
          draggable:
            category === "Base",
            
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
          var offers = [];
          var info_citizen = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Citizen</strong><br>
          <strong>Name:</strong> ${feature.properties.first_name} ${feature.properties.last_name}<br>
          <strong>Phone number:</strong> ${feature.properties.phone_number}<br>
          ----------------------------------`;


          feature.properties.details.forEach((offer) => {

            if (offer.vehicle_id === null) {
              var info = `<br><strong>Offer</strong><br>
            <strong>Submission date:</strong> ${offer.submission_date}<br>`

              offer.items.forEach((item) => {
                info = info + `<br><strong>Item:</strong> ${item.item_name}<br>
               <strong>Quantity:</strong> ${item.quantity}<br>`
              });

              info_citizen = info_citizen + info
                + ` ----------------------------------`;
              offers.push(offer.offer_id);
            } else {
              var info = `<br><strong>Offer</strong><br>
              <strong>Submission date:</strong> ${offer.submission_date}<br>
              <strong>Pickup date:</strong> ${offer.pickup_date}<br>
              <strong>Vehicle username:</strong> ${offer.vehicle_username}<br>`;

              offer.items.forEach((item) => {
                info = info + `<br><strong>Item:</strong> ${item.item_name}<br>
                 <strong>Quantity:</strong> ${item.quantity}<br>`;
              });
              info_citizen = info_citizen + info + ` ----------------------------------`;
              offers.push(offer.offer_id);
            }
          });

          info_citizen = info_citizen + `</div>`;
          customMarkers.bindPopup(info_citizen);
          customMarkers.options.offer_id = offers;
        } else if (category === "Truck Active") {
          var info_truck = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Truck</strong><br>
          <strong>Username:</strong> ${feature.properties.vehicle_username}<br>
          <strong>Status:</strong> ${feature.properties.category}<br>
          ----------------------------------`;


          if (feature.properties.cargo.length === 0) {
            var info = `<br>The truck do not have any cargo`
            info_truck = info_truck + info;
          } else {
            info_truck = info_truck + `<br><strong>Cargo</strong><br>`

            feature.properties.cargo.forEach(cargo => {
              var info = `<strong>Item name:</strong> ${cargo.item_name}<br>
              <strong>Quantity:</strong> ${cargo.quantity}<br><br>`
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
        } else if (category === "Truck Inactive") {
          var info_truck = `<div style="max-height: 150px; overflow-y: auto;">
          <strong>Truck</strong><br>
          <strong>Username:</strong> ${feature.properties.vehicle_username}<br>
          <strong>Status:</strong> ${feature.properties.category}<br>
          ----------------------------------`;


          if (feature.properties.cargo.length === 0) {
            var info = `<br>The truck do not have any cargo`
            info_truck = info_truck + info;
          } else {
            info_truck = info_truck + `<br><strong>Cargo</strong><br>`

            feature.properties.cargo.forEach(cargo => {
              var info = `<strong>Item name:</strong> ${cargo.item_name}<br>
              <strong>Quantity:</strong> ${cargo.quantity}<br><br>`
              info_truck = info_truck + info;
            });
          }
          info_truck = info_truck + `</div>`;
          customMarkers.bindPopup(info_truck);
        }


        markersLayers[category].addLayer(customMarkers);
        markersLayers[category].addTo(map);

      });


      map.on('layerremove', function (event) {
        var removedLayer = event.layer;
        layerSelected[removedLayer.options.category] = false;

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
        } else if (removedLayer.options.category === "Offer Pending") {
          markersLayers["Lines"].eachLayer(line => {
            if (removedLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 0 });
            }
          });
        } else if (removedLayer.options.category === "Truck Active") {
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.offers.forEach(offer => {
                  if (offer.offer_id === line.options.offer_id) {
                    line.setStyle({ opacity: 0 });
                  }
                })
              }
            })
          });
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.requests.forEach(offer => {
                  if (offer.request_id === line.options.request_id) {
                    line.setStyle({ opacity: 0 });
                  }
                })
              }
            })
          });
        }
      });

      map.on('layeradd', function (event) {
        var addLayer = event.layer;

        if (addLayer.options.category === "Request Pending") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {
            if (addLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        } else if (addLayer.options.category === "Request Accepted") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {

            if (addLayer.options.request_id.find(id => id === line.options.request_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        } else if (addLayer.options.category === "Offer Accepted") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {
            if (addLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        } else if (addLayer.options.category === "Offer Pending") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {
            if (addLayer.options.offer_id.find(id => id === line.options.offer_id)) {
              line.setStyle({ opacity: 1 });
            }
          });
        } else if (addLayer.options.category === "Truck Active") {
          layerSelected[addLayer.options.category] = true;
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.offers.forEach(offer => {
                  if (offer.offer_id === line.options.offer_id) {
                    line.setStyle({ opacity: 1 });
                  }
                })
              }
            })
          });
          markersLayers["Lines"].eachLayer(line => {
            data.features.forEach(feature => {
              if (feature.properties.category === "Truck Active") {
                feature.properties.requests.forEach(offer => {
                  if (offer.request_id === line.options.request_id) {
                    line.setStyle({ opacity: 1 });
                  }
                })
              }
            })
          });
        } else if (addLayer.options.category === "Truck Inactive") {
          layerSelected[addLayer.options.category] = true;
        } else if (addLayer.options.category === "Lines") {
          layerSelected[addLayer.options.category] = true;
        }
      });

      markersLayers["Lines"].addTo(map);
      L.control.layers(null, markersLayers).addTo(map);


    })
    .catch(error => console.error('Error:', error));

});


