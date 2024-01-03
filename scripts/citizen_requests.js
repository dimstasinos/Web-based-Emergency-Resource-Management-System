document.addEventListener('DOMContentLoaded', function () {

  fetch('/server/citizen/database_extract.php')
    .then(jsonResponse => {

      const isEmpty = jsonResponse.headers.get('Content-Length');
      if (isEmpty === '0') {
        return null;
      }

      return jsonResponse.json();
    })
    .then(data => {

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
    })
    .catch(error => console.error('Error:', error));


    

});


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

document.getElementById("search").addEventListener("input", function () {

  fetch('/server/citizen/database_extract.php')
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

document.getElementById("submitRequest").addEventListener("click", function () {

  var selectTable = document.getElementById('itemSelected');

  if (selectTable.rows.length > 0) {
    for (var i = 0; i < selectTable.rows.length; i++) {
      if (document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText > 0) {

        const data = {
          id: selectTable.rows[i].cells[0].innerHTML,
          quantity: document.getElementById(`quantity_${selectTable.rows[i].cells[0].innerHTML}`).innerText,
        };

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
              fetch("/server/citizen/database_extract.php", {
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

                    var selected_cat = document.getElementById("categorySelect").value;
                    items_select(data, selected_cat);
                    document.getElementById("itemSelected").innerHTML = "";
                  }
                })
                .catch((error) => console.error("Error:", error));
            }
          })
          .catch((error) => console.error("Error:", error));

      } else {
        alert(`Select a quantity over 0 for item: ${selectTable.rows[i].cells[1].innerHTML}`)

      }
    }
  } else {
    alert("Select at least one item for the request");
  }

});



/*var onload_data;

document.addEventListener('DOMContentLoaded', function () {

  fetch('/server/request/request.php')
    .then(response => response.json())
    .then(data => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        const tablebody = document.getElementById("table_request");

        data.request.forEach(item => {
          const row = document.createElement('tr');

          const idCell = document.createElement('td');
          idCell.textContent = item.id;
          row.appendChild(idCell);

          const weneedCell = document.createElement('td');
          weneedCell.textContent = item.weneed;
          row.appendChild(weneedCell);

          const dateCell = document.createElement('td');
          dateCell.textContent = item.date;
          row.appendChild(dateCell);

          const personsCell = document.createElement('td');
          personsCell.textContent = item.persons;
          row.appendChild(personsCell);


          tablebody.appendChild(row);

        });
      }


    })
    .catch(error => console.error('Error fetching data:', error));

  fetch('/server/warehouse_admin/database_extract.php')
    .then(jsonResponse => {

      const isEmpty = jsonResponse.headers.get('Content-Length');
      if (isEmpty === '0') {
        return null;
      }

      return jsonResponse.json();
    })
    .then(data => {

      if (data != null) {

        categories_select(data);
        selected_cat = category_id(data);
        items_select(data, selected_cat);
        onload_data = data;
      }
      else {
        const list = document.getElementById("cat_list");
        list.innerHTML = '';
        let select_add = document.createElement("option");
        select_add.textContent = "Η Βάση δεδομένων είναι κενή";
        list.appendChild(select_add);
        document.getElementById('add_new_cat').disabled = true;

      }
    })
    .catch(error => console.error('Error:', error));


});


document.getElementById('upload-button').addEventListener('click', function () {
  

  weneed = document.getElementById('weneed').value;
  if (document.getElementById('persons').value > 0) {
    persons = document.getElementById('persons').value;
  } else {
    alert("Το πλήθος πρέπει να είναι θετικό.")
  };
  const data = {
    weneed: weneed,
    persons: persons
  };


  fetch("/server/request/request_upload.php", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        fetch('/server/request/request.php')
          .then(response => response.json())
          .then(data => {
            if (data.status === "error") {
              console.error("Server Error:", data.Error);
            } else {
              document.getElementById("table_request").innerHTML = "";

              const tableBody = document.getElementById('table_request');

              data.request.forEach(item => {

                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = item.id;
                row.appendChild(idCell);

                const weneedCell = document.createElement('td');
                weneedCell.textContent = item.weneed;
                row.appendChild(weneedCell);

                const dateCell = document.createElement('td');
                dateCell.textContent = item.date;
                row.appendChild(dateCell);

                const personsCell = document.createElement('td');
                personsCell.textContent = item.persons;
                row.appendChild(personsCell);

                tableBody.appendChild(row);


              });
            }

          })

          .catch(error => console.error('Error fetching data:', error));
      }
    });


});
document.getElementById("table_admin_request").addEventListener("click", function (event) {


  if (event.target.tagName === "TD") {

    const selected_row = event.target.closest("tr");
    const row_items = Array.from(selected_row.cells).map(cell => cell.textContent);
    const item_id = row_items[0];

    const product = onload_data.items.find(item => item.id === item_id);


    document.getElementById("weneed").value = product.name;
  }
});
document.getElementById('cat_list').addEventListener('change', function () {

  fetch('/server/warehouse_admin/database_extract.php',)
    .then(jsonResponse => jsonResponse.json())
    .then(data => {
      if (data.status === "error") {
        console.error("Server Error:", data.Error);
      } else {
        onload_data = data;
        const selected_cat = category_id(data);
        items_select(data, selected_cat);


        document.getElementById('weneed').value = '';

      }

    })
    .catch(error => console.error('Error:', error));


});
function category_id(data) {

  var list_select = document.getElementById("cat_list");
  var category_select = list_select.options[list_select.selectedIndex].text;
  var category = data.categories.find(category => category.category_name === category_select);
  return category.id;
}

function items_select(data, selected_cat) {
  const table = document.getElementById('items_table');

  table.innerHTML = '';


  data.items.forEach(item => {
    if (item.name != "" && item.category === selected_cat) {
      const row_table = document.createElement('tr');
      const id_table = document.createElement('td');
      const name_table = document.createElement('td');
      const category_table = document.createElement('td');
      const detail_table = document.createElement('td');


      id_table.textContent = item.id;
      name_table.textContent = item.name;
      const category = data.categories.find(category => category.id === item.category);
      category_table.textContent = category.category_name;



      const detail_get = item.details.map(detail => {
        if (detail.detail_name && detail.detail_value) {
          return `${detail.detail_name}: ${detail.detail_value}`;
        } else if (detail.detail_name && detail.detail_value === '') {
          return `${detail.detail_name}:`;
        } else if (detail.detail_name === '' && detail.detail_value) {
          return `---: ${detail.detail_value}`;
        }
        else {
          return ' ';
        }
      });
      detail_table.innerHTML = detail_get.join('<br>');

      row_table.appendChild(id_table);
      row_table.appendChild(name_table);
      row_table.appendChild(category_table);
      row_table.appendChild(detail_table);

      table.appendChild(row_table);
    }
  });

}

function categories_select(data) {

  const list = document.getElementById("cat_list");

  list.innerHTML = '';

  data.categories.forEach(category => {
    if (category.category_name !== "" && category.category_name !== "-----") {
      let select_add = document.createElement("option");
      select_add.textContent = category.category_name;
      select_add.value = category.category_name;
      list.appendChild(select_add);
    }
  });

}




*/