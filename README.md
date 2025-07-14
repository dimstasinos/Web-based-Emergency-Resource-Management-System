# Crisis Response Web Platform
 
This project was developed for the course **"Programming and Systems on the World Wide Web"**. It is a web-based platform designed to coordinate offers and requests of goods during crisis situations, connecting citizens, rescuers, and administrators in a unified system.

## Features

- Interactive map-based interface with real-time markers
- Role-based login system: Citizen, Rescuer, Administrator
- Dynamic data handling using AJAX and PHP
- User session management and access control
- Graphical statistics via Chart.js
- Mobile-friendly and responsive design

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Leaflet.js, Chart.js
- **Backend**: PHP (with MySQLi and prepared statements)
- **Database**: MySQL
- **Other**: geoJSON, .htaccess for caching and URL rewriting

---

## Technical Highlights

### Mapping & Visualization

- Leaflet.js used for rendering and interacting with map
- geoJSON integration for dynamic data
- Color-coded and status-based custom markers
- Distance-based logic for task validation (50m–100m)

### AJAX & Client-Server Communication

- JavaScript Fetch API for all client-server interactions
- JSON used for data exchange
- Seamless updates without page reloads using event listeners

### Database Optimization

- Indexes created (e.g., on product categories) to optimize queries

### Graphs and Stats

- Donut charts built with Chart.js to visualize platform usage and fulfillment stats

### Session Management

- PHP-based session tracking
- Page access and redirection handled based on user role
- Secure login and logout mechanisms

### Server Optimization

- Apache `.htaccess` configured with mod_expires for asset caching
- URL rewriting to hide `.php` extensions
- Improved load times by leveraging browser cache
