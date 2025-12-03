// =================================================================================
// Sabor Bajo el Radar - Panel de Vendedor v2.8 (Versión Final Completa y Verificada)
// =================================================================================

// ========== VARIABLES GLOBALES ==========
let puestos = [], productos = [], ofertas = [], pedidos = [];
let modalPuesto, modalProducto, modalOferta;
let salesChartInstance, productsChartInstance;
let imagenPuestoTemporal = null;

// ========== FORMATEADOR DE MONEDA ==========
const formatCurrency = (value) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0
}).format(value || 0);

// ========== HELPER PARA LLAMADAS A LA API ==========
const getApiHeaders = (includeContentType = true) => {
    const token = document.querySelector('meta[name="_csrf"]').content;
    const headerName = document.querySelector('meta[name="_csrf_header"]').content;
    const headers = {[headerName]: token};
    if (includeContentType) headers['Content-Type'] = 'application/json';
    return headers;
};

const api = {
    get: (endpoint) => fetch(endpoint, {method: 'GET', headers: getApiHeaders(false)}),
    post: (endpoint, body) => fetch(endpoint, {method: 'POST', headers: getApiHeaders(), body: JSON.stringify(body)}),
    put: (endpoint, body) => fetch(endpoint, {method: 'PUT', headers: getApiHeaders(), body: JSON.stringify(body)}),
    delete: (endpoint) => fetch(endpoint, {method: 'DELETE', headers: getApiHeaders(false)})
};

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    modalPuesto = new bootstrap.Modal(document.getElementById('modalPuesto'));
    modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'));
    modalOferta = new bootstrap.Modal(document.getElementById('modalOferta'));

    // Asignar el escuchador de eventos al input de la imagen
    const imagenInput = document.getElementById('puestoImagenInput');
    if (imagenInput) {
        imagenInput.addEventListener('change', previewImagen);
    }

    cargarDatosIniciales();
    initNavigation();
});

async function cargarDatosIniciales() {
    showLoader();
    try {
        const [puestosRes, productosRes, ofertasRes] = await Promise.all([
            api.get('/api/negocios'), api.get('/api/productos'), api.get('/api/ofertas')
        ]);
        if (!puestosRes.ok || !productosRes.ok || !ofertasRes.ok) throw new Error('Error de conexión.');
        puestos = await puestosRes.json();
        productos = await productosRes.json();
        ofertas = await ofertasRes.json();
        if (pedidos.length === 0 && productos.length > 0) generarPedidoDemo(3);
        renderizarTodo();
    } catch (error) {
        console.error('Error al cargar datos:', error);
        showNotification('Error al conectar con el servidor.', 'error');
    } finally {
        hideLoader();
    }
}

function renderizarTodo() {
    actualizarDashboard();
    renderizarPedidos();
    renderizarPuestos();
    renderizarProductos();
    renderizarOfertas();
}

// ========== DASHBOARD Y PEDIDOS ==========
function actualizarDashboard() {
    const hoy = new Date().toISOString().slice(0, 10);
    const pedidosDeHoy = pedidos.filter(p => p.fecha.startsWith(hoy));
    const totalVentas = pedidosDeHoy.reduce((sum, p) => sum + p.total, 0);
    const totalPedidos = pedidosDeHoy.length;
    const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0;
    const pedidosPendientes = pedidos.filter(p => p.estado === 'Pendiente').length;
    document.getElementById('totalVentas').textContent = formatCurrency(totalVentas);
    document.getElementById('totalPedidos').textContent = totalPedidos;
    document.getElementById('ticketPromedio').textContent = formatCurrency(ticketPromedio);
    document.getElementById('pedidosPendientes').textContent = pedidosPendientes;
    crearGraficoVentas();
    crearGraficoProductos();
}

function crearGraficoVentas() {
    const ctx = document.getElementById('salesChart')?.getContext('2d');
    if (!ctx) return;
    const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    if (salesChartInstance) salesChartInstance.destroy();
    salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: "Ventas",
                data: labels.map(() => Math.random() * 200000 + 50000),
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                tension: 0.3
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, ticks: {callback: (value) => formatCurrency(value)}}},
            plugins: {tooltip: {callbacks: {label: (context) => formatCurrency(context.raw)}}}
        }
    });
}

function crearGraficoProductos() {
    const ctx = document.getElementById('productsChart')?.getContext('2d');
    if (!ctx) return;
    const topProductos = productos.slice(0, 5);
    if (productsChartInstance) productsChartInstance.destroy();
    productsChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: topProductos.length > 0 ? topProductos.map(p => p.nombre) : ['Sin productos'],
            datasets: [{
                data: topProductos.length > 0 ? topProductos.map(() => Math.random() * 50 + 10) : [1],
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b']
            }]
        },
        options: {maintainAspectRatio: false}
    });
}

