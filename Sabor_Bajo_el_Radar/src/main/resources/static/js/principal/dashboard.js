document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/api/dashboard/usuarios");
        const data = await response.json();

        const ctx = document.getElementById("usuariosChart").getContext("2d");

        new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: "Usuarios por Rol",
                    data: Object.values(data),
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(75, 192, 192, 0.6)"
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
});
