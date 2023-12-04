document.addEventListener('DOMContentLoaded', function () {
    fetch('/server/announcement.php',)
        .then(jsonResponse => {

            const isEmpty = jsonResponse.headers.get('Content-Length');
            if (isEmpty === '0') {
                return null;
            }

            return jsonResponse.json();
        })
        .then(data => {
            if (data != null) {
                console.log(data);
                announcements_select(data);
                selected_ann = announcements_id(data);
                announcements_select(data, selected_ann);
            }
            else {
                const list = document.getElementById("ann_list");
                list.innerHTML = '';
                let select_add = document.createElement("option");
                select_add.textContent = "Η Βάση δεδομένων είναι κενή";
                list.appendChild(select_add);
            }
        })
        .catch(error => console.error('Error:', error));
});
