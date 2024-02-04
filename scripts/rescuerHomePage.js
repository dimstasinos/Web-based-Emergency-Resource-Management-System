//Global μεταβλητές
var map;
var map_control;
var layerSelected;

//Event listener που εκτελείτε όταν φορτωθεί η HTML
document.addEventListener('DOMContentLoaded', function () {

  //Ανάκτηση πληροφοριών του Session
  fetch("/server/get_Session_info.php")
    .then((jsonResponse) => jsonResponse.json())
    .then(data => {
      if (data.status === "success") {
        document.getElementById("text").textContent = data.response.Name;
      } else {
        console.error("Server Error:", data.Error);
      }
    })
    .catch((error) => console.error("Error:", error));

  //Αρχικοιποίηση χάρτη
  map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);


  //Αρχικοποίηση Object για την  
  //λειτουργία των φίλτρων του χάρτη
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

  //Μεταβλητή που περιέχει τις κατηγορίες των markers
  //που θα υπάρχουν στον χάρτη
  var markersLayers = {};

  //Αποθήκευση του layer των γραμμών
  markersLayers["Lines"] = L.layerGroup();

  var geoJson;

  //Χρήση Fetch API για την παραλαβή των 
  //δεδομένων του χάρτη από τον server
  fetch('/server/rescuer/rescuer_geojson.php')
    .then(response => response.json())
    .then(data => {

      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        geoJson = data;

        //Προσπέλαση του JSON
        data.features.forEach((feature, index) => {

          //Κατηγορία του feuture
          const category = feature.properties.category;

          //Έλεγχος εάν υπάρχει ήδη αυτή η κατηγορία
          //ως layergroup
          if (!markersLayers[category]) {
            markersLayers[category] = L.layerGroup();
          }

          var check = 0;

          //Έλεγχος εάν ο χρήστης έχει προσφορές και αιτήματα ταυτόχρονα
          data.features.forEach((features_check, index_check) => {
            if (features_check.geometry.coordinates[0] === feature.geometry.coordinates[0] &&
              features_check.geometry.coordinates[1] === feature.geometry.coordinates[1] &&
              (category !== "Base" || category !== "Truck Active" || category !== "Truck Inactive") &&
              index !== index_check) {
              check = 1;
            }

          });

          //Επιλογή σωστού marker για κάθε κατηγορία feature του GeoJson και αρχικοποίησή του
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
                    popupAnchor: [0, -35]
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
                    popupAnchor: [0, -35]
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
                    popupAnchor: [0, -35]
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
                    popupAnchor: [0, -35]
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
                  popupAnchor: [0, -40]
                });
              } else if (category === "Truck Inactive") {
                return L.icon({
                  iconUrl: '/leaflet/images/marker-truck-red.png',
                  iconSize: [50, 50],
                  iconAnchor: [25, 43],
                  popupAnchor: [0, -40]
                });
              }
            })(),
            draggable:
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

            //Τοποθέτηση pop-up
            customMarkers.bindPopup('<strong>Base</strong>');

          } else if (category === "Request Pending") {

            //Αρχικοποίηση και τοποθέτηση pop-up
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
            <button id="${request.request_id}">Αποδοχή</button><br>
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

            //Αρχικοποίηση και τοποθέτηση pop-up
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

            //Αρχικοποίηση και τοποθέτηση pop-up
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

            //Αρχικοποίηση και τοποθέτηση pop-up
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

                info_citizen = info_citizen + info + ` <button id="${offer.offer_id}">Αποδοχή</button><br>`
                  + ` ----------------------------------`;
                offers.push(offer.offer_id);
              } else {

                //Αρχικοποίηση και τοποθέτηση pop-up
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

            //Αρχικοποίηση και τοποθέτηση pop-up
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

            //Τοποθέτηση γραμμών στον χάρτη προς τα αιτήματα
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

            //Τοποθέτηση γραμμών στον χάρτη προς τις προσφορές
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

            //Αρχικοποίηση και τοποθέτηση pop-up
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

          //Τοποθέτηση marker στον χάρτη
          markersLayers[category].addLayer(customMarkers);
          markersLayers[category].addTo(map);


          if (category === "Request Pending") {

            //Event Listener που ελέγχει εάν ένα όχημα μπορεί να αναλάβει
            //το αίτημα
            customMarkers.on('popupopen', function () {
              customMarkers.options.request_id.forEach(id => {
                data.features.forEach(feature => {
                  if (feature.properties.category === "Request Pending") {
                    feature.properties.details.forEach(detail => {
                      if (detail.request_id === id && detail.vehicle_id === null) {
                        document.getElementById(id).addEventListener('click', function () {
                          data.features.forEach(feature => {
                            if (feature.properties.category === "Truck Active" || feature.properties.category === "Truck Inactive") {
                              if ((feature.properties.requests.length + feature.properties.offers.length) < 4) {

                                const data = {
                                  request: detail.request_id,
                                };

                                //Αποστολή στον server για αποδοχή του task
                                fetch("/server/rescuer/accept_request.php", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(data),
                                })
                                  .then((response) => response.json())
                                  .then((data) => {
                                    if (data.status === "success") {
                                      mapPanelRefresh();
                                    } else {
                                      console.error("Server Error:", data.Error);
                                    }
                                  })
                                  .catch((error) => console.error("Error:", error));
                              } else {
                                alert("Το όχημα δεν μπορεί να αναλάβει άλλο task");
                              }
                            }
                          })
                        });
                      }
                    });
                  }
                });
              });
            });
          } else if (category === "Offer Pending") {

            //Event Listener που ελέγχει εάν ένα όχημα μπορεί να αναλάβει
            //την προσφορά
            customMarkers.on('popupopen', function () {
              customMarkers.options.offer_id.forEach(id => {
                data.features.forEach(feature => {
                  if (feature.properties.category === "Offer Pending") {
                    feature.properties.details.forEach(detail => {
                      if (detail.offer_id === id && detail.vehicle_id === null) {
                        document.getElementById(id).addEventListener('click', function () {
                          data.features.forEach(feature => {
                            if (feature.properties.category === "Truck Active" || feature.properties.category === "Truck Inactive") {
                              if ((feature.properties.requests.length + feature.properties.offers.length) < 4) {

                                const data = {
                                  offer: detail.offer_id,
                                };

                                //Αποστολή στον server για την αποδοχή του task
                                fetch("/server/rescuer/accept_offer.php", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(data),
                                })
                                  .then((response) => response.json())
                                  .then((data) => {

                                    if (data.status === "success") {
                                      //Συνάρτηση που ανανεώνει τον χάρτη
                                      mapPanelRefresh();
                                    } else {
                                      console.error("Server Error:", data.Error);
                                    }

                                  })
                                  .catch((error) => console.error("Error:", error));
                              } else {
                                alert("Το όχημα δεν μπορεί να αναλάβει άλλο task")
                              }
                            }
                          })
                        });
                      }
                    });
                  }
                });
              });
            });


          }

          if (category === "Truck Active") {

            //Event listener που ενημερώνει τις γραμμές ανάλογα με την θέση του
            //marker του οχήαμτος
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



            //Event Listener που αποστέλει την θέση του οχήματος στον server
            customMarkers.on('dragend', function (event) {
              const marker = event.target;

              if (marker.options.category === "Truck Active") {
                const position = marker.getLatLng();

                //Συλογή δεδομένων για αποστολή
                const data = {
                  id: marker.options.id,
                  lat: position.lat,
                  lng: position.lng,
                };

                //Αποστολή των δεδομένων στον server
                fetch("/server/rescuer/truck_upload.php", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                })
                  .then((response) => response.json())
                  .then(data => {

                    if (data.status === "error") {
                      console.error("Server Error:", data.Error);
                    }

                  })
                  .catch((error) => console.error("Error:", error));
              }
            });

          }

          if (category === "Truck Inactive") {

            //Event Listener που αποστέλει την θέση του οχήματος στον server
            customMarkers.on('dragend', function (event) {
              const marker = event.target;

              if (marker.options.category === "Truck Inactive") {
                const position = marker.getLatLng();

                //Συλογή δεδομένων για αποστολή
                const data = {
                  id: marker.options.id,
                  lat: position.lat,
                  lng: position.lng,
                };

                //Αποστολή των δεδομένων στον server
                fetch("/server/rescuer/truck_upload.php", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                })
                  .then((response) => response.json())
                  .then(data => {
                    if (data.status === "error") {
                      console.error("Server Error:", data.Error);
                    }
                  })
                  .catch((error) => console.error("Error:", error));
              }
            });
          }
        });

        //Μεταβλητή που αποθηκεύει την απόσταση
        var distanceMarker;

        //Υπολογισμός της απόστασης από την βάση
        if ("Truck Active" in markersLayers) {
          markersLayers["Truck Active"].eachLayer(truck => {

            markersLayers["Base"].eachLayer(Base => {

              distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

            });
          })
        }

        //Υπολογισμός της απόστασης από την βάση
        if ("Truck Inactive" in markersLayers) {
          markersLayers["Truck Inactive"].eachLayer(truck => {

            markersLayers["Base"].eachLayer(Base => {

              distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

            });
          })
        }

        //Ενεργοποίηση/Απενεργοποίηση των κουμπιών φόρτωση και εκφόρτωση
        if (distanceMarker < 100) {
          document.getElementById("load").disabled = false;
          document.getElementById("unload").disabled = false;
        } else {
          document.getElementById("load").disabled = true;
          document.getElementById("unload").disabled = true;
        }


        if ("Truck Active" in markersLayers) {
          markersLayers["Truck Active"].eachLayer(truck => {

            markersLayers["Base"].eachLayer(Base => {

              //Υπολογισμός απόστασης του οχήματος από την βάση
              truck.on("drag", function () {
                distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

                //Ενεργοποίηση/Απενεργοποίηση των κουμπιών φόρτωση και εκφόρτωση
                if (distanceMarker < 100) {
                  document.getElementById("load").disabled = false;
                  document.getElementById("unload").disabled = false;
                } else {
                  document.getElementById("load").disabled = true;
                  document.getElementById("unload").disabled = true;
                }
              });

            });
          })
        }

        if ("Truck Inactive" in markersLayers) {
          markersLayers["Truck Inactive"].eachLayer(truck => {

            markersLayers["Base"].eachLayer(Base => {

              //Υπολογισμός απόστασης του οχήματος από την βάση
              truck.on("drag", function () {
                distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

                //Ενεργοποίηση/Απενεργοποίηση των κουμπιών φόρτωση και εκφόρτωση
                if (distanceMarker < 100) {
                  document.getElementById("load").disabled = false;
                  document.getElementById("unload").disabled = false;
                } else {
                  document.getElementById("load").disabled = true;
                  document.getElementById("unload").disabled = true;
                }
              });

            });
          })
        }

        //Event listener που διαγράφει συγκεκριμένες γραμμές στον χάρτη
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

        //Event listener που εμφανίζει συγκεκριμένες γραμμές στον χάρτη
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
            //Αλλαγή μεταβλητής στο Oject σε true
            layerSelected[addLayer.options.category] = true;
          } else if (addLayer.options.category === "Lines") {
            layerSelected[addLayer.options.category] = true;
          }
        });

        //Τοποθέτηση γραμμών στον χάρτη
        markersLayers["Lines"].addTo(map);

        //Τοποθέτηση Φίλτρων στον χάρτη
        map_control = L.control.layers(null, markersLayers).addTo(map);

        //Εμφάνιση φορτίου του οχήματος
        truck_cargo(data);

        //Επικοινωνία με τον server για εμφάνιση των tasks που
        //έχει αναλάβει το όχημα
        fetch("/server/rescuer/rescuer_tasks.php")
          .then(response => response.json())
          .then(data => {

            if (data.status === "error") {
              console.error("Server Error:", data.Error);
            } else {

              const panel = document.getElementById("tasks_info");

              panel.innerHTML = "";

              //Δημιουργία του πίνακα
              data.requests.forEach(request => {
                const row_table = document.createElement("tr");
                const name = document.createElement("td");
                const phone_number = document.createElement("td");
                const type = document.createElement("td");
                const date = document.createElement("td");
                const item = document.createElement("td");
                const quantity = document.createElement("td");
                const action = document.createElement("td");

                name.textContent = request.citizen_name;
                phone_number.textContent = request.phone_number;
                type.textContent = "Request";
                const date_sub = request.submission_date.split(' ');
                date.innerHTML = date_sub[0] + "<br>" + date_sub[1];
                item.textContent = request.item_name
                quantity.textContent = request.quantity;
                action.innerHTML = `
              <button class="accept" id="request_${request.request_id}_accept">Ολοκλήρωση</button>
              <button class="decline" id="request_${request.request_id}_cancel">Ακύρωση</button>`;

                row_table.appendChild(name);
                row_table.appendChild(phone_number);
                row_table.appendChild(type);
                row_table.appendChild(date);
                row_table.appendChild(item);
                row_table.appendChild(quantity);
                row_table.appendChild(action);
                panel.appendChild(row_table);


                //Event Listener για την ακύρωση κάποιου αιτήματος
                document.getElementById(`request_${request.request_id}_cancel`).addEventListener("click", function () {

                  const data = {
                    id: request.request_id,
                  };

                  //Επικοινωνία με τον server για την ακύρωση του
                  //αιτήματος
                  fetch("/server/rescuer/cancel_request.php", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (data.status === "success") {
                        mapPanelRefresh();
                      } else {
                        console.error("Server Error:", data.Error);
                      }
                    })
                    .catch((error) => console.error("Error:", error));
                });

                //Αποθήκευση απόστασης
                var distanceMarker;

                //Υπολογισμός απόστασης από το αίτημα
                if ("Request Pending" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    markersLayers["Request Pending"].eachLayer(requestLayerPending => {

                      requestLayerPending.options.request_id.forEach(idCheck => {

                        if (idCheck === request.request_id) {
                          distanceMarker = layer.getLatLng().distanceTo(requestLayerPending.getLatLng());
                        }
                      });
                    })
                  });
                }

                //Υπολογισμός απόστασης από το αίτημα
                if ("Request Accepted" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {
                    markersLayers["Request Accepted"].eachLayer(requestLayerAccepted => {
                      requestLayerAccepted.options.request_id.forEach(idCheck => {

                        if (idCheck === request.request_id) {
                          distanceMarker = layer.getLatLng().distanceTo(requestLayerAccepted.getLatLng());
                        }
                      });
                    })
                  });
                }

                //Υπολογισμός της απόστασης από το αίτημα όταν
                //μετακινηθεί το όχημα
                if ("Request Pending" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    //Event Listener που ενεργοποιείται όταν μετακίνηται το όχημα
                    layer.on("drag", function () {
                      markersLayers["Request Pending"].eachLayer(requestLayerPending => {
                        requestLayerPending.options.request_id.forEach(idCheck => {

                          if (idCheck === request.request_id) {
                            distanceMarker = layer.getLatLng().distanceTo(requestLayerPending.getLatLng());
                          }

                          //Ενεργοποίηση/Απενεργοποίηση του κουμπιού αποδοχή
                          if (distanceMarker > 50) {
                            document.getElementById(`request_${request.request_id}_accept`).disabled = true;
                          } else {
                            document.getElementById(`request_${request.request_id}_accept`).disabled = false;
                          }
                        });
                      })
                    });
                  });
                }

                //Υπολογισμός της απόστασης από το αίτημα όταν
                //μετακινηθεί το όχημα
                if ("Request Accepted" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    //Event Listener που ενεργοποιείται όταν μετακίνηται το όχημα
                    layer.on("drag", function () {
                      markersLayers["Request Accepted"].eachLayer(requestLayerAccepted => {
                        requestLayerAccepted.options.request_id.forEach(idCheck => {

                          if (idCheck === request.request_id) {
                            distanceMarker = layer.getLatLng().distanceTo(requestLayerAccepted.getLatLng());
                          }

                          //Ενεργοποίηση/Απενεργοποίηση του κουμπιού αποδοχή
                          if (distanceMarker > 50) {
                            document.getElementById(`request_${request.request_id}_accept`).disabled = true;
                          } else {
                            document.getElementById(`request_${request.request_id}_accept`).disabled = false;
                          }
                        });
                      })
                    });
                  });
                }

                //Ενεργοποίηση/Απενεργοποίηση του κουμπιού αποδοχή
                if (distanceMarker > 50) {
                  document.getElementById(`request_${request.request_id}_accept`).disabled = true;
                } else {
                  document.getElementById(`request_${request.request_id}_accept`).disabled = false;
                }


                //Event Listener για την ολοκήρωση κάποιου αιτήματος
                document.getElementById(`request_${request.request_id}_accept`).addEventListener("click", function () {

                  var item_check = 0;
                  var quantity_check = 0;
                  var cargo_quantity;

                  //Έλεγχος εάν το όχημα έχει το είδος και στην ποσότητα
                  //που απαιτείται
                  geoJson.features.forEach(features => {
                    if (features.properties.category === "Truck Active") {
                      features.properties.cargo.forEach(cargo => {

                        //Έλεγχος για το είδος
                        if (cargo.item_id === request.item_id) {
                          item_check = 1;
                          cargo_quantity = cargo.quantity;

                          //Έλεγχος ποσότητας
                          if (cargo.quantity >= request.quantity) {

                            quantity_check = 1;

                            //Δεδομένα για αποστολή στον 
                            //server
                            const data = {
                              id: request.request_id,
                              quantity: request.quantity,
                              item_id: request.item_id,
                            };

                            //Επικοινωνία με τον server για ολοκλήρωση του
                            //αιτήματος
                            fetch("/server/rescuer/complete_request.php", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify(data),
                            })
                              .then((response) => response.json())
                              .then((data) => {
                                if (data.status === "error") {
                                  console.error("Server Error:", data.Error);
                                } else {

                                  alert("Το αίτημα ολοκληρώθηκε");

                                  //Ανανέωση χάρτη
                                  mapPanelRefresh();

                                  //Επικοινωνία με τον server για ανανέωση
                                  //του φορτίου του οχήματος
                                  fetch("/server/rescuer/rescuer_geojson.php")
                                    .then((response) => response.json())
                                    .then((cargo) => {
                                      if (cargo === "error") {
                                        console.error("Server Error:", data.Error);
                                      } else {
                                        //Ανανέωση φορτίου
                                        truck_cargo(cargo);
                                      }
                                    })
                                    .catch((error) => console.error("Error:", error))
                                }
                              })
                              .catch((error) => console.error("Error:", error));
                          }
                        }
                      });
                    }
                  });

                  //Εμφάνισει ειδοποιήσεων προς τον χρήστη για αποτυχία ολοκλήρωσης του αιτήματος
                  if (item_check === 0) {
                    alert(`Το όχημα δεν έχει το προιόν "${request.item_name}" για να ολοκληρώσει το αίτημα`);
                  } else if (quantity_check === 0) {
                    alert(`Το όχημα δεν έχει την ποσότητα που απαιτείται για να ολοκληρωσει το αίτημα (Αίτημα: ${request.quantity}, Όχημα: ${cargo_quantity})`);
                  }

                });
              });

              //Δημιουργία πίνακα για την εμφάνιση των προσφορών
              data.offers.forEach(offer => {
                const row_table = document.createElement("tr");
                const name = document.createElement("td");
                const phone_number = document.createElement("td");
                const type = document.createElement("td");
                const date = document.createElement("td");
                const item = document.createElement("td");
                const quantity = document.createElement("td");
                const action = document.createElement("td");

                name.textContent = offer.citizen_name;
                phone_number.textContent = offer.phone_number;
                type.textContent = "Offer";
                const date_sub = offer.submission_date.split(' ');

                date.innerHTML = date_sub[0] + "<br>" + date_sub[1];
                action.innerHTML = `
              <button class="accept" id="offer_${offer.offer_id}_accept">Ολοκλήρωση</button>
              <button class="decline" id="offer_${offer.offer_id}_cancel">Ακύρωση</button>`;

                var items_name_array = [];
                var items_quantity_array = [];
                offer.items.forEach(items => {
                  items_name_array.push(items.item_name);
                  items_quantity_array.push(items.quantity);
                })

                item.innerHTML = items_name_array.join("<br><br>");
                quantity.innerHTML = items_quantity_array.join("<br><br>");

                row_table.appendChild(name);
                row_table.appendChild(phone_number);
                row_table.appendChild(type);
                row_table.appendChild(date);
                row_table.appendChild(item);
                row_table.appendChild(quantity);
                row_table.appendChild(action);

                panel.appendChild(row_table);


                //Event Listener το οποίο ακυρώνει κάποια προσφορά που έχει αναλάβει το όχημα
                document.getElementById(`offer_${offer.offer_id}_cancel`).addEventListener("click", function () {

                  //Συλλογή δεδομένων
                  const data = {
                    id: offer.offer_id,
                  };

                  //Επικοινωνία με τον server για την ακύρωση ανάληψης της προσφοράς
                  fetch("/server/rescuer/cancel_offer.php", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (data.status === "success") {
                        //Ανανέωση του χάρτη
                        mapPanelRefresh();
                      } else {
                        console.error("Server Error:", data.Error);
                      }
                    })
                    .catch((error) => console.error("Error:", error));
                });


                var distanceMarker;

                //Εύρεση απόστασης του οχήματος από την προσφορά
                if ("Offer Pending" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    markersLayers["Offer Pending"].eachLayer(offerLayerPending => {

                      offerLayerPending.options.offer_id.forEach(idCheck => {

                        if (idCheck === offer.offer_id) {
                          distanceMarker = layer.getLatLng().distanceTo(offerLayerPending.getLatLng());
                        }
                      });
                    })
                  });
                }

                //Εύρεση απόστασης του οχήματος από την προσφορά
                if ("Offer Accepted" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    markersLayers["Offer Accepted"].eachLayer(offerLayerAccepted => {

                      offerLayerAccepted.options.offer_id.forEach(idCheck => {

                        if (idCheck === offer.offer_id) {
                          distanceMarker = layer.getLatLng().distanceTo(offerLayerAccepted.getLatLng());
                        }
                      });
                    })
                  });
                }


                //Εύρεση απόστασης του οχήματος από την προσφορά
                if ("Offer Pending" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    //Event listener που υπολογίζει την απόσταση από τη προσφορά όταν
                    //το όχημα μετακινηθεί
                    layer.on("drag", function () {
                      markersLayers["Offer Pending"].eachLayer(offerLayerPending => {
                        offerLayerPending.options.offer_id.forEach(idCheck => {

                          if (idCheck === offer.offer_id) {
                            distanceMarker = layer.getLatLng().distanceTo(offerLayerPending.getLatLng());
                          }

                          //Ενεργοποίηση/Απενεργοποίηση του κουμπιου ολοκλήρωσης της προσφοράς
                          if (distanceMarker > 50) {
                            document.getElementById(`offer_${offer.offer_id}_accept`).disabled = true;
                          } else {
                            document.getElementById(`offer_${offer.offer_id}_accept`).disabled = false;
                          }
                        });
                      })
                    });
                  });
                }

                //Εύρεση απόστασης του οχήματος από την προσφορά
                if ("Offer Accepted" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    //Event listener που υπολογίζει την απόσταση από τη προσφορά όταν
                    //το όχημα μετακινηθεί
                    layer.on("drag", function () {
                      markersLayers["Offer Accepted"].eachLayer(offerLayerAccepted => {

                        offerLayerAccepted.options.offer_id.forEach(idCheck => {

                          if (idCheck === offer.offer_id) {
                            distanceMarker = layer.getLatLng().distanceTo(offerLayerAccepted.getLatLng());
                          }

                          //Ενεργοποίηση/Απενεργοποίηση του κουμπιου ολοκλήρωσης της προσφοράς
                          if (distanceMarker > 50) {
                            document.getElementById(`offer_${offer.offer_id}_accept`).disabled = true;
                          } else {
                            document.getElementById(`offer_${offer.offer_id}_accept`).disabled = false;
                          }
                        });
                      })
                    });
                  });
                }

                //Ενεργοποίηση/Απενεργοποίηση του κουμπιου ολοκλήρωσης της προσφοράς
                if (distanceMarker > 50) {
                  document.getElementById(`offer_${offer.offer_id}_accept`).disabled = true;
                } else {
                  document.getElementById(`offer_${offer.offer_id}_accept`).disabled = false;
                }

                //Event Listener για την ολοκλήρωση κάποιας προσφοράς
                document.getElementById(`offer_${offer.offer_id}_accept`).addEventListener("click", function () {

                  //Συλλογή δεδομένων και αποστολή στον server
                  offer.items.forEach(item => {

                    const data = {
                      id: offer.offer_id,
                      quantity: item.quantity,
                      item_id: item.item_id,
                    };

                    //Επικοινωνία με τον server για ολκλήρωση της προσφοράς
                    fetch("/server/rescuer/complete_offer.php", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(data),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        if (data.status === "error") {
                          console.error("Server Error:", data.Error);
                        }
                      })
                      .catch((error) => console.error("Error:", error));
                  });

                  alert("Η προσφορά ολοκληρώθηκε");

                  //Ανανέωση του χάρτη
                  mapPanelRefresh();

                  fetch("/server/rescuer/rescuer_geojson.php")
                    .then((response) => response.json())
                    .then((cargo) => {

                      if (cargo.status === "error") {
                        console.error("Server Error:", data.Error);
                      } else {
                        //Ανανέωση φορτίου του οχήματος
                        truck_cargo(cargo);
                      }
                    })
                    .catch((error) => console.error("Error:", error))
                });
              });
            }
          })
          .catch(error => console.error('Error:', error));

      }
    })
    .catch(error => console.error('Error:', error));


  //Επικοινωνία με τον server για την εμφάνισης των ειδών
  //της αποθήκης
  fetch("/server/rescuer/database_extract.php")
    .then((jsonResponse) => jsonResponse.json())
    .then((data) => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        if (data.categories.length !== 0 && data.items.length !== 0) {

          //Συνάρτηση που τοποθετεί τις κατηγορίες των ειδών σε λίστα
          categories_select(data);

          var selected_cat = document.getElementById("categorySelect").value;

          //Εμφάνιση των ειδών της επιλεγμένης κατηγορίας
          items_select(data, selected_cat);
        } else {
          const list = document.getElementById("categorySelect");
          list.innerHTML = "";
          let select_add = document.createElement("option");
          select_add.textContent = "Η Βάση δεδομένων είναι κενή";
          list.appendChild(select_add);
        }
      }
    })
    .catch((error) => console.error("Error:", error));



});

