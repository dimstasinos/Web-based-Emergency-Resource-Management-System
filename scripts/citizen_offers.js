document.addEventListener('DOMContentLoaded', function () {

  document.getElementById("submitAnnouncement").disabled = true;

  fetch("/server/citizen/announcement.php")
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      announcementTable(data);
    })
    .catch((error) => console.error("Error:", error));

    fetch("/server/citizen/offers.php")
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      console.log(data);
    })
    .catch((error) => console.error("Error:", error));

});


function announcementTable(data) {

  const announcement_table = document.getElementById("announcements");
  announcement_table.innerHTML = "";

  data.forEach(announcement => {

    const row_table = document.createElement("tr");
    const item_name = document.createElement("td");
    const item_quantity = document.createElement("td");
    const announcement_id = document.createElement("td");
    const action = document.createElement("td");

    announcement_id.textContent = announcement.announcement_id;

    var items_name_array = [];
    var items_quantity_array = [];
    var items_id = [];
    announcement.items.forEach(item => {
      items_id.push(item.item_id);
      items_name_array.push(item.item_name);
      items_quantity_array.push(item.quantity);
    });

    item_name.innerHTML = items_name_array.join("<br>");
    item_quantity.innerHTML = items_quantity_array.join("<br>");
    action.innerHTML = `<input type="radio" name="announcement"
     value="${announcement.announcement_id}" id="${announcement.announcement_id}">`;

    row_table.appendChild(action);
    row_table.appendChild(announcement_id);
    row_table.appendChild(item_name);
    row_table.appendChild(item_quantity);
    announcement_table.appendChild(row_table);

    document.getElementById(`${announcement.announcement_id}`).addEventListener("change", function () {

      const table = document.getElementById("OfferSelected");
      table.innerHTML = "";

      var item_checked = [];
      announcement.items.forEach(item => {
        const rowOftable = document.createElement("tr");
        const item_id = document.createElement("td");
        const item_name = document.createElement("td");
        const item_quantity = document.createElement("td");
        const selected = document.createElement("td");

        item_id.textContent = item.item_id;
        item_name.textContent = item.item_name;
        item_quantity.textContent = item.quantity;
        selected.innerHTML = `<input type="checkbox" value="${announcement.announcement_id}${item.item_id}"
        id="${announcement.announcement_id}${item.item_id}">`;

        rowOftable.appendChild(item_id);
        rowOftable.appendChild(item_name);
        rowOftable.appendChild(item_quantity);
        rowOftable.appendChild(selected);
        table.appendChild(rowOftable);


        document.getElementById(`${announcement.announcement_id}${item.item_id}`).addEventListener("change", function (event) {
          const checked = event.target.checked;

          if (checked) {
            item_checked.push(item.item_id);
            document.getElementById("submitAnnouncement").disabled = false;
          } else {
            var pos = item_checked.indexOf(item.item_id);
            item_checked.splice(pos, 1)
            if (item_checked.length === 0) {
              document.getElementById("submitAnnouncement").disabled = true;
            }
          }

        });

      });


      document.getElementById("submitAnnouncement").addEventListener("click", function () {

        fetch("/server/citizen/offer_upload.php")
          .then(jsonResponse => jsonResponse.json())
          .then(offer_id => {
            /*
            item_checked.forEach(item => {
              var quantity;
              announcement.items.forEach(id => {
                if (item.item_id === id) {
                  quantity=id.quantity;
                }
              });
              const data = {
                offer_id: offer_id,
                item_id: item,
                quantity: quantity
              }
             */


            //});
          })
          .catch((error) => console.error("Error:", error));


      })
    });
  });

}

document.getElementById("clear").addEventListener("click", function () {
  document.getElementById("OfferSelected").innerHTML = "";

  document.getElementById("submitAnnouncement").disabled = true;

  const uncheck = document.getElementsByName("announcement");

  uncheck.forEach(radiobutton => {
    radiobutton.checked = false;
  });

});