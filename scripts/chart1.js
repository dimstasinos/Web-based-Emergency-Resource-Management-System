document.getElementById("submitdate").addEventListener("click", function () {

    const start_date = document.getElementById('startdate').value + " 00:00:00";
    const end_date = document.getElementById('enddate').value + " 23:59:59";


    if (start_date > end_date) {
        alert('Start date must be earlier than the end date');
    } else {
        const data = {
            startdate: start_date,
            enddate: end_date
        }


        fetch("/server/chart/newreq.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),

        })
            .then((response) => response.json())
            .then((data) => {
            console.log(data);

            })
            .catch(error => console.error("Error:", error));

        
    }



});
