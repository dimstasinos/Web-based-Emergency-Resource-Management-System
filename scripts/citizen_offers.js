//Global μεταβλητές
var itemSelected;
var announcementSelected;

//Event listener που εκτελείτε όταν φορτωθεί η HTML
document.addEventListener('DOMContentLoaded', function () {

  document.getElementById("submitOffer").disabled = true;

  fetch("/server/get_Session_info.php")
    .then((jsonResponse) => jsonResponse.json())
    .then(data => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        document.getElementById("text").textContent = data.response.Name;
      }
    })
    .catch((error) => console.error("Error:", error));




  //Εμφάνιση ανακοινώσεων
  fetch("/server/citizen/announcement.php")
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        announcementTable(data);
      }
    })
    .catch((error) => console.error("Error:", error));

  //Εμφάνιση προσφορών
  fetch("/server/citizen/offers.php")
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        offersTable(data);
      }
    })
    .catch((error) => console.error("Error:", error));

});

//Συνάρτηση που εμφανίζει τον πίνακα με τις ανακοινώσεις
function announcementTable(data) {

  const announcement_table = document.getElementById("announcements");
  announcement_table.innerHTML = "";
  document.getElementById("OfferSelected").innerHTML = "";
  document.getElementById("submitOffer").disabled = true;

  //Προσπέραση δεδομέων
  data.forEach(announcement => {

    //Δημιουργία στοιχείων πίνακα
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

    item_name.innerHTML = items_name_array.join("<br><br>");
    item_quantity.innerHTML = items_quantity_array.join("<br><br>");
    action.innerHTML = `<input type="radio" name="announcement"
     value="${announcement.announcement_id}" id="${announcement.announcement_id}_check">`;

    row_table.appendChild(action);
    row_table.appendChild(announcement_id);
    row_table.appendChild(item_name);
    row_table.appendChild(item_quantity);
    announcement_table.appendChild(row_table);

    //Event listener που ενεργοποιείται όταν πατιέται κάποιο radiobutton
    document.getElementById(`${announcement.announcement_id}_check`).addEventListener("change", function () {
      itemSelected = [];
      announcementSelected = announcement;
      const table = document.getElementById("OfferSelected");
      table.innerHTML = "";

      selectedAnnouncement = announcement.announcement_id;

      //Εμφάνιση ειδών ανακοίνωσης στον πίνακα
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

        //Event listener ο οποίος ενεργοποιεί/απενεργοποιεί το κουμπί υποβολή
        document.getElementById(`${announcement.announcement_id}${item.item_id}`).addEventListener("change", function (event) {
          const checked = event.target.checked;

          if (checked) {
            itemSelected.push(item.item_id);
            document.getElementById("submitOffer").disabled = false;
          } else {
            
            var pos = itemSelected.indexOf(item.item_id);
            itemSelected.splice(pos, 1)
            if (itemSelected.length === 0) {
              document.getElementById("submitOffer").disabled = true;
            }
          }
        });
      });
    });
  });
}

//Event listener για την υποβολή της προσφοράς
document.getElementById("submitOffer").addEventListener("click", function () {

  //Συλλογή δεδομένων
  const announcement_id = {
    announcement_id: selectedAnnouncement,
  }

  //Επικοινωνία με τον server για την υποβολή της προσφοράς
  fetch("/server/citizen/offer_insert.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(announcement_id),
  })
    .then(response => response.json())
    .then(offer_id => {

      if (offer_id.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        //Συλλογή δεδομένων
        var offer = {
          offer_id: parseInt(offer_id.id),
          announcement_id: selectedAnnouncement,
          items: []
        };


        itemSelected.forEach(item => {
          var newItem;
          announcementSelected.items.forEach(id => {
            if (item === id.item_id) {
              newItem = {
                item_id: id.item_id,
                quantity: id.quantity
              };
              offer.items.push(newItem);
            }
          });
        })

        //Ανεβασμα προιόντων της προσφοράς
        fetch("/server/citizen/offer_upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(offer),
        })
          .then(response => response.json())
          .then(data => {

            if (data.status === "success") {

              document.getElementById("OfferSelected").innerHTML = "";

              //Ανανέωση πίνακα ανακοινώσεων
              fetch("/server/citizen/announcement.php")
                .then(jsonResponse => jsonResponse.json())
                .then(data => {
                  if (data.status === "error") {
                    console.error("Server Error:", data.Error);
                  } else {
                    announcementTable(data);
                  }
                })
                .catch((error) => console.error("Error:", error));

              //Ανανέωση πίνακα προσφορών
              fetch("/server/citizen/offers.php")
                .then(jsonResponse => jsonResponse.json())
                .then(data => {
                  if (data.status === "error") {
                    console.error("Server Error:", data.Error);
                  } else {
                    offersTable(data);
                  }
                })
                .catch((error) => console.error("Error:", error));
            } else {
              console.error("Server Error:", data.Error);
            }
          })
          .catch((error) => console.error("Error:", error));
      }
    })
    .catch((error) => console.error("Error:", error));
})

