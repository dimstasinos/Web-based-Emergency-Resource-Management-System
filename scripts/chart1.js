const chartData = {
    labels: ["New Requests", "New Offers", "Processed Requests", "Processed Offers"],
    data: [1,2,3,4]

};


const Servchart = document.querySelector(".servchart");
const ul = document.querySelector (".service-stats .details ul");
new Chart(Servchart, {
    type: "doughnut",
    data:{
        labels: chartData.labels,
        datasets: [
        {
            label: "Number:",
            data: chartData.data,

        },
      ],
    },
    options: {
        borderWidth: 10,
        borderRadius: 2,
        hoverBorderWidth: 0,
        plugins: {
            legend: {
                display:false,
            },
        },
    },
});

