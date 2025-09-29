document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/dashboard/usuarios");
        const data = await response.json();

        const ctx = document.getElementById("usuarios").getContext("2d");

        new Chart(ctx, {
            type: "bar", data: {
                labels: Object.keys(data), datasets: [{
                    label: "Cantidad",
                    data: Object.values(data),
                    backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)"],
                    borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
                    borderWidth: 1,
                }]
            }, options: {
                responsive: true, scales: {
                    y: {
                        beginAtZero: true, ticks: {
                            precision: 0,
                        }
                    }
                }
            }
        })


    } catch (error) {
        console.error("Error al cargar el usuario: ", error.message());
    }
})