//Συνάρτηση η οποία ανανεώνει τον πίνακα
function mapPanelRefresh() {

  //Μεταβλητή που περιέχει τις κατηγορίες των markers
  //που θα υπάρχουν στον χάρτη
  var markersLayers = {};

  var geoJson;

  //Χρήση Fetch API για την παραλαβή των 
  //δεδομένων του χάρτη από τον server
  fetch('/server/rescuer/rescuer_geojson.php')
    .then(response => response.json())
    .then(data => {

      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {

        geoJson = data;

        //Διαγραφή των προηγούμεων φίλτρων από τον χάρτη
        map.removeControl(map_control);

        //Αρχικοποίηση Object για την  
        //λειτουργία των φίλτρων του χάρτη
        var layerSelected_tmp = {
          "Request Pending": false,
          "Request Accepted": false,
          "Offer Accepted": false,
          "Offer Pending": false,
          "Truck Active": false,
          "Truck Inactive": false,
          "Lines": false,
          "Base": false,
        };

        //Πέρασμα των τιμών των μεταβλητών
        //σε προσωρινό Object
        for (var key in layerSelected) {
          if (layerSelected.hasOwnProperty(key)) {
            layerSelected_tmp[key] = layerSelected[key];
          }
        }

        //Αφαίρεση των υπάρχων Layer από τον χάρτη
        map.eachLayer(function (layer) {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });

        //Μεταφορά των τιμών των μεταβλητών στο αρχικό Object
        for (var key in layerSelected_tmp) {
          if (layerSelected_tmp.hasOwnProperty(key)) {
            layerSelected[key] = layerSelected_tmp[key];
          }
        }

        //Αποθήκευση του layer των γραμμών
        markersLayers["Lines"] = L.layerGroup();

        //Προσπέλαση του JSON
        data.features.forEach((feature, index) => {

          //Κατηγορία του feuture
          const category = feature.properties.category;

          //Έλεγχος εάν υπάρχει ήδη αυτή η κατηγορία
          //ως layergroup
          if (!markersLayers[category]) {
            markersLayers[category] = L.layerGroup();
          }

          var check = 0;

          //Έλεγχος εάν ο χρήστης έχει προσφορές και αιτήματα ταυτόχρονα
          data.features.forEach((features_check, index_check) => {
            if (features_check.geometry.coordinates[0] === feature.geometry.coordinates[0] &&
              features_check.geometry.coordinates[1] === feature.geometry.coordinates[1] &&
              (category !== "Base" || category !== "Truck Active" || category !== "Truck Inactive") &&
              index !== index_check) {
              check = 1;
            }

          });

          //Επιλογή σωστού marker για κάθε κατηγορία feature του GeoJson και αρχικοποίησή του
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
                    iconAnchor: [8, 34],
                    popupAnchor: [0, -35]
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
                    popupAnchor: [0, -35]
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
                    popupAnchor: [0, -35]
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
                    popupAnchor: [0, -35]
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
                  popupAnchor: [0, -40]
                });
              } else if (category === "Truck Inactive") {
                return L.icon({
                  iconUrl: '/leaflet/images/marker-truck-red.png',
                  iconSize: [50, 50],
                  iconAnchor: [25, 43],
                  popupAnchor: [0, -40]
                });
              }
            })(),
            draggable:
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

            //Τοποθέτηση pop-up
            customMarkers.bindPopup('<strong>Base</strong>');

          } else if (category === "Request Pending") {

            //Αρχικοποίηση και τοποθέτηση pop-up
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
              <button id="${request.request_id}">Αποδοχή</button><br>
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

            //Αρχικοποίηση και τοποθέτηση pop-up
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

            //Αρχικοποίηση και τοποθέτηση pop-up
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

            //Αρχικοποίηση και τοποθέτηση pop-up
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

                info_citizen = info_citizen + info + ` <button id="${offer.offer_id}">Accept</button><br>`
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

            //Αρχικοποίηση και τοποθέτηση pop-up
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

            //Τοποθέτηση γραμμών στον χάρτη προς τα αιτήματα
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

            //Τοποθέτηση γραμμών στον χάρτη προς τις προσφορές
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

            //Αρχικοποίηση και τοποθέτηση pop-up
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


          //Τοποθέτηση marker στον χάρτη
          markersLayers[category].addLayer(customMarkers);

          if (layerSelected[category] === true) {
            markersLayers[category].addTo(map);
          }



          if (category === "Request Pending") {

            customMarkers.on('popupopen', function () {


              //Event Listener που ελέγχει εάν ένα όχημα μπορεί να αναλάβει
              //το αίτημα
              customMarkers.options.request_id.forEach(id => {
                data.features.forEach(feature => {
                  if (feature.properties.category === "Request Pending") {
                    feature.properties.details.forEach(detail => {
                      if (detail.request_id === id && detail.vehicle_id === null) {
                        document.getElementById(id).addEventListener('click', function () {
                          data.features.forEach(feature => {
                            if (feature.properties.category === "Truck Active" || feature.properties.category === "Truck Inactive") {
                              if ((feature.properties.requests.length + feature.properties.offers.length) < 4) {

                                const data = {
                                  request: detail.request_id,
                                };

                                //Αποστολή στον server για αποδοχή του task
                                fetch("/server/rescuer/accept_request.php", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(data),
                                })
                                  .then((response) => response.json())
                                  .then((data) => {
                                    if (data.status === "success") {
                                      mapPanelRefresh();
                                    } else {
                                      console.error("Server Error:", data.Error);
                                    }
                                  })
                                  .catch((error) => console.error("Error:", error));
                              } else {
                                alert("Το όχημα δεν μπορεί να αναλάβει άλλο task");
                              }
                            }
                          })
                        });
                      }
                    });
                  }
                });
              });
            });
          } else if (category === "Offer Pending") {

            //Event Listener που ελέγχει εάν ένα όχημα μπορεί να αναλάβει
            //την προσφορά
            customMarkers.on('popupopen', function () {
              customMarkers.options.offer_id.forEach(id => {
                data.features.forEach(feature => {
                  if (feature.properties.category === "Offer Pending") {
                    feature.properties.details.forEach(detail => {
                      if (detail.offer_id === id && detail.vehicle_id === null) {
                        document.getElementById(id).addEventListener('click', function () {
                          data.features.forEach(feature => {
                            if (feature.properties.category === "Truck Active" || feature.properties.category === "Truck Inactive") {
                              if ((feature.properties.requests.length + feature.properties.offers.length) < 4) {

                                const data = {
                                  offer: detail.offer_id,
                                };

                                //Αποστολή στον server για την αποδοχή του task
                                fetch("/server/rescuer/accept_offer.php", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(data),
                                })
                                  .then((response) => response.json())
                                  .then((data) => {
                                    if (data.status === "success") {
                                      //Συνάρτηση που ανανεώνει τον χάρτη
                                      mapPanelRefresh();
                                    } else {
                                      console.error("Server Error:", data.Error);
                                    }

                                  })
                                  .catch((error) => console.error("Error:", error));
                              } else {
                                alert("Το όχημα δεν μπορεί να αναλάβει άλλο task");
                              }
                            }
                          })
                        });
                      }
                    });
                  }
                });
              });
            });
          }



          if (category === "Truck Active") {

            //Event listener που ενημερώνει τις γραμμές ανάλογα με την θέση του
            //marker του οχήαμτος
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

            //Event Listener που αποστέλει την θέση του οχήματος στον server
            customMarkers.on('dragend', function (event) {
              const marker = event.target;

              if (marker.options.category === "Truck Active") {

                const position = marker.getLatLng();

                //Συλογή δεδομένων για αποστολή
                const data = {
                  id: marker.options.id,
                  lat: position.lat,
                  lng: position.lng,
                };

                //Αποστολή των δεδομένων στον server
                fetch("/server/rescuer/truck_upload.php", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                })
                  .then((response) => response.json())
                  .then(data => {
                    if (data.status === "error") {
                      console.error("Server Error:", data.Error);
                    }
                  })
                  .catch((error) => console.error("Error:", error));
              }
            });

          }

          if (category === "Truck Inactive") {

            //Event Listener που αποστέλει την θέση του οχήματος στον server
            customMarkers.on('dragend', function (event) {
              const marker = event.target;

              if (marker.options.category === "Truck Inactive") {

                const position = marker.getLatLng();

                //Συλογή δεδομένων για αποστολή
                const data = {
                  id: marker.options.id,
                  lat: position.lat,
                  lng: position.lng,
                };

                //Αποστολή των δεδομένων στον server
                fetch("/server/rescuer/truck_upload.php", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                })
                  .then((response) => response.json())
                  .then(data => {
                    if (data.status === "error") {
                      console.error("Server Error:", data.Error);
                    }
                  })
                  .catch((error) => console.error("Error:", error));
              }
            });
          }

        });


        //Event listener που διαγράφει συγκεκριμένες γραμμές στον χάρτη
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
                  feature.properties.offers.forEach(request => {
                    if (request.offer_id === line.options.offer_id) {
                      line.setStyle({ opacity: 0 });
                    }
                  })
                }
              })
            });
            markersLayers["Lines"].eachLayer(line => {
              data.features.forEach(feature => {
                if (feature.properties.category === "Truck Active") {
                  feature.properties.requests.forEach(request => {
                    if (request.request_id === line.options.request_id) {
                      line.setStyle({ opacity: 0 });
                    }
                  })
                }
              })
            });
          }
        });

        //Event listener που εμφανίζει συγκεκριμένες γραμμές στον χάρτη
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

        if (layerSelected["Lines"] === true) {
          markersLayers["Lines"].addTo(map);

          if (layerSelected["Offer Pending"] === false) {
            markersLayers["Lines"].eachLayer(line => {
              data.features.forEach(feature => {
                if (feature.properties.category === "Truck Active") {
                  feature.properties.offers.forEach(offer => {
                    if (offer.offer_id === line.options.offer_id) {
                      data.features.forEach(cat => {
                        if (cat.properties.category === "Offer Pending") {
                          cat.properties.details.forEach(check_id => {
                            if (check_id.offer_id === offer.offer_id) {
                              line.setStyle({ opacity: 0 });
                            }

                          });
                        }
                      });
                    }
                  })
                }
              })
            });
          }

          if (layerSelected["Offer Accepted"] === false) {
            markersLayers["Lines"].eachLayer(line => {
              data.features.forEach(feature => {
                if (feature.properties.category === "Truck Active") {
                  feature.properties.offers.forEach(offer => {
                    if (offer.offer_id === line.options.offer_id) {
                      data.features.forEach(cat => {
                        if (cat.properties.category === "Offer Accepted") {
                          cat.properties.details.forEach(check_id => {
                            if (check_id.offer_id === offer.offer_id) {
                              line.setStyle({ opacity: 0 });
                            }

                          });
                        }
                      });
                    }
                  })
                }
              })
            });
          }


          if (layerSelected["Request Pending"] === false) {
            markersLayers["Lines"].eachLayer(line => {
              data.features.forEach(feature => {
                if (feature.properties.category === "Truck Active") {
                  feature.properties.requests.forEach(request => {
                    if (request.request_id === line.options.request_id) {
                      data.features.forEach(cat => {
                        if (cat.properties.category === "Request Pending") {
                          cat.properties.details.forEach(check_id => {
                            if (check_id.request_id === request.request_id) {
                              line.setStyle({ opacity: 0 });
                            }
                          });
                        }
                      });
                    }
                  })
                }
              })
            });
          }

          if (layerSelected["Request Accepted"] === false) {
            markersLayers["Lines"].eachLayer(line => {
              data.features.forEach(feature => {
                if (feature.properties.category === "Truck Active") {
                  feature.properties.requests.forEach(request => {
                    if (request.request_id === line.options.request_id) {
                      data.features.forEach(cat => {
                        if (cat.properties.category === "Request Accepted") {
                          cat.properties.details.forEach(check_id => {
                            if (check_id.request_id === request.request_id) {
                              line.setStyle({ opacity: 0 });
                            }
                          });
                        }
                      });
                    }
                  })
                }
              })
            });
          }
        }

        //Τοποθέτηση Φίλτρων στον χάρτη
        map_control = L.control.layers(null, markersLayers).addTo(map);

        //Ανανέωση εμφάνισης του φορτίου του οχήματος
        truck_cargo(data);

        //Μεταβλητή που αποθηκεύει την απόσταση
        var distanceMarker;

        //Υπολογισμός της απόστασης από την βάση
        if ("Truck Active" in markersLayers) {
          markersLayers["Truck Active"].eachLayer(truck => {

            markersLayers["Base"].eachLayer(Base => {

              distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

            });
          })
        }

        //Υπολογισμός της απόστασης από την βάση
        if ("Truck Inactive" in markersLayers) {
          markersLayers["Truck Inactive"].eachLayer(truck => {

            markersLayers["Base"].eachLayer(Base => {

              distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

            });
          })
        }

        //Ενεργοποίηση/Απενεργοποίηση των κουμπιών φόρτωση και εκφόρτωση
        if (distanceMarker < 100) {
          document.getElementById("load").disabled = false;
          document.getElementById("unload").disabled = false;
        } else {
          document.getElementById("load").disabled = true;
          document.getElementById("unload").disabled = true;
        }

        if ("Truck Active" in markersLayers) {
          markersLayers["Truck Active"].eachLayer(truck => {

            markersLayers["Base"].eachLayer(Base => {

              //Υπολογισμός απόστασης του οχήματος από την βάση
              truck.on("drag", function () {
                distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

                //Ενεργοποίηση/Απενεργοποίηση των κουμπιών φόρτωση και εκφόρτωση
                if (distanceMarker < 100) {
                  document.getElementById("load").disabled = false;
                  document.getElementById("unload").disabled = false;
                } else {
                  document.getElementById("load").disabled = true;
                  document.getElementById("unload").disabled = true;
                }
              });

            });
          })
        }

        if ("Truck Inactive" in markersLayers) {
          markersLayers["Truck Inactive"].eachLayer(truck => {

            markersLayers["Base"].eachLayer(Base => {

              //Υπολογισμός απόστασης του οχήματος από την βάση
              truck.on("drag", function () {
                distanceMarker = truck.getLatLng().distanceTo(Base.getLatLng());

                //Ενεργοποίηση/Απενεργοποίηση των κουμπιών φόρτωση και εκφόρτωση
                if (distanceMarker < 100) {
                  document.getElementById("load").disabled = false;
                  document.getElementById("unload").disabled = false;
                } else {
                  document.getElementById("load").disabled = true;
                  document.getElementById("unload").disabled = true;
                }
              });

            });
          })
        }

        //Καθαρισμός του πίνακα
        document.getElementById("tasks_info").innerHTML = "";

        //Επικοινωνία με τον server για εμφάνιση των tasks που
        //έχει αναλάβει το όχημα
        fetch("/server/rescuer/rescuer_tasks.php")
          .then(response => response.json())
          .then(data => {

            if (data.status === "error") {
              console.error("Server Error:", data.Error);
            } else {

              const panel = document.getElementById("tasks_info");

              panel.innerHTML = "";

              //Δημιουργία του πίνακα
              data.requests.forEach(request => {
                const row_table = document.createElement("tr");
                const name = document.createElement("td");
                const phone_number = document.createElement("td");
                const type = document.createElement("td");
                const date = document.createElement("td");
                const item = document.createElement("td");
                const quantity = document.createElement("td");
                const action = document.createElement("td");

                name.textContent = request.citizen_name;
                phone_number.textContent = request.phone_number;
                type.textContent = "Request";
                const date_sub = request.submission_date.split(' ');
                date.innerHTML = date_sub[0] + "<br>" + date_sub[1];
                item.textContent = request.item_name
                quantity.textContent = request.quantity;
                action.innerHTML = `
              <button class="accept" id="request_${request.request_id}_accept">Ολοκλήρωση</button>
              <button class="decline" id="request_${request.request_id}_cancel">Ακύρωση</button>`;

                row_table.appendChild(name);
                row_table.appendChild(phone_number);
                row_table.appendChild(type);
                row_table.appendChild(date);
                row_table.appendChild(item);
                row_table.appendChild(quantity);
                row_table.appendChild(action);
                panel.appendChild(row_table);

                //Event Listener για την ακύρωση κάποιου αιτήματος
                document.getElementById(`request_${request.request_id}_cancel`).addEventListener("click", function () {

                  const data = {
                    id: request.request_id,
                  };

                  //Επικοινωνία με τον server για την ακύρωση του
                  //αιτήματος
                  fetch("/server/rescuer/cancel_request.php", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (data.status === "success") {
                        mapPanelRefresh();
                      } else {
                        console.error("Server Error:", data.Error);
                      }
                    })
                    .catch((error) => console.error("Error:", error));
                });

                //Αποθήκευση απόστασης
                var distanceMarker;

                //Υπολογισμός απόστασης από το αίτημα
                if ("Request Pending" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    markersLayers["Request Pending"].eachLayer(requestLayerPending => {

                      requestLayerPending.options.request_id.forEach(idCheck => {

                        if (idCheck === request.request_id) {
                          distanceMarker = layer.getLatLng().distanceTo(requestLayerPending.getLatLng());
                        }
                      });
                    })
                  });
                }

                //Υπολογισμός απόστασης από το αίτημα
                if ("Request Accepted" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    markersLayers["Request Accepted"].eachLayer(requestLayerAccepted => {

                      requestLayerAccepted.options.request_id.forEach(idCheck => {

                        if (idCheck === request.request_id) {
                          distanceMarker = layer.getLatLng().distanceTo(requestLayerAccepted.getLatLng());
                        }
                      });
                    })
                  });
                }

                //Υπολογισμός της απόστασης από το αίτημα όταν
                //μετακινηθεί το όχημα
                if ("Request Pending" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    //Event Listener που ενεργοποιείται όταν μετακίνηται το όχημα
                    layer.on("drag", function () {
                      markersLayers["Request Pending"].eachLayer(requestLayerPending => {
                        requestLayerPending.options.request_id.forEach(idCheck => {

                          if (idCheck === request.request_id) {
                            distanceMarker = layer.getLatLng().distanceTo(requestLayerPending.getLatLng());
                          }

                          //Ενεργοποίηση/Απενεργοποίηση του κουμπιού αποδοχή
                          if (distanceMarker > 50) {
                            document.getElementById(`request_${request.request_id}_accept`).disabled = true;
                          } else {
                            document.getElementById(`request_${request.request_id}_accept`).disabled = false;
                          }
                        });
                      })
                    });
                  });
                }

                //Υπολογισμός της απόστασης από το αίτημα όταν
                //μετακινηθεί το όχημα
                if ("Request Accepted" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    //Event Listener που ενεργοποιείται όταν μετακίνηται το όχημα
                    layer.on("drag", function () {
                      markersLayers["Request Accepted"].eachLayer(requestLayerAccepted => {
                        requestLayerAccepted.options.request_id.forEach(idCheck => {

                          if (idCheck === request.request_id) {
                            distanceMarker = layer.getLatLng().distanceTo(requestLayerAccepted.getLatLng());
                          }

                          //Ενεργοποίηση/Απενεργοποίηση του κουμπιού αποδοχή
                          if (distanceMarker > 50) {
                            document.getElementById(`request_${request.request_id}_accept`).disabled = true;
                          } else {
                            document.getElementById(`request_${request.request_id}_accept`).disabled = false;
                          }
                        });
                      })
                    });
                  });
                }

                //Ενεργοποίηση/Απενεργοποίηση του κουμπιού αποδοχή
                if (distanceMarker > 50) {
                  document.getElementById(`request_${request.request_id}_accept`).disabled = true;
                } else {
                  document.getElementById(`request_${request.request_id}_accept`).disabled = false;
                }

                //Event Listener για την ολοκήρωση κάποιου αιτήματος
                document.getElementById(`request_${request.request_id}_accept`).addEventListener("click", function () {

                  var item_check = 0;
                  var quantity_check = 0;
                  var cargo_quantity;

                  //Έλεγχος εάν το όχημα έχει το είδος και στην ποσότητα
                  //που απαιτείται
                  geoJson.features.forEach(features => {
                    if (features.properties.category === "Truck Active") {
                      features.properties.cargo.forEach(cargo => {

                        //Έλεγχος για το είδος
                        if (cargo.item_id === request.item_id) {
                          item_check = 1;
                          cargo_quantity = cargo.quantity;

                          //Έλεγχος ποσότητας
                          if (cargo.quantity >= request.quantity) {

                            quantity_check = 1;

                            //Δεδομένα για αποστολή στον 
                            //server
                            const data = {
                              id: request.request_id,
                              quantity: request.quantity,
                              item_id: request.item_id,
                            };

                            //Επικοινωνία με τον server για ολοκλήρωση του
                            //αιτήματος
                            fetch("/server/rescuer/complete_request.php", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify(data),
                            })
                              .then((response) => response.json())
                              .then((data) => {
                                if (data.status === "error") {
                                  console.error("Server Error:", data.Error);
                                } else {

                                  alert("Request Complete");

                                  //Ανανέωση χάρτη
                                  mapPanelRefresh();

                                  //Επικοινωνία με τον server για ανανέωση
                                  //του φορτίου του οχήματος
                                  fetch("/server/rescuer/rescuer_geojson.php")
                                    .then((response) => response.json())
                                    .then((cargo) => {
                                      if (cargo.status === "error") {
                                        console.error("Server Error:", data.Error);
                                      } else {
                                        //Ανανέωση φορτίου
                                        truck_cargo(cargo);
                                      }
                                    })
                                    .catch((error) => console.error("Error:", error))
                                }
                              })
                              .catch((error) => console.error("Error:", error));

                          }
                        }
                      });
                    }
                  });

                  //Εμφάνισει ειδοποιήσεων προς τον χρήστη για αποτυχία ολοκλήρωσης του αιτήματος
                  if (item_check === 0) {
                    alert(`Το όχημα δεν έχει το προιόν "${request.item_name}  για να ολοκληρώσει το αίτημα`);
                  } else if (quantity_check === 0) {
                    alert(`Το όχημα δεν έχει την ποσότητα που απαιτείται για να ολοκληρωσει το αίτημα (Αίτημα: ${request.quantity}, Όχημα: ${cargo_quantity})`);
                  }

                });
              });

              //Δημιουργία πίνακα για την εμφάνιση των προσφορών
              data.offers.forEach(offer => {
                const row_table = document.createElement("tr");
                const name = document.createElement("td");
                const phone_number = document.createElement("td");
                const type = document.createElement("td");
                const date = document.createElement("td");
                const item = document.createElement("td");
                const quantity = document.createElement("td");
                const action = document.createElement("td");

                name.textContent = offer.citizen_name;
                phone_number.textContent = offer.phone_number;
                type.textContent = "Offer";
                const date_sub = offer.submission_date.split(' ');

                date.innerHTML = date_sub[0] + "<br>" + date_sub[1];
                action.innerHTML = `
              <button class="accept" id="offer_${offer.offer_id}_accept">Ολοκλήρωση</button>
              <button class="decline" id="offer_${offer.offer_id}_cancel">Ακύρωση</button>`;

                var items_name_array = [];
                var items_quantity_array = [];
                offer.items.forEach(items => {
                  items_name_array.push(items.item_name);
                  items_quantity_array.push(items.quantity);
                })

                item.innerHTML = items_name_array.join("<br><br>");
                quantity.innerHTML = items_quantity_array.join("<br><br>");

                row_table.appendChild(name);
                row_table.appendChild(phone_number);
                row_table.appendChild(type);
                row_table.appendChild(date);
                row_table.appendChild(item);
                row_table.appendChild(quantity);
                row_table.appendChild(action);

                panel.appendChild(row_table);

                //Event Listener το οποίο ακυρώνει κάποια προσφορά που έχει αναλάβει το όχημα
                document.getElementById(`offer_${offer.offer_id}_cancel`).addEventListener("click", function () {

                  //Συλλογή δεδομένων
                  const data = {
                    id: offer.offer_id,
                  };

                  //Επικοινωνία με τον server για την ακύρωση ανάληψης της προσφοράς
                  fetch("/server/rescuer/cancel_offer.php", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (data.status === "success") {
                        //Ανανέωση του χάρτη
                        mapPanelRefresh();
                      } else {
                        console.error("Server Error:", data.Error);
                      }
                    })
                    .catch((error) => console.error("Error:", error));
                });

                var distanceMarker;

                //Εύρεση απόστασης του οχήματος από την προσφορά
                if ("Offer Pending" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    markersLayers["Offer Pending"].eachLayer(offerLayerPending => {

                      offerLayerPending.options.offer_id.forEach(idCheck => {

                        if (idCheck === offer.offer_id) {
                          distanceMarker = layer.getLatLng().distanceTo(offerLayerPending.getLatLng());
                        }
                      });
                    })
                  });
                }

                //Εύρεση απόστασης του οχήματος από την προσφορά
                if ("Offer Accepted" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    markersLayers["Offer Accepted"].eachLayer(offerLayerAccepted => {

                      offerLayerAccepted.options.offer_id.forEach(idCheck => {

                        if (idCheck === offer.offer_id) {
                          distanceMarker = layer.getLatLng().distanceTo(offerLayerAccepted.getLatLng());
                        }
                      });
                    })
                  });
                }

                //Εύρεση απόστασης του οχήματος από την προσφορά
                if ("Offer Pending" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    //Event listener που υπολογίζει την απόσταση από τη προσφορά όταν
                    //το όχημα μετακινηθεί
                    layer.on("drag", function () {
                      markersLayers["Offer Pending"].eachLayer(offerLayerPending => {
                        offerLayerPending.options.offer_id.forEach(idCheck => {

                          if (idCheck === offer.offer_id) {
                            distanceMarker = layer.getLatLng().distanceTo(offerLayerPending.getLatLng());
                          }

                          //Ενεργοποίηση/Απενεργοποίηση του κουμπιου ολοκλήρωσης της προσφοράς
                          if (distanceMarker > 50) {
                            document.getElementById(`offer_${offer.offer_id}_accept`).disabled = true;
                          } else {
                            document.getElementById(`offer_${offer.offer_id}_accept`).disabled = false;
                          }
                        });
                      })
                    });
                  });
                }

                //Εύρεση απόστασης του οχήματος από την προσφορά
                if ("Offer Accepted" in markersLayers) {
                  markersLayers["Truck Active"].eachLayer(layer => {

                    //Event listener που υπολογίζει την απόσταση από τη προσφορά όταν
                    //το όχημα μετακινηθεί
                    layer.on("drag", function () {
                      markersLayers["Offer Accepted"].eachLayer(offerLayerAccepted => {

                        offerLayerAccepted.options.offer_id.forEach(idCheck => {

                          if (idCheck === offer.offer_id) {
                            distanceMarker = layer.getLatLng().distanceTo(offerLayerAccepted.getLatLng());
                          }

                          //Ενεργοποίηση/Απενεργοποίηση του κουμπιου ολοκλήρωσης της προσφοράς
                          if (distanceMarker > 50) {
                            document.getElementById(`offer_${offer.offer_id}_accept`).disabled = true;
                          } else {
                            document.getElementById(`offer_${offer.offer_id}_accept`).disabled = false;
                          }
                        });
                      })
                    });
                  });
                }

                //Ενεργοποίηση/Απενεργοποίηση του κουμπιου ολοκλήρωσης της προσφοράς
                if (distanceMarker > 50) {
                  document.getElementById(`offer_${offer.offer_id}_accept`).disabled = true;
                } else {
                  document.getElementById(`offer_${offer.offer_id}_accept`).disabled = false;
                }

                //Event Listener για την ολοκλήρωση κάποιας προσφοράς
                document.getElementById(`offer_${offer.offer_id}_accept`).addEventListener("click", function () {


                  //Συλλογή δεδομένων και αποστολή στον server
                  offer.items.forEach(item => {

                    const data = {
                      id: offer.offer_id,
                      quantity: item.quantity,
                      item_id: item.item_id,
                    };

                    //Επικοινωνία με τον server για ολκλήρωση της προσφοράς
                    fetch("/server/rescuer/complete_offer.php", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(data),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        if (data.status === "error") {
                          console.error("Server Error:", data.Error);
                        }
                      })
                      .catch((error) => console.error("Error:", error));
                  });

                  alert("Η προσφορά ολοκληρώθηκε");

                  //Ανανέωση του χάρτη
                  mapPanelRefresh();


                  //Επικοινωνία με τον server για ανανέωση του φορτίου του χάρτη
                  fetch("/server/rescuer/rescuer_geojson.php")
                    .then((response) => response.json())
                    .then((cargo) => {
                      if (cargo.status === "error") {
                        console.error("Server Error:", data.Error);
                      } else {
                        //Ανανέωση φορτίου του οχήματος
                        truck_cargo(cargo);
                      }
                    })
                    .catch((error) => console.error("Error:", error))
                });
              });
            }
          })
          .catch(error => console.error('Error:', error));
      }
    })
    .catch(error => console.error('Error:', error));

}


