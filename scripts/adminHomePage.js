//Global μεταβλητές
var map;
var map_control;
var layerSelected;

//Event listener που εκτελείτε όταν φορτωθεί η HTML
document.addEventListener('DOMContentLoaded', function () {

  //Αρχικοποίηση χάρτη
  var map = L.map('map').setView([37.9838, 23.7275], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);


  //Εμφάνιση γραφήματος για 
  //default ημερομηνία
  initializeChart();

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

  //Χρήση Fetch API για την παραλαβή των 
  //δεδομένων του χάρτη από τον server
  fetch('/server/map_admin/map.php')
    .then(response => response.json())
    .then(data => {

      //Προσπέλαση του πίνακα
      data.features.forEach((feature, index) => {

        //Κατηγορία του feuture
        const category = feature.properties.category;

        //Έλεγχος εάν υπάρχει ήδη αυτή η κατηγορία
        //ως layergroup
        if (!markersLayers[category]) {
          markersLayers[category] = L.layerGroup();
        }

        var check = 0;

        //Έλεγχος εάν ο χρήστης έχει προσφορές και αιτήματα
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

          //Τοποθέτηση pop-up
          customMarkers.bindPopup('<strong>Base</strong>');

          //Event listener για την αλλαγή της θέσης
          //της βάσης
          customMarkers.on('dragend', function (event) {
            let marker = event.target;
            let position = marker.getLatLng();

            let newPositionConfirmed = confirm('Do you want to confirm this location?');

            if (newPositionConfirmed) {

              //Τοποθεσία βάσης
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
                    alert('Η τοποθεσία της βάσης επιβεβαιώθηκε: ' + position.lat + ', ' + position.lng);
                  }
                })
                .catch((error) => console.error("Error:", error));

            } else {

              customMarkers.setLatLng([feature.geometry.coordinates[0], feature.geometry.coordinates[1]])
              alert('Base Location not confirmed');
            }
          });
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

          //Αρχικοποιηση και τοποθέτηση pop-up
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

          //Αρχικοποιηση και τοποθέτηση pop-up
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

          //Αρχικοποιηση και τοποθέτηση pop-up
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

          //Τοποθέτηση γραμμών προς τα αιτήματα
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

        //Τοποθέτηση στον χάρτη
        markersLayers[category].addLayer(customMarkers);
        markersLayers[category].addTo(map);

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

      //Event listener που προσθέτει συγκεκριμένες γραμμές στον χάρτη
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

      //Τοποθέτηση γραμμών στον χάρτη
      markersLayers["Lines"].addTo(map);

      //Τοποθέτηση Φίλτρων στον χάρτη
      L.control.layers(null, markersLayers).addTo(map);


    })
    .catch(error => console.error('Error:', error));

});

//Event listener που εμφανίζει τα γραφήματα
document.getElementById("submitdate").addEventListener("click", function () {

  //Ανάκτηση στοιχείων ημερομηνίας που έδωσε ο χάρτης
  const start_date = document.getElementById('startdate').value + " 00:00:00";
  const end_date = document.getElementById('enddate').value + " 23:59:59";

  //Έλεγχος στοιχείων
  if (start_date > end_date) {
    alert('Η ημερομηνία έναρξης θα πρέπει να προηγείται της ημερομηνίας λήξης');
  } else {

    //Δημιουργία Object για την 
    //αποστολή των σωστών δεδομένων
    //από τον server
    const data = {
      startdate: start_date,
      enddate: end_date
    }

    //Αποστολή δεδομένων και επικοινωνία με τον server
    fetch("/server/admin/chart/chartData.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),

    })
      .then((response) => response.json())
      .then(data => {

        //Δημιουργία γραφήματος
        const values = Object.values(data).map(item => item.plithos);
        const graph = document.getElementById('serverchart');
        const existingChart = Chart.getChart(graph);
        if (existingChart) {
          existingChart.destroy();
        }

        const serverchart = new Chart(graph, {
          type: 'doughnut',
          data: {
            labels: Object.keys(data),
            datasets: [{
              data: values,
              backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB', '#FF8F00', '#4CAF50', '#6200EA'],
            }],
          },
        });


      })
      .catch(error => console.error("Error:", error));


  }


});

//Συνάρτηση που δημιουργεί το γράφημα
//στην φόρτωση της σελίδας
function initializeChart() {

  document.getElementById('startdate').value = "2024-01-04";
  document.getElementById('enddate').value = "2024-01-20";
  const start_date = "2024-01-04  00:00:00";
  const end_date = "2024-01-20 23:59:59";

  //Δημιουργία Object
  const data = {
    startdate: start_date,
    enddate: end_date
  }

  //Αποστολή δεδομένων και επικοινωνία με τον server
  fetch("/server/admin/chart/chartData.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),

  })
    .then((response) => response.json())
    .then(data => {

      const values = Object.values(data).map(item => item.plithos);
      const ctx = document.getElementById('serverchart');
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }

      const serverchart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(data),
          datasets: [{
            data: values,
            backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB', '#FF8F00', '#4CAF50', '#6200EA'],
          }],
        },
      });


    })
    .catch(error => console.error("Error:", error));

}