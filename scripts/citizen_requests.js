//Event listener που εκτελείτε όταν φορτωθεί η HTML
document.addEventListener('DOMContentLoaded', function () {

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

  //Φόρτωση των ειδών της βάσης δεδομένων
  fetch('/server/citizen/database_extract.php')
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
        //Εμφάνιση ειδών
        if (data != null) {
          categories_select(data);
          var selected_cat = document.getElementById("categories").value;
          items_select(data, selected_cat)
        }
        else {
          const list = document.getElementById("categories");
          list.innerHTML = '';
          let select_add = document.createElement("option");
          select_add.textContent = "Η Βάση δεδομένων είναι κενή";
          list.appendChild(select_add);
        }
      }
    })
    .catch(error => console.error('Error:', error));

  //Εμφάνιση αιτημάτων
  fetch('/server/citizen/requests.php')
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
          requestTable(data);
        }
        else {
          const table = document.getElementById("table_request");
          table.innerHTML = '';
          table.textContent = "Δεν υπάρχουν αιτηματα";
        }
      }
    })
    .catch(error => console.error('Error:', error));
});

//Συνάρτηση που τοποθετεί τις κατηγορίες ειδών
//σε λίστα
function categories_select(data) {
  const list = document.getElementById("categories");

  list.innerHTML = "";

  data.categories.forEach((category) => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      let select_add = document.createElement("option");
      select_add.textContent = category.category_name;
      select_add.value = category.id;
      list.appendChild(select_add);
    }
  });
}

//Συνάρτηση που τοποθετεί τα είδη στον πίνακα
function items_select(data, selected_cat) {
  const table = document.getElementById("itemsTable");

  table.innerHTML = "";

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

//Συνάρτηση που δημιουργεί τον πίνακα αιτημάτων
function requestTable(data) {

  const request_table = document.getElementById("requests");

  request_table.innerHTML = "";

  //Προσπέλαση δεδομένων
  data.forEach(request => {

    //Δημιουργία του πίνακα
    const row_table = document.createElement("tr");
    const item_name = document.createElement("td");
    const item_quantity = document.createElement("td");
    const sub_date = document.createElement("td");
    const pick_date = document.createElement("td");
    const complete_date = document.createElement("td");
    const action = document.createElement("td");

    item_name.textContent = request.item_name;
    item_quantity.textContent = request.quantity;
    sub_date.textContent = request.submission_date;
    action.innerHTML = `<button id="${request.request_id}">Ακύρωση</button>`;

    if (request.pickup_date === null) {
      pick_date.textContent = "-";
    } else {
      pick_date.textContent = request.pickup_date;
    }

    if (request.hasOwnProperty('complete_date')) {
      complete_date.textContent = request.complete_date;
    } else {
      complete_date.textContent = "-";
    }

    row_table.appendChild(item_name);
    row_table.appendChild(item_quantity);
    row_table.appendChild(sub_date);
    row_table.appendChild(pick_date);
    row_table.appendChild(complete_date);
    row_table.appendChild(action);

    request_table.appendChild(row_table);

    if (request.pickup_date === null) {
      document.getElementById(`${request.request_id}`).disabled = false;

    } else {
      document.getElementById(`${request.request_id}`).disabled = true;
    }

    if (document.getElementById(`${request.request_id}`).disabled === false) {

      //Event listener για την διαγραφή κάποιου αιτήματος
      document.getElementById(`${request.request_id}`).addEventListener("click", function () {

        const data = {
          id: request.request_id
        };

        //Επικοινωνία με τον server για διαγραφή του αιτήματος
        fetch("/server/citizen/request_delete.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {

            //Ανανέωση πίνακα αιτημάτων
            fetch('/server/citizen/requests.php')
              .then(jsonResponse => {

                const isEmpty = jsonResponse.headers.get('Content-Length');
                if (isEmpty === '0') {
                  return null;
                }

                return jsonResponse.json();
              })
              .then(data => {
                if (data !== null) {
                  requestTable(data);
                }
                else {
                  const table = document.getElementById("table_request");
                  table.innerHTML = '';
                  table.textContent = "Δεν υπάρχουν αιτήαμτα";

                }
              })
              .catch(error => console.error('Error:', error));
          })
          .catch((error) => console.error("Error:", error))
      });
    }
  });
}