function renderizarPedidos() {
    const container = document.getElementById('listaPedidos');
    if (pedidos.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info">No hay pedidos para mostrar. Genera uno de demostración.</div></div>`;
        return;
    }
    pedidos.sort((a, b) => (a.estado === 'Pendiente' && b.estado !== 'Pendiente') ? -1 : (a.estado !== 'Pendiente' && b.estado === 'Pendiente') ? 1 : new Date(b.fecha) - new Date(a.fecha));
    container.innerHTML = pedidos.map(pedido => `
        <div class="col-lg-6">
            <div class="order-card">
                <div class="order-card-header"><h5>Pedido #${pedido.id}</h5><span class="badge ${getStatusBadge(pedido.estado)}">${pedido.estado}</span></div>
                <p class="order-card-customer"><strong>Cliente:</strong> ${pedido.cliente}</p>
                <div class="order-card-products"><strong>Productos:</strong><ul>${pedido.productos.map(p => `<li>${p.cantidad}x ${p.nombre}</li>`).join('')}</ul></div>
                <p class="order-card-total">Total: ${formatCurrency(pedido.total)}</p>
                <div class="order-card-actions text-end">
                    ${pedido.estado === 'Pendiente' ? `<button class="btn btn-primary btn-sm" onclick="cambiarEstadoPedido('${pedido.id}', 'Preparando')">Aceptar y Preparar</button>` : ''}
                    ${pedido.estado === 'Preparando' ? `<button class="btn btn-success btn-sm" onclick="cambiarEstadoPedido('${pedido.id}', 'Listo para Recoger')">Marcar como Listo</button>` : ''}
                    ${pedido.estado !== 'Entregado' && pedido.estado !== 'Cancelado' ? `<button class="btn btn-danger btn-sm ms-2" onclick="cambiarEstadoPedido('${pedido.id}', 'Cancelado')">Cancelar</button>` : ''}
                </div>
            </div>
        </div>`).join('');
}

function cambiarEstadoPedido(pedidoId, nuevoEstado) {
    const pedido = pedidos.find(p => p.id == pedidoId);
    if (pedido) {
        pedido.estado = nuevoEstado;
        showNotification(`Pedido #${pedidoId} actualizado a "${nuevoEstado}".`, 'info');
        renderizarPedidos();
        actualizarDashboard();
    }
}

function getStatusBadge(estado) {
    return {
        'Pendiente': 'bg-warning text-dark',
        'Preparando': 'bg-primary',
        'Listo para Recoger': 'bg-success',
        'Entregado': 'bg-secondary',
        'Cancelado': 'bg-danger'
    }[estado] || 'bg-dark';
}

function generarPedidoDemo(cantidad = 1) {
    if (productos.length === 0) {
        showNotification('Crea al menos un producto para generar pedidos de demostración.', 'warning');
        return;
    }
    const clientesDemo = ['Ana García', 'Carlos Rodriguez', 'Luisa Martinez', 'Javier Gomez', 'Sofia Lopez'];
    for (let i = 0; i < cantidad; i++) {
        const productosPedido = [];
        let total = 0;
        const numProductos = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numProductos; j++) {
            const productoRandom = productos[Math.floor(Math.random() * productos.length)];
            const cantidadProducto = Math.floor(Math.random() * 2) + 1;
            productosPedido.push({nombre: productoRandom.nombre, cantidad: cantidadProducto});
            total += productoRandom.precio * cantidadProducto;
        }
        pedidos.push({
            id: String(Math.floor(Math.random() * 9000) + 1000),
            cliente: clientesDemo[Math.floor(Math.random() * clientesDemo.length)],
            productos: productosPedido,
            total,
            estado: 'Pendiente',
            fecha: new Date().toISOString()
        });
    }
    if (cantidad === 1) showNotification('Nuevo pedido de demostración generado.', 'success');
    renderizarTodo();
}

