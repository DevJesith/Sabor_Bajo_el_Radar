document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/dashboard/pqrs-por-estado");
        const data = await response.json();

        const ctx = document.getElementById("estadoPqrs").getContext("2d");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: "PQRS",
                    data: Object.values(data),
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                }]
            },
            options: {
                response: true,
                scale: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                        }
                    }
                }
            }
        })
    } catch (error) {
        console.error("Error al cargar PQRS: ", error.message())
    }
})