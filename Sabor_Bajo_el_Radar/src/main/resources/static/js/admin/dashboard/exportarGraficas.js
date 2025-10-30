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

//------------------------------
function exportTablaPDF(nombreArchivo) {
    const {jsPDF} = window.jspdf;
    const pdf = new jsPDF();
    const tabla = document.querySelector("table");

    // Ocultar columna de acciones
    tabla.querySelectorAll("tr").forEach(fila => {
        if (fila.lastElementChild) {
            fila.lastElementChild.style.display = "none";
        }
    });

    html2canvas(tabla).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        pdf.text("Usuarios registrados", 10, 10);
        pdf.addImage(imgData, "PNG", 10, 20, 190, 0);
        pdf.save(`${nombreArchivo}.pdf`);

        // Restaurar columna
        tabla.querySelectorAll("tr").forEach(fila => {
            if (fila.lastElementChild) {
                fila.lastElementChild.style.display = "";
            }
        });
    });
}

//------------------------------

function exportTablaExcel(nombreArchivo) {
    const tablaOriginal = document.querySelector("table");
    const tablaClonada = tablaOriginal.cloneNode(true);

    // Eliminar la última columna de cada fila (acciones)
    tablaClonada.querySelectorAll("tr").forEach(fila => {
        fila.lastElementChild?.remove();
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(tablaClonada);
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, `${nombreArchivo}.xlsx`);
}

//-------------------------------

function exportTablaImagen(nombreArchivo, formato = "png") {
    const tabla = document.querySelector("table");

    tabla.querySelectorAll("tr").forEach(fila => {
        if (fila.lastElementChild) {
            fila.lastElementChild.style.display = "none";
        }
    });

    html2canvas(tabla).then(canvas => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL(`image/${formato}`);
        link.download = `${nombreArchivo}.${formato}`;
        link.click();

        tabla.querySelectorAll("tr").forEach(fila => {
            if (fila.lastElementChild) {
                fila.lastElementChild.style.display = "";
            }
        });
    });
}