// ========== RENDERIZADO CRUD ==========
function renderizarPuestos() {
    const container = document.getElementById('listaPuestos');
    if (puestos.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info">Aún no has creado ningún puesto.</div></div>`;
        return;
    }
    container.innerHTML = puestos.map(puesto => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <img src="${puesto.imagenUrl || 'https://via.placeholder.com/400x300/e9ecef/6c757d?text=Sin+Imagen'}" class="card-img-top" alt="${puesto.nombreNegocio}" style="height: 180px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <div>
                        <h5 class="card-title">${puesto.nombreNegocio}</h5><h6 class="card-subtitle mb-2 text-muted">${puesto.tipoNegocio}</h6>
                        <p class="card-text small">${puesto.descripcionNegocio}</p>
                    </div>
                    <div class="mt-auto"><span class="badge bg-${puesto.estadoNegocio === 'activo' ? 'success' : 'secondary'}">${puesto.estadoNegocio}</span></div>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    <button class="btn btn-sm btn-outline-primary" onclick="mostrarModalPuesto(${puesto.id})">Editar</button>
                    <button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarPuesto(${puesto.id})">Eliminar</button>
                </div>
            </div>
        </div>`).join('');
}

function renderizarProductos() {
    const container = document.getElementById('listaProductos');
    document.getElementById('alertNoPuestosParaProductos').style.display = puestos.length === 0 ? 'block' : 'none';
    if (puestos.length === 0) {
        container.innerHTML = '';
        return;
    }
    if (productos.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info">No tienes productos registrados.</div></div>`;
        return;
    }
    container.innerHTML = productos.map(producto => {
        const negocioAsociado = puestos.find(p => p.id === producto.negocio.id);
        return `<div class="col-md-6 col-lg-4 mb-4"><div class="card h-100"><div class="card-body"><h5 class="card-title">${producto.nombre}</h5><h6 class="card-subtitle mb-2 text-muted">${negocioAsociado?.nombreNegocio || 'N/A'}</h6><p class="card-text"><strong>Precio:</strong> ${formatCurrency(producto.precio)}</p><p class="card-text"><strong>Stock:</strong> ${producto.stock} uds.</p></div><div class="card-footer"><button class="btn btn-sm btn-outline-primary" onclick="mostrarModalProducto(${producto.id})">Editar</button><button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarProducto(${producto.id})">Eliminar</button></div></div></div>`;
    }).join('');
}

function renderizarOfertas() {
    const container = document.getElementById('listaOfertas');
    document.getElementById('alertNoProductosParaOfertas').style.display = productos.length === 0 ? 'block' : 'none';
    if (productos.length === 0) {
        container.innerHTML = '';
        return;
    }
    if (ofertas.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info">No tienes ofertas activas.</div></div>`;
        return;
    }
    container.innerHTML = ofertas.map(oferta => `<div class="col-md-6 col-lg-4 mb-4"><div class="card h-100 border-primary"><div class="card-header bg-primary text-white">${oferta.titulo} - ${oferta.descuento}% OFF</div><div class="card-body"><h6 class="card-subtitle mb-2 text-muted">Producto: ${oferta.producto.nombre}</h6><p class="card-text">${oferta.descripcion || ''}</p><p class="card-text"><small class="text-muted">Válido del ${oferta.fechaInicio} al ${oferta.fechaExpiracion}</small></p></div><div class="card-footer"><button class="btn btn-sm btn-outline-primary" onclick="mostrarModalOferta(${oferta.id})">Editar</button><button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarOferta(${oferta.id})">Eliminar</button></div></div></div>`).join('');
}

// ========== LÓGICA DE MODALES (CRUD) ==========
function mostrarModalPuesto(id = null) {
    document.getElementById('formPuesto').reset();
    document.getElementById('puestoId').value = '';
    imagenPuestoTemporal = null;
    resetearVistaPrevia();
    document.getElementById('modalPuestoTitle').textContent = 'Nuevo Puesto';
    if (id) {
        const puesto = puestos.find(p => p.id === id);
        if (puesto) {
            document.getElementById('modalPuestoTitle').textContent = 'Editar Puesto';
            document.getElementById('puestoId').value = puesto.id;
            document.getElementById('puestoNombre').value = puesto.nombreNegocio;
            document.getElementById('puestoDescripcion').value = puesto.descripcionNegocio;
            document.getElementById('puestoUbicacion').value = puesto.ubicacionNegocio;
            document.getElementById('puestoEmail').value = puesto.emailNegocio;
            document.getElementById('puestoCategoria').value = puesto.tipoNegocio;
            document.getElementById('puestoEstado').value = puesto.estadoNegocio;
            document.getElementById('puestoLegalizado').checked = puesto.estaLegalizado === 'si';
            if (puesto.imagenUrl) {
                imagenPuestoTemporal = puesto.imagenUrl;
                document.getElementById('previewImagen').src = puesto.imagenUrl;
                document.getElementById('imageUploadArea').innerHTML = `<img src="${puesto.imagenUrl}" alt="Imagen actual">`;
            }
            actualizarVistaPrevia();
        }
    }
    modalPuesto.show();
}

