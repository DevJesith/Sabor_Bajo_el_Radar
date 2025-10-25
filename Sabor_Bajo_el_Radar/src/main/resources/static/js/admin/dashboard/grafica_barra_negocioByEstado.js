document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/api/dashboard/negocios-por-estado");
        const data = await response.json();

        const labels = data.map(item => `${item.estado} - ${item.aprobado}`);
        const valores = data.map(item => item.cantidad);

        const ctx = document.getElementById("estadoNegocios").getContext("2d");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Negocios",
                    data: valores,
                    backgroundColor: "rgba(153, 102, 255, 0.6)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {precision: 0}
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error al cargar negocios: ", error.message);
    }
});