// =================================================================================
// Sabor Bajo el Radar - Panel de Vendedor v5.0 (FINAL COMPLETO)
// =================================================================================

// ========== VARIABLES GLOBALES ==========
let puestos = [], productos = [], ofertas = [], pedidos = [];
let perfilVendedor = null;
let modalPuesto, modalProducto, modalOferta, modalEliminarCuenta;
let salesChartInstance, productsChartInstance;
let imagenPuestoTemporal = null;
let imagenProductoTemporal = null;
let dashboardFiltroPuestoId = 'todos';

// ========== FORMATEADOR DE MONEDA Y API HELPER ==========
const formatCurrency = (value) => new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
}).format(value || 0);

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
    // Inicializar Modales
    modalPuesto = new bootstrap.Modal(document.getElementById('modalPuesto'));
    modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'));
    modalOferta = new bootstrap.Modal(document.getElementById('modalOferta'));
    modalEliminarCuenta = new bootstrap.Modal(document.getElementById('modalConfirmarEliminacion'));

    // Listeners de Imágenes
    const imagenInput = document.getElementById('puestoImagenInput');
    if (imagenInput) imagenInput.addEventListener('change', previewImagen);

    const imagenProdInput = document.getElementById('productoImagenInput');
    if (imagenProdInput) imagenProdInput.addEventListener('change', previewImagenProducto);

    // Cargar datos y configurar listeners
    cargarDatosIniciales();
    initNavigation();
    initPerfilEventListeners();
});

async function cargarDatosIniciales() {
    showLoader();
    try {
        const [puestosRes, productosRes, ofertasRes, perfilRes, pedidosRes] = await Promise.all([
            api.get('/api/negocios'),
            api.get('/api/productos'),
            api.get('/api/ofertas'),
            api.get('/api/perfil/vendedor'),
            api.get('/api/vendedor/pedidos')
        ]);

        if (!puestosRes.ok || !productosRes.ok || !ofertasRes.ok || !perfilRes.ok) {
            throw new Error('Error de conexión al cargar datos iniciales.');
        }

        puestos = await puestosRes.json();
        productos = await productosRes.json();
        ofertas = await ofertasRes.json();
        perfilVendedor = await perfilRes.json();

        // Manejo seguro de pedidos
        if (pedidosRes.ok) {
            pedidos = await pedidosRes.json();
        } else {
            pedidos = [];
            console.warn("No se pudieron cargar los pedidos");
        }

        // Si no hay pedidos y hay productos, generar demo (Opcional)
        // if (pedidos.length === 0 && productos.length > 0) generarPedidoDemo(1);

        renderizarTodo();
    } catch (error) {
        console.error('Error al cargar datos:', error);
        showNotification(error.message, 'error');
    } finally {
        hideLoader();
    }
}

function renderizarTodo() {
    renderizarPerfil();
    setupDashboardFiltro();
    actualizarDashboard();
    renderizarPedidos();
    renderizarPuestos();
    renderizarProductos();
    renderizarOfertas();
}

// ===============================================
//          DASHBOARD Y GRÁFICOS
// ===============================================
function setupDashboardFiltro() {
    const filtroContainer = document.getElementById('dashboardFiltroContainer');
    const filtroSelect = document.getElementById('dashboardPuestoFiltro');
    if (puestos.length > 1) {
        filtroContainer.style.display = 'flex';
        filtroSelect.innerHTML = `<option value="todos">Todos los Puestos</option>${puestos.map(p => `<option value="${p.id}">${p.nombreNegocio}</option>`).join('')}`;
        filtroSelect.value = dashboardFiltroPuestoId;
        filtroSelect.addEventListener('change', (e) => {
            dashboardFiltroPuestoId = e.target.value;
            actualizarDashboard();
        });
    } else {
        filtroContainer.style.display = 'none';
    }
}