//Event listener που εμφανίζει τα είδη ανάλογα με την επιλεγμένη κατηγορία
document.getElementById("categories").addEventListener("change", function () {
  fetch("/server/citizen/database_extract.php")
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

//Event listner ο οποίος συμπληρώνει τα είδη που
//επιλέχθηκε από τον πίνακα
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
      min="0" max="30" value="0"></input><span id="quantity_${id}">0</span>`;
      item_delete.innerHTML = `<button id=cancel_${id}>Διαγραφή</button>`;

      row_table.appendChild(item_id);
      row_table.appendChild(name_table);
      row_table.appendChild(item_quantity);
      row_table.appendChild(item_delete);

      table.appendChild(row_table);

      //Event listener που ανανεώνει την ποσότητα του είδους
      document.getElementById(`${id}`).addEventListener("input", function () {
        document.getElementById(`quantity_${id}`).innerText = this.value;
      });

      //Event listener που διαγράφει το είδος από τον πίνακα
      document.getElementById(`cancel_${id}`).addEventListener("click", function () {
        var row = this.closest('tr');
        row.parentNode.removeChild(row);
      });
    }
  }
});

//Event listener που εμφανίζει τα είδη ανάλογα με την καταχώρηση του χρήστη
document.getElementById("search").addEventListener("input", function () {

  //Ανάκτηση δεδομένων απο τον server
  fetch('/server/citizen/database_extract.php')
    .then(jsonResponse => {

      const isEmpty = jsonResponse.headers.get('Content-Length');
      if (isEmpty === '0') {
        return null;
      }
      return jsonResponse.json();
    })
    .then(data => {

      //Εύρεση ειδών που ξεκινούν με την καταχώρηση του χρήστη
      if (data != null) {
        var input = document.getElementById("search").value.toLowerCase();


        if (input.length > 0) {


          var results = data.items.filter(item => {
            return item.name.toLowerCase().startsWith(input);
          });

          document.getElementById("result_list").innerHTML = '';

          results.forEach(item => {
            var resultPrint = document.createElement('li');
            resultPrint.classList.add('autocomplete_result');
            resultPrint.textContent = item.name;

            document.getElementById("result_list").appendChild(resultPrint);

            document.getElementById('result_list').style.display = 'block'

            resultPrint.addEventListener('click', function () {

              document.getElementById("search").value = item.name;
              document.getElementById("result_list").innerHTML = '';


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

              //Τοποθέτηση στον πίνακα επιλεγμένων
              if (flag === 0) {

                document.getElementById("search").value = "";

                const row_table = document.createElement("tr");
                const item_id = document.createElement("td");
                const name_table = document.createElement("td");
                const item_quantity = document.createElement("td");
                const item_delete = document.createElement("td");

                item_id.textContent = item.id;
                name_table.textContent = item.name;
                item_quantity.innerHTML = `<input type="range" id="${item.id}" 
              min="0" max="30" value="0"></input><span id="quantity_${item.id}">0</span>`;
                item_delete.innerHTML = `<button id=cancel_${item.id}>Διαγραφή</button>`;

                row_table.appendChild(item_id);
                row_table.appendChild(name_table);
                row_table.appendChild(item_quantity);
                row_table.appendChild(item_delete);

                table.appendChild(row_table);

                //Event listener που ανανεώνει την ποσότητα του είδους
                document.getElementById(`${item.id}`).addEventListener("input", function () {
                  document.getElementById(`quantity_${item.id}`).innerText = this.value;
                });

                //Event listener που ανανεώνει την ποσότητα του είδους
                document.getElementById(`cancel_${item.id}`).addEventListener("click", function () {
                  var row = this.closest('tr');
                  row.parentNode.removeChild(row);
                });
              }
            });

            //Αφαίρεση λίστας αναζήτησης
            document.addEventListener('click', function (event) {
              if (!event.target.closest('autocomlete')) {
                document.getElementById('result_list').style.display = 'none'
                document.getElementById("result_list").innerHTML = '';
              }
            });
          });
        } else {
          document.getElementById('result_list').style.display = 'none'
        }
      }
    })
    .catch(error => console.error('Error:', error));
});

//Event listener που εμφανίζει τα είδη ανάλογα με την καταχώρηση του χρήστη
document.getElementById("search").addEventListener("click", function () {
  //Ανάκτηση δεδομένων απο τον server
  fetch('/server/citizen/database_extract.php')
    .then(jsonResponse => {

      const isEmpty = jsonResponse.headers.get('Content-Length');
      if (isEmpty === '0') {
        return null;
      }
      return jsonResponse.json();
    })
    .then(data => {

      //Εύρεση ειδών που ξεκινούν με την καταχώρηση του χρήστη
      if (data != null) {
        var input = document.getElementById("search").value.toLowerCase();

        if (input.length > 0) {
          var results = data.items.filter(item => {
            return item.name.toLowerCase().startsWith(input);
          });

          document.getElementById("result_list").innerHTML = '';

          //Εμφάνιση αποτελεσμάτων
          results.forEach(item => {
            var resultPrint = document.createElement('li');
            resultPrint.classList.add('autocomplete_result');
            resultPrint.textContent = item.name;

            document.getElementById("result_list").appendChild(resultPrint);

            document.getElementById('result_list').style.display = 'block'

            resultPrint.addEventListener('click', function () {

              document.getElementById("search").value = item.name;
              document.getElementById("result_list").innerHTML = '';


              const table = document.getElementById("itemSelected");
              var flag = 0;
              var item_check = [];

              //Έλεγχος εάν υπάρχουν ήδη στον πίνακα
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

              //Τοποθέτηση στον πίνακα επιλεγμένων
              if (flag === 0) {

                document.getElementById("search").value = "";

                const row_table = document.createElement("tr");
                const item_id = document.createElement("td");
                const name_table = document.createElement("td");
                const item_quantity = document.createElement("td");
                const item_delete = document.createElement("td");

                item_id.textContent = item.id;
                name_table.textContent = item.name;
                item_quantity.innerHTML = `<input type="range" id="${item.id}" 
           min="0" max="30" value="0"></input><span id="quantity_${item.id}">0</span>`;
                item_delete.innerHTML = `<button id=cancel_${item.id}>Διαγραφή</button>`;

                row_table.appendChild(item_id);
                row_table.appendChild(name_table);
                row_table.appendChild(item_quantity);
                row_table.appendChild(item_delete);

                table.appendChild(row_table);

                //Event listener που ανανεώνει την ποσότητα του είδους
                document.getElementById(`${item.id}`).addEventListener("input", function () {
                  document.getElementById(`quantity_${item.id}`).innerText = this.value;
                });

                //Event listener που ανανεώνει την ποσότητα του είδους
                document.getElementById(`cancel_${item.id}`).addEventListener("click", function () {
                  var row = this.closest('tr');
                  row.parentNode.removeChild(row);
                });
              }
            });

            //Αφαίρεση λίστας αναζήτησης
            document.addEventListener('click', function (event) {
              if (!event.target.closest('autocomlete')) {
                document.getElementById('result_list').style.display = 'none'
                document.getElementById("result_list").innerHTML = '';
              }
            });
          });
        }
      } else {
        document.getElementById('result_list').style.display = 'none'
      }
    })
    .catch(error => console.error('Error:', error));
});

//Event listener για την υποβολή του αιτήματος
document.getElementById("submitRequest").addEventListener("click", function () {

  var selectTable = document.getElementById('itemSelected');
  var flag = 0;

  if (selectTable.rows.length > 0) {
    for (var i = 0; i < selectTable.rows.length; i++) {
      if (parseInt(document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText) === 0) {
        flag = 1;

        alert(`Επέλεξε ποσότητα μεγαλύτερη από 0 για το προιόν: ${selectTable.rows[i].cells[1].innerHTML}`);
      }
    }
  } else {
    flag = 1;
    alert("Επέλεξε τουλάχιστον ένα προιόν για το αίτημα");
  }

  if (flag === 0) {

    for (var i = 0; i < selectTable.rows.length; i++) {
      if (document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText > 0) {

        const data = {
          id: selectTable.rows[i].cells[0].innerHTML,
          quantity: document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText,
        };

        //Επικοινωνία με τον server για ανέβασμα του αιτήματος
        fetch("/server/citizen/request_upload.php", {
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

              //Ανανέωση του πίνακα με τα αιτήματα
              fetch('/server/citizen/requests.php')
                .then(jsonResponse => {

                  const isEmpty = jsonResponse.headers.get('Content-Length');
                  if (isEmpty === '0') {
                    return null;
                  }

                  return jsonResponse.json();
                })
                .then(data => {
                  if (data !== null) {
                    requestTable(data);
                  }
                  else {
                    const table = document.getElementById("table_request");
                    table.innerHTML = '';
                    table.textContent = "Δεν υπάρχουν αιτήματα";

                  }
                })
                .catch(error => console.error('Error:', error));
            }
          })
          .catch((error) => console.error("Error:", error));
      }
    }
    selectTable.innerHTML="";
  }

});