//Συνάρτηση που είσάγει τις κατηγορίες των ειδών σε λίστα
function categories_select(data) {
  const list = document.getElementById("categorySelect");

  list.innerHTML = "";

  //Προσπέραση των δεδοένων και εύρεση των κατηγοριών
  data.categories.forEach((category) => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      let select_add = document.createElement("option");
      select_add.textContent = category.category_name;
      select_add.value = category.id;
      list.appendChild(select_add);
    }
  });
}

//Εμφάνιση των ειδών της βάσης δεδομένων της επιλεγμένης
//κατηγορίας σε πίνακα
function items_select(data, selected_cat) {
  const table = document.getElementById("items");

  table.innerHTML = "";


  //Προσπέλαση των δεδομένων και δημιουργεία πίνακα
  data.items.forEach((item) => {
    if (item.name != "" && item.category === selected_cat) {

      //Εμφάνιση ειδών που υπάρχουν διαθέσιμα στην βάση
      if (item.quantity > 0) {
        const row_table = document.createElement("tr");
        const id_table = document.createElement("td");
        const name_table = document.createElement("td");
        const category_table = document.createElement("td");
        const detail_table = document.createElement("td");
        const item_quantity = document.createElement("td");

        id_table.textContent = item.id;
        name_table.textContent = item.name;
        item_quantity.textContent = item.quantity;
        const category = data.categories.find((category) =>
          category.id === item.category
        );
        category_table.textContent = category.category_name;

        const detail_get = item.details.map((detail) => {
          if (detail.detail_name && detail.detail_value) {
            return `${detail.detail_name}: ${detail.detail_value}`;
          } else if (detail.detail_name && detail.detail_value === "") {
            return `${detail.detail_name}:`;
          } else if (detail.detail_name === "" && detail.detail_value) {
            return `---: ${detail.detail_value}`;
          } else {
            return " ";
          }
        });
        detail_table.innerHTML = detail_get.join("<br>");

        row_table.appendChild(id_table);
        row_table.appendChild(name_table);
        row_table.appendChild(category_table);
        row_table.appendChild(detail_table);
        row_table.appendChild(item_quantity);

        table.appendChild(row_table);
      }
    }
  });
}