function actualizarDashboard() {
    // Obtenemos los pedidos (filtrados por puesto si aplica)
    const pedidosFiltrados = dashboardFiltroPuestoId === 'todos' ? pedidos : pedidos.filter(p => String(p.puestoId) === String(dashboardFiltroPuestoId));

    const hoy = new Date().toISOString().slice(0, 10);

    // CORRECCIÓN: Filtramos que sea de HOY y que NO esté cancelado
    const pedidosDeHoy = pedidosFiltrados.filter(p =>
        p.date &&
        p.date.startsWith(hoy) &&
        p.status.toLowerCase() !== 'cancelado' // <--- ESTA ES LA CLAVE
    );

    // Calculamos totales solo con los pedidos válidos
    const totalVentas = pedidosDeHoy.reduce((sum, p) => sum + p.total, 0);
    const totalPedidos = pedidosDeHoy.length;

    // Actualizamos el DOM
    document.getElementById('totalVentas').textContent = formatCurrency(totalVentas);
    document.getElementById('totalPedidos').textContent = totalPedidos;
    document.getElementById('ticketPromedio').textContent = formatCurrency(totalPedidos > 0 ? totalVentas / totalPedidos : 0);

    // Los pendientes se cuentan aparte (esos sí se muestran para que el vendedor actúe)
    document.getElementById('pedidosPendientes').textContent = pedidosFiltrados.filter(p => p.status === 'pendiente').length;

    // Generamos los gráficos pasando la lista completa (el filtro de cancelados se hace dentro de cada función de gráfico)
    crearGraficoVentas(pedidosFiltrados);
    crearGraficoProductos(pedidosFiltrados);
}

function crearGraficoVentas(pedidosData) {
    const ctx = document.getElementById('salesChart')?.getContext('2d');
    if (!ctx) return;

    const ventasPorDia = Array(7).fill(0);

    pedidosData.forEach(p => {
        // CORRECCIÓN: Solo sumamos si NO está cancelado
        if (p.date && p.status.toLowerCase() !== 'cancelado') {
            ventasPorDia[new Date(p.date).getDay()] += p.total;
        }
    });

    if (salesChartInstance) salesChartInstance.destroy();
    salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            datasets: [{
                label: "Ventas Reales",
                data: ventasPorDia,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                tension: 0.3
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, ticks: {callback: (v) => formatCurrency(v)}}},
            plugins: {tooltip: {callbacks: {label: (c) => formatCurrency(c.raw)}}}
        }
    });
}

function crearGraficoProductos(pedidosData) {
    const ctx = document.getElementById('productsChart')?.getContext('2d');
    if (!ctx) return;

    const conteo = {};
    pedidosData.forEach(p => {
        // CORRECCIÓN: Solo contamos productos si el pedido NO está cancelado
        if (p.products && p.status.toLowerCase() !== 'cancelado') {
            p.products.forEach(item => {
                conteo[item.name] = (conteo[item.name] || 0) + item.quantity;
            });
        }
    });

    const sorted = Object.entries(conteo).sort((a, b) => b[1] - a[1]).slice(0, 5);

    if (productsChartInstance) productsChartInstance.destroy();
    productsChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: sorted.length > 0 ? sorted.map(p => p[0]) : ['Sin ventas'],
            datasets: [{
                data: sorted.length > 0 ? sorted.map(p => p[1]) : [1],
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b']
            }]
        },
        options: {maintainAspectRatio: false}
    });
}

