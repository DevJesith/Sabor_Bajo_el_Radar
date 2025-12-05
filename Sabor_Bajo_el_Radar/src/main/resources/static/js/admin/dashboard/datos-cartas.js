document.addEventListener("DOMContentLoaded", async () => {
    try {

        const resumen = await fetch("/api/dashboard/resumen").then(res => res.json());

        document.getElementById("totalUsuarios").textContent = resumen.totalUsuarios;
        document.getElementById("negociosActivos").textContent = resumen.negociosActivos;
        document.getElementById("ventasTotales").textContent = `$${resumen.ventasTotales.toFixed(2)}`;
        document.getElementById("pqrsPendientes").textContent = resumen.pqrsPendientes;
        document.getElementById("comprasRealizadas").textContent = resumen.comprasRealizadas;
        document.getElementById("negociosPendientes").textContent = resumen.negociosPendientes || 0;
        

    } catch (error) {
        console.error("Error al cargar tarjetas del dashboard: ", error.message());
    }
})