//Συνάρτηση που ανανεώνει τον πίνακα με το φορτίο
//του οχήματος
function truck_cargo(data) {

  const truck_table = document.getElementById("itemCargo");
  truck_table.innerHTML = "";

  //Δημιουργία του πίνακα
  data.features.forEach(feature => {
    if (feature.properties.category === "Truck Active" || feature.properties.category === "Truck Inactive") {
      feature.properties.cargo.forEach(item => {
        const row_table = document.createElement("tr");
        const id_table = document.createElement("td");
        const name_table = document.createElement("td");
        const item_quantity = document.createElement("td");

        id_table.textContent = item.item_id;
        name_table.textContent = item.item_name;
        item_quantity.textContent = item.quantity;

        row_table.appendChild(id_table);
        row_table.appendChild(name_table);
        row_table.appendChild(item_quantity);

        truck_table.appendChild(row_table);
      });
    }
  });

}

//Event listener που ενεργοποιείται όταν γίνεται κλικ στον πίνακα
document.getElementById("tableOfItems").addEventListener("click", function (event) {

  //Επιλογή σειράς που πατήθηκε
  if (event.target.tagName === "TD") {
    const selected_row = event.target.closest("tr");
    const row_items = Array.from(selected_row.cells).map(
      (cell) => cell.textContent
    );

    //Επιλογή των δεδομένων από τον πίνακα
    const id = row_items[0];
    const item = row_items[1];
    const quantity = row_items[4];

    const table = document.getElementById("itemSelected");
    var flag = 0;
    var item_check = [];


    for (var i = 0; i < table.rows.length; i++) {
      var cell = table.rows[i].cells[0];
      item_check.push(cell.innerText);
    }

    //Έλεγχος εάν υπάρχει ήδη το είδος στον πίνακα επιλεγμένων
    for (var i = 0; i < item_check.length; i++) {
      if (item_check[i] === id) {
        flag = 1;
        break;
      }
    }

    //Μεταφορά στον επόμενο πίνακα
    if (flag === 0) {
      const row_table = document.createElement("tr");
      const item_id = document.createElement("td");
      const name_table = document.createElement("td");
      const item_quantity = document.createElement("td");
      const item_delete = document.createElement("td");

      item_id.textContent = id;
      name_table.textContent = item;
      item_quantity.innerHTML = `<input type="range" id="${id}" 
      min="0" max="${quantity}" value="0"></input><span id="quantity_${id}">0</span>`;
      item_delete.innerHTML = `<button id=cancel_${id}>Αφαίρεση</button>`;

      row_table.appendChild(item_id);
      row_table.appendChild(name_table);
      row_table.appendChild(item_quantity);
      row_table.appendChild(item_delete);

      table.appendChild(row_table);

      //Event listener για την ποσότητα που θα πάρει το όχημα
      document.getElementById(`${id}`).addEventListener("input", function () {
        document.getElementById(`quantity_${id}`).innerText = this.value;
      });

      //Event listener ο οποίος αφαιρεί ένα είδος από τα επιλεγμένα
      document.getElementById(`cancel_${id}`).addEventListener("click", function () {
        var row = this.closest('tr');
        row.parentNode.removeChild(row);
      });
    }
  }
});

