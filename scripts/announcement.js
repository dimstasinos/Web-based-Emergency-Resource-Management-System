//Event listener που εκτελείτε όταν φορτωθεί η HTML
document.addEventListener('DOMContentLoaded', function () {

  //Επικοινωνία με τον server για εμφάνιση των ανακοινωσεων
  fetch("/server/admin/announcement/announcement.php")
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      //Εμφάνιση ανακοινώσεων σε πίνακα
      announcementTable(data);
    })
    .catch((error) => console.error("Error:", error));

  //Επικοινωνια με τον server για εμφάνιση των ειδών που περιέχει
  //η βάση δεδομένων
  fetch('/server/admin/warehouse_admin/database_extract.php')
    .then(jsonResponse => {

      const isEmpty = jsonResponse.headers.get('Content-Length');
      if (isEmpty === '0') {
        return null;
      }

      return jsonResponse.json();
    })
    .then(data => {

      if (data != null) {

        //Εμφάνιση ειδών
        categories_select(data);
        var selected_cat = document.getElementById("categories").value;
        items_select(data, selected_cat);
      }
      else {
        const list = document.getElementById("categories");
        list.innerHTML = '';
        let select_add = document.createElement("option");
        select_add.textContent = "Η Βάση δεδομένων είναι κενή";
        list.appendChild(select_add);
      }
    })
    .catch(error => console.error('Error:', error));

});

//Συνάρτηση που εμφανίζει τον πίνακα με τις ανακοινώσεις
function announcementTable(data) {

  const announcement_table = document.getElementById("announcements");
  announcement_table.innerHTML = "";

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
    var items_action_array = [];
    var items_id = [];
    announcement.items.forEach(item => {
      items_id.push(item.item_id);
      items_name_array.push(item.item_name);
      items_quantity_array.push(item.quantity);
      items_action_array.push(`<button id="cancel_${item.item_id}${announcement.announcement_id}">Διαγραφή</button>`);
    });

    item_name.innerHTML = items_name_array.join("<br>");
    item_quantity.innerHTML = items_quantity_array.join("<br>");
    action.innerHTML = items_action_array.join("<br>");


    row_table.appendChild(announcement_id);
    row_table.appendChild(item_name);
    row_table.appendChild(item_quantity);
    row_table.appendChild(action);

    announcement_table.appendChild(row_table);

    items_id.forEach(id => {

      //Event listener που διαγράφη μια ανακοίνωση
      document.getElementById(`cancel_${id}${announcement.announcement_id}`).addEventListener("click", function () {

        const data = {
          id: announcement.announcement_id,
          item_id: id
        };

        //Επικοινωνία με το server για την διαγραφή της ανακοίνωσης
        fetch("/server/admin/announcement/announcement_delete.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {

            //Ανανέωση πίνακα ανακοινώσεων
            fetch("/server/admin/announcement/announcement.php")
              .then(jsonResponse => jsonResponse.json())
              .then(data => {
                announcementTable(data);
              })
              .catch((error) => console.error("Error:", error));

          })
          .catch((error) => console.error("Error:", error));
      });
    });
  });
}

//Συνάρτηση που τοποθετεί τις κατηγορίες ειδών σε λίστα
function categories_select(data) {
  const list = document.getElementById("categories");

  list.innerHTML = "";

  //Προσπέλαση δεδομένων
  data.categories.forEach((category) => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      let select_add = document.createElement("option");
      select_add.textContent = category.category_name;
      select_add.value = category.id;
      list.appendChild(select_add);
    }
  });
}

