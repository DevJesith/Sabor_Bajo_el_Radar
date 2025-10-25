document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/dashboard/ventas-por-mes");
        const data = await response.json();

        const ctx = document.getElementById("lineaVentas").getContext("2d");

        new Chart(ctx, {
            type: "line",
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: "Ventas",
                    data: Object.values(data),
                    backgroundColor: "rgba(255, 159, 64, 1)",
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                response: true,
                scale: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        })
    } catch (error) {
        console.error("Error al cargar ventas: ", error.message())
    }
})