//Event listener που φορτώνει τα επιλεγμένα είδη
document.getElementById("load").addEventListener("click", function () {

  var selectTable = document.getElementById('itemSelected');
  var flag = 0;

  //Έλεγχος εάν έχει επιλεχθεί κάποιο είδος και της ποσότητάς του
  if (selectTable.rows.length > 0) {
    for (var i = 0; i < selectTable.rows.length; i++) {
      if (parseInt(document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText) === 0) {
        flag = 1;

        alert(`Επέλεξε ποσότητα μεγαλύτερη από 0 για το είδος: ${selectTable.rows[i].cells[1].innerHTML}`)
      }
    }
  } else {
    flag = 1;
    alert("Επέλεξε τουλάχιστον ένα είδος για να φορτωθεί στο όχημα");
  }

  if (flag === 0) {


    for (var i = 0; i < selectTable.rows.length; i++) {
      if (document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText > 0) {

        //Συλλογή δεδομένων
        const data = {
          id: selectTable.rows[i].cells[0].innerHTML,
          quantity: document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText,
        };

        //Επικοινωνία με τον server για την φορτωση 
        //των ειδών στο όχημα
        fetch("/server/rescuer/load_truck.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "error") {
              console.error("Server Error:", data.Error);
            } else {

              //Επικοινωνία με τον server για ανανέωση της βάσης δεδομένων
              //των ειδών
              fetch("/server/rescuer/database_extract.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.status === "error") {
                    console.error("Server Error:", data.Error);
                  } else {

                    //Εμφάνιση ειδών
                    var selected_cat = document.getElementById("categorySelect").value;
                    items_select(data, selected_cat);
                    document.getElementById("itemSelected").innerHTML = "";
                  }
                })
                .catch((error) => console.error("Error:", error));

              //Επικοινωνία με τον server για 
              //ανανέωση του φορτίου του οχήματος
              fetch("/server/rescuer/rescuer_geojson.php")
                .then((response) => response.json())
                .then((cargo) => {
                  if (cargo.status === "error") {
                    console.error("Server Error:", data.Error);
                  } else {
                    truck_cargo(cargo);
                  }
                })
                .catch((error) => console.error("Error:", error))
            }
          })
          .catch((error) => console.error("Error:", error));

      }
    }

    //Ανανέωση του χάρτη
    mapPanelRefresh();
  }
});