//Συνάρτηση που εμφανίζει τα είδη της επιλεγμένης κατηγορίας
function items_select(data, selected_cat) {
  const table = document.getElementById("itemsTable");

  table.innerHTML = "";

  //Εμφάνιση ειδών
  data.items.forEach((item) => {
    if (item.name != "" && item.category === selected_cat) {

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
  });
}


document.getElementById("search").addEventListener("input", function () {

  fetch('/server/admin/warehouse_admin/database_extract.php')
    .then(jsonResponse => {

      const isEmpty = jsonResponse.headers.get('Content-Length');
      if (isEmpty === '0') {
        return null;
      }
      return jsonResponse.json();
    })
    .then(data => {

      if (data != null) {
        var input = document.getElementById("search").value.toLowerCase();
        var results = data.items.filter(item => {
          return item.name.toLowerCase().startsWith(input);
        });

        document.getElementById("results").innerHTML = '';

        results.forEach(item => {
          var resultPrint = document.createElement('li');
          resultPrint.classList.add('results_item');
          resultPrint.textContent = item.name;

          document.getElementById("results").appendChild(resultPrint);

          resultPrint.addEventListener('click', function () {

            document.getElementById("search").value = item.name;
            document.getElementById("results").innerHTML = '';


            const table = document.getElementById("itemSelected");
            var flag = 0;
            var item_check = [];

            for (var i = 0; i < table.rows.length; i++) {
              var cell = table.rows[i].cells[0];
              item_check.push(cell.innerText);
            }

            for (var i = 0; i < item_check.length; i++) {
              if (item_check[i] === item.id) {
                flag = 1;
                break;
              }
            }


            if (flag === 0) {
              const row_table = document.createElement("tr");
              const item_id = document.createElement("td");
              const name_table = document.createElement("td");
              const item_quantity = document.createElement("td");
              const item_delete = document.createElement("td");

              item_id.textContent = item.id;
              name_table.textContent = item.name;
              item_quantity.innerHTML = `<input type="range" id="${item.id}" 
              min="0" max="20" value="0"></input><span id="quantity_${item.id}">0</span>`;
              item_delete.innerHTML = `<button id=cancel_${item.id}>cancel</button>`;

              row_table.appendChild(item_id);
              row_table.appendChild(name_table);
              row_table.appendChild(item_quantity);
              row_table.appendChild(item_delete);

              table.appendChild(row_table);

              document.getElementById(`${item.id}`).addEventListener("input", function () {
                document.getElementById(`quantity_${item.id}`).innerText = this.value;
              });

              document.getElementById(`cancel_${item.id}`).addEventListener("click", function () {
                var row = this.closest('tr');
                row.parentNode.removeChild(row);
              });

            }


          });



          document.addEventListener('click', function (event) {
            if (!event.target.closest('autocomlete')) {
              document.getElementById("results").innerHTML = '';
            }
          });
        });

      }

    })
    .catch(error => console.error('Error:', error));



});

document.getElementById("categories").addEventListener("change", function () {
  fetch("/server/admin/warehouse_admin/database_extract.php")
    .then((jsonResponse) => jsonResponse.json())
    .then((data) => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        const selected_cat = document.getElementById("categories").value;
        items_select(data, selected_cat);
      }
    })
    .catch((error) => console.error("Error:", error));
});

document.getElementById("itemsTable").addEventListener("click", function (event) {
  if (event.target.tagName === "TD") {
    const selected_row = event.target.closest("tr");
    const row_items = Array.from(selected_row.cells).map(
      (cell) => cell.textContent
    );
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

    for (var i = 0; i < item_check.length; i++) {
      if (item_check[i] === id) {
        flag = 1;
        break;
      }
    }

    if (flag === 0) {
      const row_table = document.createElement("tr");
      const item_id = document.createElement("td");
      const name_table = document.createElement("td");
      const item_quantity = document.createElement("td");
      const item_delete = document.createElement("td");

      item_id.textContent = id;
      name_table.textContent = item;
      item_quantity.innerHTML = `<input type="range" id="${id}" 
      min="0" max="20" value="0"></input><span id="quantity_${id}">0</span>`;
      item_delete.innerHTML = `<button id=cancel_${id}>cancel</button>`;

      row_table.appendChild(item_id);
      row_table.appendChild(name_table);
      row_table.appendChild(item_quantity);
      row_table.appendChild(item_delete);

      table.appendChild(row_table);

      document.getElementById(`${id}`).addEventListener("input", function () {
        document.getElementById(`quantity_${id}`).innerText = this.value;
      });

      document.getElementById(`cancel_${id}`).addEventListener("click", function () {
        var row = this.closest('tr');
        row.parentNode.removeChild(row);
      });
    }
  }
});


document.getElementById("submitAnnouncement").addEventListener("click", function () {

  var selectTable = document.getElementById('itemSelected');
  var flag = 0;

  if (selectTable.rows.length > 0) {
    for (var i = 0; i < selectTable.rows.length; i++) {
      if (parseInt(document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText) === 0) {
        flag = 1;

        alert(`Select a quantity over 0 for item: ${selectTable.rows[i].cells[1].innerHTML}`);
      }
    }
  } else {
    flag = 1;
    alert("Select at least one item for the request");
  }

  if (flag === 0) {

    fetch("/server/admin/announcement/announcement_insert.php")
      .then(jsonResponse => jsonResponse.json())
      .then(announcement_id => {

        for (var i = 0; i < selectTable.rows.length; i++) {
          if (document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText > 0) {

            const data = {
              id: announcement_id.id,
              item_id: selectTable.rows[i].cells[0].innerHTML,
              quantity: document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText,
            };

            fetch("/server/admin/announcement/announcement_upload.php", {
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
                  fetch("/server/admin/warehouse_admin/database_extract.php", {
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
                        var selected_cat = document.getElementById("categories").value;
                        items_select(data, selected_cat);
                        document.getElementById("itemSelected").innerHTML = "";
                      }
                    })
                    .catch((error) => console.error("Error:", error));

                  fetch('/server/admin/announcement/announcement.php')
                    .then(jsonResponse => {

                      const isEmpty = jsonResponse.headers.get('Content-Length');
                      if (isEmpty === '0') {
                        return null;
                      }

                      return jsonResponse.json();
                    })
                    .then(data => {
                      if (data !== null) {
                        announcementTable(data);
                      }
                      else {
                        const table = document.getElementById("announcements");
                        table.innerHTML = '';
                        table.textContent = "There are now requests";

                      }
                    })
                    .catch(error => console.error('Error:', error));
                }
              })
              .catch((error) => console.error("Error:", error));
          }
        }
      })
      .catch((error) => console.error("Error:", error));

  }

});
