// Función genérica para obtener chart por ID
function getChartInstance(canvasId) {
    return Chart.getChart(canvasId);
}

// Exportar PNG
function exportPNG(canvasId, nombreArchivo) {
    const chart = getChartInstance(canvasId);
    if (!chart) return;

    const link = document.createElement("a");
    link.href = chart.toBase64Image();
    link.download = `${nombreArchivo}.png`;
    link.click();
}

// Exportar PDF
function exportPDF(canvasId, nombreArchivo) {
    const chart = getChartInstance(canvasId);
    if (!chart) return;

    const {jsPDF} = window.jspdf;
    const pdf = new jsPDF();
    pdf.text("Reporte gráfico: " + nombreArchivo, 10, 10);
    pdf.addImage(chart.toBase64Image(), "PNG", 10, 20, 180, 100);
    pdf.save(`${nombreArchivo}.pdf`);
}

// Exportar Excel
function exportExcel(canvasId, nombreArchivo) {
    const chart = getChartInstance(canvasId);
    if (!chart) return;

    const labels = chart.data.labels;
    const valores = chart.data.datasets[0].data;

    const worksheetData = [["Etiqueta", "Valor"]];
    labels.forEach((label, i) => {
        worksheetData.push([label, valores[i]]);
    });

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");

    XLSX.writeFile(wb, `${nombreArchivo}.xlsx`);
}

// Exportar Word
function exportWord(canvasId, nombreArchivo) {
    const chart = getChartInstance(canvasId);
    if (!chart) return;

    const labels = chart.data.labels;
    const valores = chart.data.datasets[0].data;

    let contenido = `<h2>Reporte gráfico: ${nombreArchivo}</h2><table border="1" style="border-collapse:collapse"><tr><th>Etiqueta</th><th>Valor</th></tr>`;
    labels.forEach((label, i) => {
        contenido += `<tr><td>${label}</td><td>${valores[i]}</td></tr>`;
    });
    contenido += `</table>`;

    const blob = new Blob(['\ufeff', contenido], {
        type: 'application/msword'
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${nombreArchivo}.doc`;
    link.click();
}

