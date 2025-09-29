document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/api/dashboard/ingresos-categorias");
        const data = await response.json();

        const labels = Object.keys(data);
        const valores = Object.values(data);

        new Chart(document.getElementById("categoriaVenta"), {
            type: "pie", data: {
                labels: labels, datasets: [{
                    data: valores,
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
                    borderColor: "#fff",
                    borderWidth: 2
                }]
            }, options: {
                responsive: true, plugins: {
                    legend: {
                        position: "right", labels: {
                            color: "#333", font: {
                                size: 14, weight: "bold"
                            }
                        }
                    }, tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                return `${label}: $${value.toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
});
