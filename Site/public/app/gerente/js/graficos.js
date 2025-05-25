// const categoria = document.getElementById("chartCategoria");

// const labelsChartCategoria = [
//     "01/05",
//     "02/05",
//     "03/05",
//     "04/05",
//     "05/05",
//     "06/05",
//     "07/05",
// ];
// const dataChartCategoria = {
//     labels: labelsChartCategoria,
    // datasets: [
    //     {
    //         label: "Bom",
    //         data: [65, 59, 80, 81, 56, 55, 59],
    //         fill: false,
    //         borderColor: "#65AE50",
    //         tension: 0.1,
    //     },
    //     {
    //         label: "Crítico",
    //         data: [20, 10, 15, 34, 27, 50, 30],
    //         fill: false,
    //         borderColor: "#A12929",
    //         tension: 0.1,
    //     },
    //     {
    //         label: "Médio",
    //         data: [20, 25, 12, 27, 23, 34, 50],
    //         fill: false,
    //         borderColor: "#D9AA2A",
    //         tension: 0.1,
    //     },
    // ],
// };

// new Chart(categoria, {
//     type: "line",
//     data: dataChartCategoria,
//     options: {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: "top",
//                 align: "center",
//                 labels: {
//                     color: '#FFFFFF',
//                     boxWidth: 10,
//                     boxHeight: 10
//                 }
//             },
//         },
//         scales: {
//             x: {
//                 ticks: {
//                     color: "#FFFFFF",
//                 },
//             },
//             y: {
//                 ticks: {
//                     color: "#FFFFFF",
//                 },
//             },
//         },
//     },
// });

// const incidentes = document.getElementById("chartIncidentes");

// const dataChartIncidentes = {
//     labels: ["ATM001", "ATM002", "ATM003", "ATM004", "ATM005"],
//     datasets: [{
//         label: "Quantidade de alertas",
//         data: [65, 59, 46, 39, 28],
//         backgroundColor: "#2A5277",
//         borderRadius: 5
//     }]
// };


// new Chart(incidentes, {
//     type: "bar",
//     data: dataChartIncidentes,
//     options: {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: "top",
//                 align: "center",
//                 labels: {
//                     color: '#FFFFFF',
//                     boxWidth: 10,
//                     boxHeight: 10
//                 }
//             },
//         },
//         scales: {
//             x: {
//                 ticks: {
//                     color: "#FFFFFF",
//                 },
//             },
//             y: {
//                 ticks: {
//                     color: "#FFFFFF",
//                 },
//             },
//         },
//     },
// });


const tempoChamados = document.getElementById("chartChamados");

const labelsChartChamados = [
    "01/05",
    "02/05",
    "03/05",
    "04/05",
    "05/05",
    "06/05",
    "07/05",
];

const dataTempoChamados = {
    labels: labelsChartChamados,
    datasets: [{
        label: "Quantidade de alertas",
        data: [65, 59, 46, 39, 28, 30, 56],
        backgroundColor: "#F19D5E",
        borderRadius: 5
    },
    {
        label: "Tempo médio de resolução",
        data: [60, 58, 69, 42, 40, 35, 40],
        borderRadius: 5,
        backgroundColor: "#2A5277"
    }
    ]
};

new Chart(tempoChamados, {
    type: "bar",
    data: dataTempoChamados,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                align: "center",
                labels: {
                    color: '#FFFFFF',
                    boxWidth: 10,
                    boxHeight: 10
                }
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#FFFFFF",
                },
            },
            y: {
                ticks: {
                    color: "#FFFFFF",
                },
            },
        },
    },
});