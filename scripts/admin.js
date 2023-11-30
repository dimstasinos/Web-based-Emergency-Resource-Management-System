// script.js

$(document).ready(function() {
    // Make an AJAX request to get all location IDs
    $.ajax({
        url: 'get_all_location_ids.php',
        method: 'GET',
        success: function(data) {
            try {
                var allLocationIds = JSON.parse(data);

                // Iterate through each location ID
                allLocationIds.forEach(function(locationId) {
                    // Make an AJAX request to get location data for the current ID
                    $.ajax({
                        url: 'get_location.php',
                        method: 'GET',
                        data: { locationId: locationId },
                        success: function(data) {
                            try {
                                var locData = JSON.parse(data);
                                var lat = locData.lat;
                                var long = locData.long;

                                // Call the function to create and pin the marker
                                createAndPinMarker(lat, long);
                            } catch (error) {
                                console.error('Error parsing JSON:', error);
                            }
                        },
                        error: function(error) {
                            console.error('Error fetching data:', error);
                        }
                    });
                });
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });

    // Function to create and pin the Leaflet marker
    function createAndPinMarker(lat, long) {
        var map = L.map('map').setView([lat, long], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.marker([latitude, longitude]).addTo(map)
            .bindPopup('Your Marker Popup Text')
            .openPopup();
    }
});
