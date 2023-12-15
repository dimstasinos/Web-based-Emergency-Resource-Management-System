var onload_data;

document.addEventListener('DOMContentLoaded', function () {
    console.log ("hi");

    fetch('/server/request/request.php')
        .then(response => response.json())
        .then(data => {
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
console.log ("hi");


document.getElementById('upload-button').addEventListener('click', function () {
    var form = document.getElementById("request-announcement-form");

    text = document.getElementById('weneed').value;
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
            fetch('/server/request/request.php')
                .then(response => response.json())
                .then(data => {
                    document.getElementById("request-table_announcement").innerHTML = "";

                    const tableBody = document.getElementById('table_request');

                    data.announcements.forEach(item => {

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

                })

                .catch(error => console.error('Error fetching data:', error));
        });


    document.getElementById("table_admin_request").addEventListener("click", function (event) {

        if (event.target.tagName === "td") {
            
            const selected_row = event.target.closest("tr");
            const row_items = Array.from(selected_row.cells).map(cell => cell.textContent);
            const item_id = row_items[0];

            const product = onload_data.items.find(item => item.id === item_id);

            
            document.getElementById("weneed").value = product;
        }
    });

    document.getElementById('cat_list').addEventListener('change', function () {

        fetch('/server/warehouse_admin/database_extract.php',)
            .then(jsonResponse => jsonResponse.json())
            .then(data => {
                onload_data = data;
                const selected_cat = category_id(data);
                items_select(data, selected_cat);


                document.getElementById('weneed').value = '';

            })
            .catch(error => console.error('Error:', error));
    });
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

