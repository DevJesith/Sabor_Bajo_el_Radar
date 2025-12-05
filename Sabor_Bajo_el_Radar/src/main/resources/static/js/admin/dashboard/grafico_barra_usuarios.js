document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('usuariosChart');
    if (!ctx) {
        console.error("El elemento canvas con id 'usuariosChart' no fue encontrado.");
        return;
    }

    let usuariosChartInstance = null; // Variable para guardar la instancia del gráfico

    async function cargarYRenderizarGrafico() {
        try {
            const response = await fetch('/api/dashboard/usuarios-por-rol');

            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Extraer las etiquetas (roles) y los valores (cantidades)
            const labels = Object.keys(data);
            const values = Object.values(data);

            // Colores para las barras
            const backgroundColors = [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)'
            ];
            const borderColors = [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ];

            // Si ya existe un gráfico, lo destruimos antes de crear uno nuevo
            if (usuariosChartInstance) {
                usuariosChartInstance.destroy();
            }

            // Creamos la nueva instancia del gráfico
            usuariosChartInstance = new Chart(ctx, {
                type: 'bar', // Tipo de gráfico: barras
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Número de Usuarios',
                        data: values,
                        backgroundColor: backgroundColors.slice(0, labels.length),
                        borderColor: borderColors.slice(0, labels.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                // Asegurar que solo se muestren números enteros en el eje Y
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false // Ocultamos la leyenda para un look más limpio
                        },
                        title: {
                            display: true,
                            text: 'Distribución de Usuarios por Rol'
                        }
                    }
                }
            });

        } catch (error) {
            // Manejo de errores mejorado
            console.error('No se pudo cargar o renderizar el gráfico de usuarios:', error);
            // Opcional: Mostrar un mensaje de error en lugar del canvas
            ctx.parentElement.innerHTML = '<p class="text-center text-danger">No se pudieron cargar los datos del gráfico.</p>';
        }
    }

    // Llamamos a la función para que se ejecute al cargar la página
    cargarYRenderizarGrafico();
});