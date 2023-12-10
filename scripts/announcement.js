document.addEventListener('DOMContentLoaded', function () {

  fetch('/server/announcement/announcement.php')
    .then(response => response.json())
    .then(data => {


      const tableBody = document.getElementById('table');

      data.announcements.forEach(item => {

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

document.getElementById('upload-button').addEventListener('click', function () {
  var form = document.getElementById("announcement-form");

  title = document.getElementById('title').value;
  date = document.getElementById('date').value;
  text = document.getElementById('content').value;

  const data = {
    title: title,
    date: date,
    text: text
  };

  fetch("/server/announcement/announcement_upload.php", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      fetch('/server/announcement/announcement.php')
        .then(response => response.json())
        .then(data => {
           document.getElementById("table").innerHTML="";

          const tableBody = document.getElementById('table');

          data.announcements.forEach(item => {

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
  });