//Συνάρτηση που δημιουργεί τον πίνακα προσφορών
function offersTable(data) {

  const offer_table = document.getElementById("offers");

  offer_table.innerHTML = "";

  //Προσπέλαση δεδομένων
  data.forEach(offer => {

    //Δημιουργία του πίνακα
    const row_table = document.createElement("tr");
    const item_name = document.createElement("td");
    const item_quantity = document.createElement("td");
    const sub_date = document.createElement("td");
    const pick_date = document.createElement("td");
    const complete_date = document.createElement("td");
    const action = document.createElement("td");

    var items_name_array = [];
    var items_quantity_array = [];

    offer.items.forEach(item => {
      items_name_array.push(item.item_name);
      items_quantity_array.push(item.quantity);
    });

    item_name.innerHTML = items_name_array.join("<br><br>");
    item_quantity.innerHTML = items_quantity_array.join("<br><br>");
    sub_date.textContent = offer.submission_date;
    action.innerHTML = `<button id="${offer.offer_id}">Ακύρωση</button>`;

    //Έλεγχος εάν έχει παραλειφθεί η προσφορά
    if (offer.pickup_date === null) {
      pick_date.textContent = "-";
    } else {
      pick_date.textContent = offer.pickup_date;
    }

    if (offer.hasOwnProperty('complete_date')) {
      complete_date.textContent = offer.complete_date;
    } else {
      complete_date.textContent = "-";
    }

    row_table.appendChild(item_name);
    row_table.appendChild(item_quantity);
    row_table.appendChild(sub_date);
    row_table.appendChild(pick_date);
    row_table.appendChild(complete_date);
    row_table.appendChild(action);

    offer_table.appendChild(row_table);

    if (complete_date.textContent === "-") {
      document.getElementById(`${offer.offer_id}`).disabled = false;
    } else {
      document.getElementById(`${offer.offer_id}`).disabled = true;
    }

    if (document.getElementById(`${offer.offer_id}`).disabled === false) {

      //Event listener για την διαγραφή κάποιας προσφοράς
      document.getElementById(`${offer.offer_id}`).addEventListener("click", function () {

        const data = {
          offer_id: offer.offer_id,
          announcement_id: offer.announcement_id,
          items: offer.items,
        };

        //Επικοινωνία με τον server για διαγραφή της προσφοράς
        fetch("/server/citizen/offer_delete.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {

            if (data.status === "success") {

              //Ανανέωση του πίνακα προσφορών
              fetch('/server/citizen/offers.php')
                .then(jsonResponse => {

                  const isEmpty = jsonResponse.headers.get('Content-Length');
                  if (isEmpty === '0') {
                    return null;
                  }

                  return jsonResponse.json();
                })
                .then(data => {

                  if (data.status === "error") {
                    console.error("Server Error:", data.Error);
                  } else {

                    if (data !== null) {
                      offersTable(data);
                    }
                    else {
                      const table = document.getElementById("table_request");
                      table.innerHTML = '';
                      table.textContent = "There are now requests";

                    }
                  }
                })
                .catch(error => console.error('Error:', error));

              //Ανανέωση του πίνακα των ανακοινώσεων
              fetch("/server/citizen/announcement.php")
                .then(jsonResponse => jsonResponse.json())
                .then(data => {
                  if (data.status === "error") {
                    console.error("Server Error:", data.Error);
                  } else {
                    announcementTable(data);
                  }
                })
                .catch((error) => console.error("Error:", error));
            } else {
              console.error("Server Error:", data.Error);
            }
          })
          .catch((error) => console.error("Error:", error))
      });
    }
  });
}

//Event listener που καθαρίζει τον πίνακα επιλεγμένης ανακοίνωσης
document.getElementById("clear").addEventListener("click", function () {
  document.getElementById("OfferSelected").innerHTML = "";
  document.getElementById("submitOffer").disabled = true;
  const uncheck = document.getElementsByName("announcement");
  uncheck.forEach(radiobutton => {
    radiobutton.checked = false;
  });

});