async function guardarPuesto(event) {
    event.preventDefault();
    if (!document.getElementById('puestoLegalizado').checked) {
        return showNotification('Debes declarar que tu negocio cumple con las normativas.', 'warning');
    }
    if (!imagenPuestoTemporal) {
        return showNotification('Por favor, sube una imagen para tu puesto.', 'warning');
    }
    showLoader();
    const id = document.getElementById('puestoId').value;
    const data = {
        nombreNegocio: document.getElementById('puestoNombre').value,
        descripcionNegocio: document.getElementById('puestoDescripcion').value,
        ubicacionNegocio: document.getElementById('puestoUbicacion').value,
        emailNegocio: document.getElementById('puestoEmail').value,
        tipoNegocio: document.getElementById('puestoCategoria').value,
        estadoNegocio: document.getElementById('puestoEstado').value,
        estaLegalizado: document.getElementById('puestoLegalizado').checked ? 'si' : 'no',
        imagenUrl: imagenPuestoTemporal
    };
    try {
        const response = await (id ? api.put(`/api/negocios/${id}`, data) : api.post('/api/negocios', data));
        if (!response.ok) throw new Error(`Error ${response.status}`);
        showNotification(`Puesto ${id ? 'actualizado' : 'creado'} con éxito.`, 'success');
        modalPuesto.hide();
        await cargarDatosIniciales();
    } catch (error) {
        showNotification('No se pudo guardar el puesto.', 'error');
    } finally {
        hideLoader();
    }
}

async function eliminarPuesto(id) {
    if (!confirm('¿Seguro que quieres eliminar este puesto?')) return;
    showLoader();
    try {
        const response = await api.delete(`/api/negocios/${id}`);
        if (!response.ok) throw new Error();
        showNotification('Puesto eliminado con éxito.', 'success');
        await cargarDatosIniciales();
    } catch (error) {
        showNotification('No se pudo eliminar el puesto.', 'error');
    } finally {
        hideLoader();
    }
}

function mostrarModalProducto(id = null) {
    document.getElementById('formProducto').reset();
    document.getElementById('productoId').value = '';
    const selectPuesto = document.getElementById('productoPuestoId');
    selectPuesto.innerHTML = puestos.map(p => `<option value="${p.id}">${p.nombreNegocio}</option>`).join('');
    document.getElementById('modalProductoTitle').textContent = 'Nuevo Producto';
    if (id) {
        const producto = productos.find(p => p.id === id);
        if (producto) {
            document.getElementById('modalProductoTitle').textContent = 'Editar Producto';
            document.getElementById('productoId').value = producto.id;
            selectPuesto.value = producto.negocio.id;
            document.getElementById('productoNombre').value = producto.nombre;
            document.getElementById('productoDescripcion').value = producto.descripcion;
            document.getElementById('productoPrecio').value = producto.precio;
            document.getElementById('productoStock').value = producto.stock;
            document.getElementById('productoCategoria').value = producto.categoria;
        }
    }
    modalProducto.show();
}

async function guardarProducto(event) {
    event.preventDefault();
    showLoader();
    const id = document.getElementById('productoId').value;
    const data = {
        negocioId: document.getElementById('productoPuestoId').value,
        nombre: document.getElementById('productoNombre').value,
        descripcion: document.getElementById('productoDescripcion').value,
        precio: parseFloat(document.getElementById('productoPrecio').value),
        stock: parseInt(document.getElementById('productoStock').value),
        categoria: document.getElementById('productoCategoria').value,
    };
    try {
        const response = await (id ? api.put(`/api/productos/${id}`, data) : api.post('/api/productos', data));
        if (!response.ok) throw new Error();
        showNotification(`Producto ${id ? 'actualizado' : 'creado'} con éxito.`, 'success');
        modalProducto.hide();
        await cargarDatosIniciales();
    } catch (error) {
        showNotification('No se pudo guardar el producto.', 'error');
    } finally {
        hideLoader();
    }
}

async function eliminarProducto(id) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    showLoader();
    try {
        const response = await api.delete(`/api/productos/${id}`);
        if (!response.ok) throw new Error();
        showNotification('Producto eliminado con éxito.', 'success');
        await cargarDatosIniciales();
    } catch (error) {
        showNotification('No se pudo eliminar el producto.', 'error');
    } finally {
        hideLoader();
    }
}

