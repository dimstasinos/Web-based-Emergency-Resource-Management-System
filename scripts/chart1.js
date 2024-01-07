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
            .then(data => {
                console.log(data);

                const values = Object.values(data).map(item => item.plithos);
                const ctx = document.getElementById('serverchart');
                const existingChart = Chart.getChart(ctx);
                if (existingChart) {
                    existingChart.destroy();
                }

                const serverchart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(data),
                        datasets: [{
                            data: values,
                            backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB', '#FF8F00', '#4CAF50', '#6200EA'],
                        }],
                    },
                });


            })
            .catch(error => console.error("Error:", error));


    }


});