// ===============================================
//          LÓGICA DE PEDIDOS (ACTUALIZADA)
// ===============================================
function renderizarPedidos() {
    const container = document.getElementById('listaPedidos');
    if (!pedidos || pedidos.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info">No tienes pedidos pendientes.</div></div>`;
        return;
    }

    // Ordenar: Pendientes primero
    pedidos.sort((a, b) => {
        const estadoA = a.status.toLowerCase();
        const estadoB = b.status.toLowerCase();
        if (estadoA === 'pendiente' && estadoB !== 'pendiente') return -1;
        return 0;
    });

    container.innerHTML = pedidos.map(p => {
        const status = p.status.toLowerCase();

        // Botones de acción rápida
        let botones = '';
        if (status === 'pendiente') {
            botones = `
                <button class="btn btn-primary btn-sm" onclick="cambiarEstadoPedido(${p.id}, 'preparando')">
                    <i class="fas fa-fire me-1"></i> Aceptar
                </button>
                <button class="btn btn-danger btn-sm ms-1" onclick="cambiarEstadoPedido(${p.id}, 'cancelado')">
                    <i class="fas fa-times"></i>
                </button>`;
        } else if (status === 'preparando') {
            botones = `
                <button class="btn btn-success btn-sm" onclick="cambiarEstadoPedido(${p.id}, 'en_camino')">
                    <i class="fas fa-motorcycle me-1"></i> Enviar
                </button>`;
        }

        const notaHtml = p.note ?
            `<div class="alert alert-warning p-2 mt-2 mb-0 small">
                <i class="fas fa-sticky-note me-1"></i> <strong>Nota:</strong> ${p.note}
             </div>` : '';

        // --- CAMBIO EN LA TARJETA ---
        return `
        <div class="col-lg-6 mb-4">
            <div class="order-card h-100 shadow-sm" style="position: relative;">
                
                <!-- Encabezado -->
                <div class="order-card-header d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                    <div>
                        <h5 class="mb-0 text-primary fw-bold" style="font-size: 1.1rem;">${p.visualId || 'ORD-' + p.id}</h5>
                        <small class="text-muted" style="font-size: 0.8rem;">${p.date ? new Date(p.date).toLocaleString() : ''}</small>
                    </div>
                    <span class="badge ${getStatusBadge(status)}">${p.status}</span>
                </div>
                
                <!-- Info Cliente (Nombre y Dirección) -->
                <div class="mb-2 p-2 bg-light rounded">
                    <div class="d-flex align-items-center mb-1">
                        <i class="fas fa-user me-2 text-secondary"></i> 
                        <strong class="text-dark">${p.clientName || 'Cliente'}</strong>
                    </div>
                    <div class="d-flex align-items-start">
                        <i class="fas fa-map-marker-alt me-2 text-danger mt-1"></i> 
                        <span class="text-muted small lh-sm">${p.deliveryAddress || 'Sin dirección'}</span>
                    </div>
                </div>
                
                <!-- Lista de productos (Resumen corto) -->
                <div class="order-card-products mb-2">
                    <ul class="mb-0 ps-3 small">
                        ${p.products.slice(0, 3).map(item => `<li><strong>${item.quantity}x</strong> ${item.name}</li>`).join('')}
                        ${p.products.length > 3 ? `<li class="text-muted fst-italic">+${p.products.length - 3} más...</li>` : ''}
                    </ul>
                </div>
                
                ${notaHtml}

                <!-- Pie de tarjeta -->
                <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                    <span class="fs-5 fw-bold text-dark">${formatCurrency(p.total)}</span>
                    
                    <div class="d-flex gap-2">
                        <!-- Botón Ver Detalles -->
                        <button class="btn btn-outline-secondary btn-sm" onclick="verDetallePedido(${p.id})">
                            <i class="fas fa-eye"></i> Detalles
                        </button>
                        <!-- Botones de acción -->
                        ${botones}
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// NUEVA FUNCIÓN: Ver detalles en Modal
function verDetallePedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;

    document.getElementById('detalleModalLabel').textContent = `${pedido.visualId} - Detalles`;

    // Llenar info cliente
    document.getElementById('detClienteNombre').textContent = pedido.clientName;
    document.getElementById('detClienteTelefono').textContent = pedido.clientPhone || 'No registrado';
    document.getElementById('detClienteDireccion').textContent = pedido.deliveryAddress;

    // Llenar info pago (Formatear si es efectivo o tarjeta)
    let metodoPago = pedido.paymentMethod || 'Efectivo';
    if (metodoPago !== 'EFECTIVO' && metodoPago.length > 10) metodoPago = 'Tarjeta (Online)';
    document.getElementById('detMetodoPago').innerHTML = `<span class="badge bg-success">${metodoPago}</span>`;

    // Llenar productos
    const listaProd = document.getElementById('detListaProductos');
    listaProd.innerHTML = pedido.products.map(p => `
        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
            <div>
                <span class="fw-bold">${p.quantity}x</span> ${p.name}
            </div>
            <span>${formatCurrency(p.price || 0)}</span> <!-- Nota: asegúrate que el backend envíe el precio unitario en 'products' -->
        </li>
    `).join('');

    // Total
    document.getElementById('detTotal').textContent = formatCurrency(pedido.total);

    const modal = new bootstrap.Modal(document.getElementById('modalDetallePedidoVendedor'));
    modal.show();
}

async function cambiarEstadoPedido(pedidoId, nuevoEstado) {
    if (nuevoEstado === 'cancelado' && !confirm('¿Estás seguro de rechazar este pedido?')) return;

    showLoader();
    try {
        const response = await fetch(`/api/vendedor/pedidos/${pedidoId}/estado`, {
            method: 'PUT',
            headers: getApiHeaders(),
            body: JSON.stringify({estado: nuevoEstado})
        });

        if (!response.ok) throw new Error('Error al actualizar estado');

        showNotification('Estado del pedido actualizado.', 'success');

        // Recargar solo pedidos
        const pedidosRes = await api.get('/api/vendedor/pedidos');
        pedidos = await pedidosRes.json();
        renderizarPedidos();
        actualizarDashboard();

    } catch (error) {
        console.error(error);
        showNotification('No se pudo cambiar el estado.', 'error');
    } finally {
        hideLoader();
    }
}

function getStatusBadge(estado) {
    const map = {
        'pendiente': 'bg-warning text-dark',
        'preparando': 'bg-info text-dark',
        'en_camino': 'bg-primary',
        'entregado': 'bg-success',
        'cancelado': 'bg-danger'
    };
    return map[estado] || 'bg-secondary';
}

function generarPedidoDemo(cantidad = 1) {
    if (productos.length === 0 || puestos.length === 0) return;
    const clientes = ['Ana García', 'Carlos Rodriguez', 'Luisa Martinez'];
    for (let i = 0; i < cantidad; i++) {
        const puesto = puestos[Math.floor(Math.random() * puestos.length)];
        const prodsPuesto = productos.filter(p => p.negocio.id === puesto.id);
        if (prodsPuesto.length === 0) continue;
        const prod = prodsPuesto[Math.floor(Math.random() * prodsPuesto.length)];
        pedidos.push({
            id: String(Math.floor(Math.random() * 9000) + 1000),
            visualId: 'DEMO-' + Math.floor(Math.random() * 1000),
            puestoId: puesto.id,
            clientName: clientes[Math.floor(Math.random() * clientes.length)],
            products: [{name: prod.nombre, quantity: 1}],
            total: prod.precio,
            status: 'pendiente',
            date: new Date().toISOString()
        });
    }
    renderizarTodo();
}


// ===============================================
//          PUESTOS Y PRODUCTOS
// ===============================================
function renderizarPuestos() {
    const container = document.getElementById('listaPuestos');
    if (puestos.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info">Aún no has creado ningún puesto.</div></div>`;
        return;
    }
    container.innerHTML = puestos.map(puesto => {
        let statusBadge;
        switch (puesto.estado) {
            case 'aprobado':
                statusBadge = `<span class="badge bg-success">Aprobado</span>`;
                break;
            case 'rechazado':
                statusBadge = `<span class="badge bg-danger">Rechazado</span>`;
                break;
            default:
                statusBadge = `<span class="badge bg-warning text-dark">Pendiente</span>`;
        }

        let visibilidadBadge = '';
        if (puesto.estado === 'aprobado') {
            visibilidadBadge = (puesto.estadoNegocio === 'activo')
                ? `<span class="badge bg-primary ms-1">Visible</span>`
                : `<span class="badge bg-secondary ms-1">Oculto</span>`;
        }

        const rejectionReason = puesto.estado === 'rechazado' && puesto.motivoRechazo
            ? `<div class="alert alert-danger p-2 mt-2 small"><strong>Motivo:</strong> ${puesto.motivoRechazo}</div>` : '';

        return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <img src="${puesto.imagenUrl || 'https://via.placeholder.com/400x300/e9ecef/6c757d?text=Sin+Imagen'}" class="card-img-top" alt="${puesto.nombreNegocio}" style="height: 180px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <div>
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0 text-truncate" style="max-width: 150px;">${puesto.nombreNegocio}</h5>
                            <div>${statusBadge}${visibilidadBadge}</div>
                        </div>
                        <h6 class="card-subtitle mt-1 mb-2 text-muted">${puesto.tipoNegocio}</h6>
                        ${rejectionReason}
                    </div>
                    <div class="mt-auto pt-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="mostrarModalPuesto(${puesto.id})">Editar</button>
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarPuesto(${puesto.id})">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderizarProductos() {
    const container = document.getElementById('listaProductos');

    // Validar visualización de alerta si no hay puestos
    const alerta = document.getElementById('alertNoPuestosParaProductos');
    if (alerta) alerta.style.display = puestos.length === 0 ? 'block' : 'none';

    if (puestos.length === 0) {
        container.innerHTML = '';
        return;
    }

    if (productos.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info">No tienes productos registrados.</div></div>`;
        return;
    }

    container.innerHTML = productos.map(p => {
        // Manejo de imagen (Real o Placeholder)
        let imagenSrc = p.imagenUrl;
        if (!imagenSrc || imagenSrc.trim() === '') {
            imagenSrc = 'https://via.placeholder.com/400x300/e9ecef/6c757d?text=Sin+Imagen';
        }

        return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm">
                <!-- AQUI AGREGAMOS LA IMAGEN -->
                <div style="height: 180px; overflow: hidden;">
                    <img src="${imagenSrc}" class="card-img-top" alt="${p.nombre}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold mb-0">${p.nombre}</h5>
                        <span class="badge bg-secondary">${p.categoria}</span>
                    </div>
                    
                    <h6 class="card-subtitle mb-3 text-muted">
                        <i class="fas fa-store me-1"></i> ${puestos.find(n => n.id === p.negocio.id)?.nombreNegocio || 'N/A'}
                    </h6>
                    
                    <p class="card-text text-truncate" title="${p.descripcion}">${p.descripcion}</p>
                    
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="fs-5 fw-bold text-primary">${formatCurrency(p.precio)}</span>
                        <span class="badge bg-light text-dark border">Stock: ${p.stock}</span>
                    </div>
                </div>
                
                <div class="card-footer bg-white border-top-0 d-flex justify-content-end gap-2 pb-3">
                    <button class="btn btn-sm btn-outline-primary" onclick="mostrarModalProducto(${p.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${p.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderizarOfertas() {
    const container = document.getElementById('listaOfertas');
    const alerta = document.getElementById('alertNoProductosParaOfertas');
    if (alerta) alerta.style.display = productos.length === 0 ? 'block' : 'none';

    if (productos.length === 0) {
        container.innerHTML = '';
        return;
    }

    if (ofertas.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info">No tienes combos activos.</div></div>`;
        return;
    }

    container.innerHTML = ofertas.map(o => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 border-success">
                <div class="card-header bg-success text-white d-flex justify-content-between">
                    <span><i class="fas fa-tags me-1"></i> Combo</span>
                    <strong>${formatCurrency(o.precioOferta)}</strong>
                </div>
                <div class="card-body">
                    <h5 class="card-title fw-bold">${o.titulo}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Base: ${o.producto.nombre}</h6>
                    <p class="card-text small fst-italic">"${o.descripcion || 'Sin descripción'}"</p>
                    <p class="card-text mb-0"><small class="text-muted"><i class="far fa-calendar-alt"></i> Hasta: ${o.fechaExpiracion}</small></p>
                </div>
                <div class="card-footer bg-transparent border-top-0 text-end">
                    <button class="btn btn-sm btn-outline-primary" onclick="mostrarModalOferta(${o.id})">Editar</button>
                    <button class="btn btn-sm btn-outline-danger ms-1" onclick="eliminarOferta(${o.id})">Eliminar</button>
                </div>
            </div>
        </div>`).join('');
}

// Lógica de Modales (Mostrar, Guardar, Eliminar)
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

        modalPuesto.hide();
        await cargarDatosIniciales();

        if (id) {
            showNotification(`Puesto actualizado con éxito.`, 'success');
        } else {
            Swal.fire({
                title: '¡Puesto Creado!',
                text: 'Tu puesto ha sido registrado y ahora está pendiente de aprobación por un administrador.',
                icon: 'success',
                confirmButtonText: 'Entendido'
            });
        }
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
        const res = await api.delete(`/api/negocios/${id}`);
        if (!res.ok) throw new Error();
        showNotification('Puesto eliminado con éxito.', 'success');
        await cargarDatosIniciales();
    } catch (e) {
        showNotification('No se pudo eliminar el puesto.', 'error');
    } finally {
        hideLoader();
    }
}

function mostrarModalProducto(id = null) {
    document.getElementById('formProducto').reset();
    document.getElementById('productoId').value = '';

    const selectPuestos = document.getElementById('productoPuestoId');
    selectPuestos.innerHTML = puestos.map(p => `<option value="${p.id}">${p.nombreNegocio}</option>`).join('');

    if (puestos.length === 0) document.getElementById('msgSinPuestos').style.display = 'block';
    else document.getElementById('msgSinPuestos').style.display = 'none';

    imagenProductoTemporal = null;
    document.getElementById('previewImagenProducto').style.display = 'none';
    document.getElementById('previewImagenProducto').src = '';
    document.getElementById('imageUploadContentProducto').style.display = 'block';

    document.getElementById('modalProductoTitle').textContent = 'Nuevo Producto';

    if (id) {
        const p = productos.find(p => p.id === id);
        if (p) {
            document.getElementById('modalProductoTitle').textContent = 'Editar Producto';
            document.getElementById('productoId').value = p.id;
            if (p.negocio) document.getElementById('productoPuestoId').value = p.negocio.id;
            document.getElementById('productoNombre').value = p.nombre;
            document.getElementById('productoDescripcion').value = p.descripcion;
            document.getElementById('productoPrecio').value = p.precio;
            document.getElementById('productoStock').value = p.stock;
            document.getElementById('productoCategoria').value = p.categoria;

            if (p.imagenUrl) {
                imagenProductoTemporal = p.imagenUrl;
                const imgPreview = document.getElementById('previewImagenProducto');
                imgPreview.src = p.imagenUrl;
                imgPreview.style.display = 'block';
                document.getElementById('imageUploadContentProducto').style.display = 'none';
            }
        }
    }
    modalProducto.show();
}

function previewImagenProducto(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        showNotification('La imagen es muy pesada (Máx 2MB)', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        imagenProductoTemporal = e.target.result;
        const imgPreview = document.getElementById('previewImagenProducto');
        imgPreview.src = e.target.result;
        imgPreview.style.display = 'block';
        document.getElementById('imageUploadContentProducto').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

async function guardarProducto(event) {
    event.preventDefault();
    const puestoId = document.getElementById('productoPuestoId').value;
    if (!puestoId) return showNotification('Debes tener un puesto creado para agregar productos.', 'error');

    showLoader();
    const id = document.getElementById('productoId').value;
    const data = {
        negocioId: puestoId,
        nombre: document.getElementById('productoNombre').value,
        descripcion: document.getElementById('productoDescripcion').value,
        precio: parseFloat(document.getElementById('productoPrecio').value),
        stock: parseInt(document.getElementById('productoStock').value),
        categoria: document.getElementById('productoCategoria').value,
        imagenUrl: imagenProductoTemporal
    };

    try {
        const url = id ? `/api/productos/${id}` : '/api/productos';
        const method = id ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: getApiHeaders(),
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        showNotification(`Producto ${id ? 'actualizado' : 'creado'} con éxito.`, 'success');
        modalProducto.hide();
        await cargarDatosIniciales();

    } catch (e) {
        console.error(e);
        showNotification('Error al guardar producto', 'error');
    } finally {
        hideLoader();
    }
}

async function eliminarProducto(id) {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    showLoader();
    try {
        const res = await api.delete(`/api/productos/${id}`);
        if (!res.ok) throw new Error();
        showNotification('Producto eliminado con éxito.', 'success');
        await cargarDatosIniciales();
    } catch (e) {
        showNotification('No se pudo eliminar el producto.', 'error');
    } finally {
        hideLoader();
    }
}

function mostrarModalOferta(id = null) {
    document.getElementById('formOferta').reset();
    document.getElementById('ofertaId').value = '';

    // Llenar select con el precio en un atributo data-precio para cálculos
    const select = document.getElementById('ofertaProductoId');
    select.innerHTML = `<option value="" data-precio="0">Selecciona...</option>` +
        productos.map(p => `<option value="${p.id}" data-precio="${p.precio}">${p.nombre} (${formatCurrency(p.precio)})</option>`).join('');

    document.getElementById('modalOfertaTitle').textContent = 'Nuevo Combo';
    document.getElementById('msgAhorro').style.display = 'none';

    if (id) {
        const o = ofertas.find(o => o.id === id);
        if (o) {
            document.getElementById('modalOfertaTitle').textContent = 'Editar Combo';
            document.getElementById('ofertaId').value = o.id;
            select.value = o.producto.id;
            document.getElementById('ofertaTitulo').value = o.titulo;
            document.getElementById('ofertaDescripcion').value = o.descripcion;
            document.getElementById('ofertaPrecio').value = o.precioOferta; // Nuevo campo
            document.getElementById('ofertaFechaInicio').value = o.fechaInicio;
            document.getElementById('ofertaFechaFin').value = o.fechaExpiracion;

            calcularAhorroCombo(); // Actualizar visualización de precios
        }
    }
    modalOferta.show();
}

async function guardarOferta(event) {
    event.preventDefault();

    // Validar que el precio oferta sea menor al original (Opcional, pero recomendado)
    const precioOriginal = parseFloat(document.getElementById('ofertaPrecioOriginal').value.replace(/[$.]/g, '')) || 0;
    const precioOferta = parseFloat(document.getElementById('ofertaPrecio').value);

    /* Si quieres permitir combos más caros (ej: agregas gaseosa), borra este if
    if (precioOferta >= precioOriginal && precioOriginal > 0) {
       if(!confirm("El precio del combo es mayor o igual al producto solo. ¿Continuar?")) return;
    }
    */

    showLoader();
    const id = document.getElementById('ofertaId').value;
    const data = {
        productoId: document.getElementById('ofertaProductoId').value,
        titulo: document.getElementById('ofertaTitulo').value,
        descripcion: document.getElementById('ofertaDescripcion').value,
        precioOferta: precioOferta, // Campo cambiado
        fechaInicio: document.getElementById('ofertaFechaInicio').value,
        fechaExpiracion: document.getElementById('ofertaFechaFin').value,
    };
    try {
        const res = await (id ? api.put(`/api/ofertas/${id}`, data) : api.post('/api/ofertas', data));
        if (!res.ok) throw new Error();
        showNotification(`Combo ${id ? 'actualizado' : 'creado'} con éxito.`, 'success');
        modalOferta.hide();
        await cargarDatosIniciales();
    } catch (e) {
        showNotification('No se pudo guardar el combo.', 'error');
    } finally {
        hideLoader();
    }
}

async function eliminarOferta(id) {
    if (!confirm('¿Seguro que quieres eliminar esta oferta?')) return;
    showLoader();
    try {
        const res = await api.delete(`/api/ofertas/${id}`);
        if (!res.ok) throw new Error();
        showNotification('Oferta eliminada con éxito.', 'success');
        await cargarDatosIniciales();
    } catch (e) {
        showNotification('No se pudo eliminar la oferta.', 'error');
    } finally {
        hideLoader();
    }
}

// ===============================================
//          VISTA PREVIA Y UTILIDADES
// ===============================================
function previewImagen(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        imagenPuestoTemporal = e.target.result;
        document.getElementById('previewImagen').src = e.target.result;
        document.getElementById('imageUploadArea').innerHTML = `<img src="${e.target.result}" alt="Previsualización">`;
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
    document.getElementById('imageUploadArea').innerHTML = `<div id="imageUploadContent" class="text-center"><i class="fas fa-cloud-upload-alt fa-3x text-muted mb-2"></i><p class="text-muted mb-0">Haz clic para subir una imagen</p><small class="text-muted">Recomendado: 800x600px</small></div>`;
    actualizarVistaPrevia();
}

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
            document.getElementById(sectionId)?.classList.add('active');
        });
    });
}

function initPerfilEventListeners() {
    const editBtn = document.getElementById('btnEditarPerfil');
    if (editBtn) editBtn.addEventListener('click', mostrarFormularioEdicion);

    const cancelBtn = document.getElementById('btnCancelarEdicion');
    if (cancelBtn) cancelBtn.addEventListener('click', cancelarEdicion);

    const formPerfil = document.getElementById('formActualizarPerfil');
    if (formPerfil) formPerfil.addEventListener('submit', guardarPerfil);

    const deleteBtn = document.getElementById('btnEliminarCuenta');
    if (deleteBtn) deleteBtn.addEventListener('click', () => modalEliminarCuenta.show());

    const confirmDeleteBtn = document.getElementById('btnConfirmarEliminacionDefinitiva');
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', confirmarEliminacionDefinitiva);
}

function renderizarPerfil() {
    if (!perfilVendedor) return;
    if (document.getElementById('vendorNameSidebar')) document.getElementById('vendorNameSidebar').textContent = perfilVendedor.nombres;
    if (document.getElementById('perfilNombres')) document.getElementById('perfilNombres').textContent = perfilVendedor.nombres;
    if (document.getElementById('perfilApellidos')) document.getElementById('perfilApellidos').textContent = perfilVendedor.apellidos;
    if (document.getElementById('perfilDocumento')) document.getElementById('perfilDocumento').textContent = perfilVendedor.documento;
    if (document.getElementById('perfilTelefono')) document.getElementById('perfilTelefono').textContent = perfilVendedor.telefono;
    if (document.getElementById('perfilCorreo')) document.getElementById('perfilCorreo').textContent = perfilVendedor.correo;
}

function mostrarFormularioEdicion() {
    document.getElementById('perfilDisplay').style.display = 'none';
    document.getElementById('perfilEditForm').style.display = 'block';
    document.getElementById('btnEditarPerfil').style.display = 'none';
    document.getElementById('editNombres').value = perfilVendedor.nombres;
    document.getElementById('editApellidos').value = perfilVendedor.apellidos;
    document.getElementById('editDocumento').value = perfilVendedor.documento;
    document.getElementById('editTelefono').value = perfilVendedor.telefono;
    document.getElementById('editPassActual').value = '';
    document.getElementById('editPassNueva').value = '';
}

function cancelarEdicion() {
    document.getElementById('perfilDisplay').style.display = 'block';
    document.getElementById('perfilEditForm').style.display = 'none';
    document.getElementById('btnEditarPerfil').style.display = 'block';
}

async function guardarPerfil(event) {
    event.preventDefault();
    showLoader();
    const data = {
        nombres: document.getElementById('editNombres').value,
        apellidos: document.getElementById('editApellidos').value,
        documento: document.getElementById('editDocumento').value,
        telefono: document.getElementById('editTelefono').value,
        contrasenaActual: document.getElementById('editPassActual').value,
        nuevaContrasena: document.getElementById('editPassNueva').value
    };
    try {
        const response = await api.put('/api/perfil/vendedor', data);
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error al actualizar.');
        perfilVendedor = result;
        renderizarPerfil();
        cancelarEdicion();
        showNotification('Perfil actualizado con éxito.', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        hideLoader();
    }
}

async function confirmarEliminacionDefinitiva() {
    showLoader();
    modalEliminarCuenta.hide();
    try {
        const response = await api.delete('/api/perfil/vendedor');
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'No se pudo eliminar la cuenta.');
        }
        showNotification('Tu cuenta ha sido eliminada. Serás redirigido.', 'success');
        setTimeout(() => {
            window.location.href = '/login?eliminado=true';
        }, 2500);
    } catch (error) {
        showNotification(error.message, 'error');
        hideLoader();
    }
}

function calcularAhorroCombo() {
    const select = document.getElementById('ofertaProductoId');
    const precioInput = document.getElementById('ofertaPrecio');
    const precioOriginalInput = document.getElementById('ofertaPrecioOriginal');
    const msgAhorro = document.getElementById('msgAhorro');

    const selectedOption = select.options[select.selectedIndex];
    const precioOriginal = parseFloat(selectedOption.getAttribute('data-precio')) || 0;

    precioOriginalInput.value = formatCurrency(precioOriginal);

    const precioCombo = parseFloat(precioInput.value) || 0;

    if (precioCombo > 0 && precioOriginal > 0) {
        const diferencia = precioOriginal - precioCombo;
        if (diferencia > 0) {
            msgAhorro.style.display = 'block';
            msgAhorro.textContent = `¡El cliente ahorra ${formatCurrency(diferencia)}!`;
            msgAhorro.className = 'form-text text-success fw-bold';
        } else {
            msgAhorro.style.display = 'block';
            msgAhorro.textContent = 'Precio superior al producto base (Upselling).';
            msgAhorro.className = 'form-text text-primary';
        }
    } else {
        msgAhorro.style.display = 'none';
    }
}