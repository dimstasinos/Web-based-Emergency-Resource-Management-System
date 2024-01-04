document.addEventListener('DOMContentLoaded', function () {

  fetch("/server/admin/announcement/announcement.php")
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      requestsTable(data);
    })
    .catch((error) => console.error("Error:", error));


});

function requestsTable(data) {

  const announcement_table = document.getElementById("announcements");
  announcement_table.innerHTML = "";

  data.forEach(announcement => {

    const row_table = document.createElement("tr");
    const item_name = document.createElement("td");
    const item_quantity = document.createElement("td");
    const announcement_id = document.createElement("td");

    announcement_id.textContent = announcement.announcement_id;

    var items_name_array = [];
    var items_quantity_array = [];

    announcement.items.forEach(item => {
      items_name_array.push(item.item_name);
      items_quantity_array.push(item.quantity);
    });

    item_name.innerHTML = items_name_array.join("<br>");
    item_quantity.innerHTML = items_quantity_array.join("<br>");

    row_table.appendChild(announcement_id);
    row_table.appendChild(item_name);
    row_table.appendChild(item_quantity);

    announcement_table.appendChild(row_table);

  });

}