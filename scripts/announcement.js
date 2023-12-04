document.addEventListener('DOMContentLoaded', function () {
    
    fetch('/server/announcement.php')
    .then(response => response.json())
    .then(data => { 
   
      const tableBody = document.getElementById('table');
      
      data.announcements.forEach(item => {
        console.log(data);
        const row = document.createElement('tr');

        
        const idCell = document.createElement('td');
        idCell.textContent = item.id;
        row.appendChild(idCell);

        const titleCell = document.createElement('td');
        titleCell.textContent = item.title;
        row.appendChild(titleCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = item.date;
        row.appendChild(dateCell);

        const contentCell = document.createElement('td');
        contentCell.textContent = item.content;
        row.appendChild(contentCell);

        
        tableBody.appendChild(row);
        
      });
    })
    .catch(error => console.error('Error fetching data:', error));
        
});