function mostrarModalOferta(id = null) {
    document.getElementById('formOferta').reset();
    document.getElementById('ofertaId').value = '';
    const selectProducto = document.getElementById('ofertaProductoId');
    selectProducto.innerHTML = productos.map(p => `<option value="${p.id}">${p.nombre} (${puestos.find(n => n.id === p.negocio.id)?.nombreNegocio})</option>`).join('');
    document.getElementById('modalOfertaTitle').textContent = 'Nueva Oferta';
    if (id) {
        const oferta = ofertas.find(o => o.id === id);
        if (oferta) {
            document.getElementById('modalOfertaTitle').textContent = 'Editar Oferta';
            document.getElementById('ofertaId').value = oferta.id;
            selectProducto.value = oferta.producto.id;
            document.getElementById('ofertaTitulo').value = oferta.titulo;
            document.getElementById('ofertaDescripcion').value = oferta.descripcion;
            document.getElementById('ofertaDescuento').value = oferta.descuento;
            document.getElementById('ofertaFechaInicio').value = oferta.fechaInicio;
            document.getElementById('ofertaFechaFin').value = oferta.fechaExpiracion;
        }
    }
    modalOferta.show();
}

async function guardarOferta(event) {
    event.preventDefault();
    showLoader();
    const id = document.getElementById('ofertaId').value;
    const data = {
        productoId: document.getElementById('ofertaProductoId').value,
        titulo: document.getElementById('ofertaTitulo').value,
        descripcion: document.getElementById('ofertaDescripcion').value,
        descuento: parseFloat(document.getElementById('ofertaDescuento').value),
        fechaInicio: document.getElementById('ofertaFechaInicio').value,
        fechaExpiracion: document.getElementById('ofertaFechaFin').value,
    };
    try {
        const response = await (id ? api.put(`/api/ofertas/${id}`, data) : api.post('/api/ofertas', data));
        if (!response.ok) throw new Error();
        showNotification(`Oferta ${id ? 'actualizada' : 'creada'} con éxito.`, 'success');
        modalOferta.hide();
        await cargarDatosIniciales();
    } catch (error) {
        showNotification('No se pudo guardar la oferta.', 'error');
    } finally {
        hideLoader();
    }
}

async function eliminarOferta(id) {
    if (!confirm('¿Seguro que quieres eliminar esta oferta?')) return;
    showLoader();
    try {
        const response = await api.delete(`/api/ofertas/${id}`);
        if (!response.ok) throw new Error();
        showNotification('Oferta eliminada con éxito.', 'success');
        await cargarDatosIniciales();
    } catch (error) {
        showNotification('No se pudo eliminar la oferta.', 'error');
    } finally {
        hideLoader();
    }
}

// ========== VISTA PREVIA DEL PUESTO ==========
function previewImagen(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        imagenPuestoTemporal = e.target.result;
        document.getElementById('previewImagen').src = e.target.result;
        const uploadArea = document.getElementById('imageUploadArea');
        uploadArea.innerHTML = `<img src="${e.target.result}" alt="Previsualización">`;
    };
    reader.readAsDataURL(file);
}

function actualizarVistaPrevia() {
    document.getElementById('previewNombre').textContent = document.getElementById('puestoNombre').value || 'Nombre de tu Puesto';
    document.getElementById('previewCategoriaBadge').textContent = document.getElementById('puestoCategoria').value;
    document.getElementById('previewUbicacion').innerHTML = `<i class="fas fa-map-marker-alt me-1"></i> ${document.getElementById('puestoUbicacion').value || 'Tu ubicación'}`;
    document.getElementById('previewDescripcion').textContent = document.getElementById('puestoDescripcion').value || 'Aquí aparecerá la descripción.';
}

function resetearVistaPrevia() {
    document.getElementById('previewImagen').src = 'https://via.placeholder.com/400x300/e9ecef/6c757d?text=Sube+una+imagen';
    const uploadArea = document.getElementById('imageUploadArea');
    uploadArea.innerHTML = `
        <div id="imageUploadContent" class="text-center">
            <i class="fas fa-cloud-upload-alt fa-3x text-muted mb-2"></i>
            <p class="text-muted mb-0">Haz clic para subir una imagen</p>
            <small class="text-muted">Recomendado: 800x600px</small>
        </div>`;
    actualizarVistaPrevia();
}

// ========== UTILIDADES ==========
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

function showNotification(message, type = 'success') {
    const colors = {success: 'bg-success', error: 'bg-danger', info: 'bg-info', warning: 'bg-warning'};
    const toastEl = document.createElement('div');
    toastEl.className = `toast show align-items-center text-white ${colors[type] || 'bg-dark'} border-0 position-fixed top-0 end-0 m-3`;
    toastEl.style.zIndex = '1100';
    toastEl.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
    document.body.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, {delay: 4000});
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

function initNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.content-section');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            sidebarLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            const activeSection = document.getElementById(sectionId);
            if (activeSection) activeSection.classList.add('active');
        });
    });
}