//Event listener ο οποίος ξεφορτώνει το φορτίο του οχήματος στην βάση
document.getElementById("unload").addEventListener("click", function () {

  var itemTable = document.getElementById('itemCargo');

  if (itemTable.rows.length > 0) {

    //Επικοινωνία με τον server για ξεφόρτωση του φορτίου
    fetch("/server/rescuer/unload_truck.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "error") {
          console.error("Server Error:", data.Error);
        } else {

          //Ανανέωση της βάσης δεδομένων
          fetch("/server/rescuer/database_extract.php")
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "error") {
                console.error("Server Error:", data.Error);
              } else {

                //Ανανέωση πίνακα ειδών
                var selected_cat = document.getElementById("categorySelect").value;
                items_select(data, selected_cat);
                document.getElementById("itemCargo").innerHTML = "";
              }
            })
            .catch((error) => console.error("Error:", error));

          //Ανανέωση φορτίου οχήματος
          fetch("/server/rescuer/rescuer_geojson.php")
            .then((response) => response.json())
            .then((cargo) => {
              if (cargo.status === "error") {
                console.error("Server Error:", data.Error);
              } else {
                truck_cargo(cargo);
              }
            })
            .catch((error) => console.error("Error:", error))
        }
      })
      .catch((error) => console.error("Error:", error));

    mapPanelRefresh();

  } else {
    alert("Το όχημα είναι άδειο");
  }

});

//Event listener για την εμφάνιση των σωστών ειδών στον πίνακα
document.getElementById("categorySelect").addEventListener("change", function () {
  fetch("/server/rescuer/database_extract.php")
    .then((jsonResponse) => jsonResponse.json())
    .then((data) => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        const selected_cat = document.getElementById("categorySelect").value;
        items_select(data, selected_cat);
      }
    })
    .catch((error) => console.error("Error:", error));
});