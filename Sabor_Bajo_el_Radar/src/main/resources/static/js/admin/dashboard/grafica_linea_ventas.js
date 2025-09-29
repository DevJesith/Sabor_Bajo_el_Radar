document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/api/dashboard/ventas");
        const data = await response.json();

        const ctx = document.getElementById("lineaVentas").getContext("2d");

        new Chart(ctx, {
            type: "line",
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: "Compras por mes",
                    data: Object.values(data),
                    fill: false,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        },
                        title: {
                            display: true,
                            text: "Total en COP"
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Mes"
                        }
                    }
                }
            }
        })
    } catch (e) {
        console.error("Error al cargar las compras: ", e.message());
    }
})