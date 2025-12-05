// =================================================================================
// Sabor Bajo el Radar - Panel de Vendedor v4.1 (COMPLETO con Eliminación Directa)
// =================================================================================

// ========== VARIABLES GLOBALES ==========
let puestos = [], productos = [], ofertas = [], pedidos = [];
let perfilVendedor = null;
let modalPuesto, modalProducto, modalOferta, modalEliminarCuenta;
let salesChartInstance, productsChartInstance;
let imagenPuestoTemporal = null;
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
    modalPuesto = new bootstrap.Modal(document.getElementById('modalPuesto'));
    modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'));
    modalOferta = new bootstrap.Modal(document.getElementById('modalOferta'));
    modalEliminarCuenta = new bootstrap.Modal(document.getElementById('modalConfirmarEliminacion'));

    const imagenInput = document.getElementById('puestoImagenInput');
    if (imagenInput) imagenInput.addEventListener('change', previewImagen);

    cargarDatosIniciales();
    initNavigation();
    initPerfilEventListeners();
});

async function cargarDatosIniciales() {
    showLoader();
    try {
        const [puestosRes, productosRes, ofertasRes, perfilRes] = await Promise.all([
            api.get('/api/negocios'),
            api.get('/api/productos'),
            api.get('/api/ofertas'),
            api.get('/api/perfil/vendedor')
        ]);

        if (!puestosRes.ok || !productosRes.ok || !ofertasRes.ok || !perfilRes.ok) {
            throw new Error('Error de conexión al cargar datos iniciales.');
        }

        puestos = await puestosRes.json();
        productos = await productosRes.json();
        ofertas = await ofertasRes.json();
        perfilVendedor = await perfilRes.json();

        if (pedidos.length === 0 && productos.length > 0) generarPedidoDemo(3);
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
//          LÓGICA DE PERFIL
// ===============================================
function initPerfilEventListeners() {
    document.getElementById('btnEditarPerfil').addEventListener('click', mostrarFormularioEdicion);
    document.getElementById('btnCancelarEdicion').addEventListener('click', cancelarEdicion);
    document.getElementById('formActualizarPerfil').addEventListener('submit', guardarPerfil);
    document.getElementById('btnEliminarCuenta').addEventListener('click', () => modalEliminarCuenta.show());
    document.getElementById('btnConfirmarEliminacionDefinitiva').addEventListener('click', confirmarEliminacionDefinitiva);
}

function renderizarPerfil() {
    if (!perfilVendedor) return;
    document.getElementById('vendorNameSidebar').textContent = perfilVendedor.nombres;
    document.getElementById('perfilNombres').textContent = perfilVendedor.nombres;
    document.getElementById('perfilApellidos').textContent = perfilVendedor.apellidos;
    document.getElementById('perfilDocumento').textContent = perfilVendedor.documento;
    document.getElementById('perfilTelefono').textContent = perfilVendedor.telefono;
    document.getElementById('perfilCorreo').textContent = perfilVendedor.correo;
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
    const pedidosFiltrados = dashboardFiltroPuestoId === 'todos' ? pedidos : pedidos.filter(p => String(p.puestoId) === String(dashboardFiltroPuestoId));
    const hoy = new Date().toISOString().slice(0, 10);
    const pedidosDeHoy = pedidosFiltrados.filter(p => p.fecha.startsWith(hoy));
    const totalVentas = pedidosDeHoy.reduce((sum, p) => sum + p.total, 0);
    const totalPedidos = pedidosDeHoy.length;
    document.getElementById('totalVentas').textContent = formatCurrency(totalVentas);
    document.getElementById('totalPedidos').textContent = totalPedidos;
    document.getElementById('ticketPromedio').textContent = formatCurrency(totalPedidos > 0 ? totalVentas / totalPedidos : 0);
    document.getElementById('pedidosPendientes').textContent = pedidosFiltrados.filter(p => p.estado === 'Pendiente').length;
    crearGraficoVentas(pedidosFiltrados);
    crearGraficoProductos(pedidosFiltrados);
}

function crearGraficoVentas(pedidosData) {
    const ctx = document.getElementById('salesChart')?.getContext('2d');
    if (!ctx) return;
    const ventasPorDia = Array(7).fill(0);
    pedidosData.forEach(p => {
        ventasPorDia[new Date(p.fecha).getDay()] += p.total;
    });
    if (salesChartInstance) salesChartInstance.destroy();
    salesChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            datasets: [{
                label: "Ventas",
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
    pedidosData.forEach(p => p.productos.forEach(item => {
        conteo[item.nombre] = (conteo[item.nombre] || 0) + item.cantidad;
    }));
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
//          LÓGICA DE PEDIDOS (DEMO)
// ===============================================
function renderizarPedidos() {
    const container = document.getElementById('listaPedidos');
    if (pedidos.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info">No hay pedidos para mostrar.</div></div>`;
        return;
    }
    pedidos.sort((a, b) => (a.estado === 'Pendiente' && b.estado !== 'Pendiente') ? -1 : 0);
    container.innerHTML = pedidos.map(p => `<div class="col-lg-6"><div class="order-card"><div class="order-card-header"><h5>Pedido #${p.id}</h5><span class="badge ${getStatusBadge(p.estado)}">${p.estado}</span></div><p class="order-card-customer"><strong>Cliente:</strong> ${p.cliente}</p><div class="order-card-products"><strong>Productos:</strong><ul>${p.productos.map(item => `<li>${item.cantidad}x ${item.nombre}</li>`).join('')}</ul></div><p class="order-card-total">Total: ${formatCurrency(p.total)}</p><div class="order-card-actions text-end">${p.estado === 'Pendiente' ? `<button class="btn btn-primary btn-sm" onclick="cambiarEstadoPedido('${p.id}', 'Preparando')">Aceptar</button>` : ''}${p.estado === 'Preparando' ? `<button class="btn btn-success btn-sm" onclick="cambiarEstadoPedido('${p.id}', 'Listo para Recoger')">Marcar Listo</button>` : ''}${p.estado !== 'Entregado' && p.estado !== 'Cancelado' ? `<button class="btn btn-danger btn-sm ms-2" onclick="cambiarEstadoPedido('${p.id}', 'Cancelado')">Cancelar</button>` : ''}</div></div></div>`).join('');
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
    if (productos.length === 0 || puestos.length === 0) {
        if (cantidad === 1) showNotification('Crea un puesto y un producto para generar pedidos.', 'warning');
        return;
    }
    const clientes = ['Ana García', 'Carlos Rodriguez', 'Luisa Martinez'];
    for (let i = 0; i < cantidad; i++) {
        const puesto = puestos[Math.floor(Math.random() * puestos.length)];
        const prodsPuesto = productos.filter(p => p.negocio.id === puesto.id);
        if (prodsPuesto.length === 0) continue;
        const prod = prodsPuesto[Math.floor(Math.random() * prodsPuesto.length)];
        pedidos.push({
            id: String(Math.floor(Math.random() * 9000) + 1000),
            puestoId: puesto.id,
            cliente: clientes[Math.floor(Math.random() * clientes.length)],
            productos: [{nombre: prod.nombre, cantidad: 1}],
            total: prod.precio,
            estado: 'Pendiente',
            fecha: new Date().toISOString()
        });
    }
    if (cantidad === 1) showNotification('Nuevo pedido de demostración generado.', 'success');
    renderizarTodo();
}


// ===============================================
//          RENDERIZADO Y MODALES CRUD
// ===============================================
function renderizarPuestos() {
    const container = document.getElementById('listaPuestos');
    if (puestos.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info">Aún no has creado ningún puesto.</div></div>`;
        return;
    }
    container.innerHTML = puestos.map(puesto => {
        let statusBadge;
        switch (puesto.aprobado) {
            case 'aprobado':
                statusBadge = `<span class="badge bg-success">Aprobado</span>`;
                break;
            case 'rechazado':
                statusBadge = `<span class="badge bg-danger">Rechazado</span>`;
                break;
            default:
                statusBadge = `<span class="badge bg-warning text-dark">Pendiente</span>`;
        }
        const rejectionReason = puesto.aprobado === 'rechazado' && puesto.motivoRechazo ? `<div class="alert alert-danger p-2 mt-2 small"><strong>Motivo:</strong> ${puesto.motivoRechazo}</div>` : '';
        return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <img src="${puesto.imagenUrl || 'https://via.placeholder.com/400x300/e9ecef/6c757d?text=Sin+Imagen'}" class="card-img-top" alt="${puesto.nombreNegocio}" style="height: 180px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <div>
                        <div class="d-flex justify-content-between align-items-center"><h5 class="card-title mb-0">${puesto.nombreNegocio}</h5>${statusBadge}</div>
                        <h6 class="card-subtitle mt-1 mb-2 text-muted">${puesto.tipoNegocio}</h6>${rejectionReason}
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
    document.getElementById('alertNoPuestosParaProductos').style.display = puestos.length === 0 ? 'block' : 'none';
    if (puestos.length === 0) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = productos.length === 0 ? `<div class="col-12"><div class="alert alert-info">No tienes productos registrados.</div></div>` : productos.map(p => `<div class="col-md-6 col-lg-4 mb-4"><div class="card h-100"><div class="card-body"><h5 class="card-title">${p.nombre}</h5><h6 class="card-subtitle mb-2 text-muted">${puestos.find(n => n.id === p.negocio.id)?.nombreNegocio || 'N/A'}</h6><p class="card-text"><strong>Precio:</strong> ${formatCurrency(p.precio)}</p><p class="card-text"><strong>Stock:</strong> ${p.stock} uds.</p></div><div class="card-footer"><button class="btn btn-sm btn-outline-primary" onclick="mostrarModalProducto(${p.id})">Editar</button><button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarProducto(${p.id})">Eliminar</button></div></div></div>`).join('');
}

function renderizarOfertas() {
    const container = document.getElementById('listaOfertas');
    document.getElementById('alertNoProductosParaOfertas').style.display = productos.length === 0 ? 'block' : 'none';
    if (productos.length === 0) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = ofertas.length === 0 ? `<div class="col-12"><div class="alert alert-info">No tienes ofertas activas.</div></div>` : ofertas.map(o => `<div class="col-md-6 col-lg-4 mb-4"><div class="card h-100 border-primary"><div class="card-header bg-primary text-white">${o.titulo} - ${o.descuento}% OFF</div><div class="card-body"><h6 class="card-subtitle mb-2 text-muted">Producto: ${o.producto.nombre}</h6><p class="card-text">${o.descripcion || ''}</p><p class="card-text"><small class="text-muted">Válido del ${o.fechaInicio} al ${o.fechaExpiracion}</small></p></div><div class="card-footer"><button class="btn btn-sm btn-outline-primary" onclick="mostrarModalOferta(${o.id})">Editar</button><button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarOferta(${o.id})">Eliminar</button></div></div></div>`).join('');
}

// Lógica de Modales (Mostrar, Guardar, Eliminar)
function mostrarModalPuesto(id = null) {
    // 1. Resetea el formulario a su estado inicial
    document.getElementById('formPuesto').reset();
    document.getElementById('puestoId').value = '';
    imagenPuestoTemporal = null;
    resetearVistaPrevia(); // Limpia la imagen y textos de la vista previa

    // 2. Por defecto, el título es para un nuevo puesto
    document.getElementById('modalPuestoTitle').textContent = 'Nuevo Puesto';

    // 3. Si se proporciona un 'id', significa que estamos EDITANDO
    if (id) {
        // Buscamos el puesto en nuestra lista de puestos ya cargada
        const puesto = puestos.find(p => p.id === id);

        // Si lo encontramos, rellenamos el formulario con sus datos
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

            // Si el puesto tiene una imagen, la mostramos
            if (puesto.imagenUrl) {
                imagenPuestoTemporal = puesto.imagenUrl;
                document.getElementById('previewImagen').src = puesto.imagenUrl;
                document.getElementById('imageUploadArea').innerHTML = `<img src="${puesto.imagenUrl}" alt="Imagen actual">`;
            }

            // Actualizamos la vista previa con los datos cargados
            actualizarVistaPrevia();
        }
    }

    // 4. Finalmente, mostramos el modal (ya sea vacío o con los datos cargados)
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
        await cargarDatosIniciales(); // Recargamos datos para ver el nuevo puesto

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
    document.getElementById('productoPuestoId').innerHTML = puestos.map(p => `<option value="${p.id}">${p.nombreNegocio}</option>`).join('');
    document.getElementById('modalProductoTitle').textContent = 'Nuevo Producto';
    if (id) {
        const p = productos.find(p => p.id === id);
        if (p) {
            document.getElementById('modalProductoTitle').textContent = 'Editar Producto';
            document.getElementById('productoId').value = p.id;
            document.getElementById('productoPuestoId').value = p.negocio.id;
            document.getElementById('productoNombre').value = p.nombre;
            document.getElementById('productoDescripcion').value = p.descripcion;
            document.getElementById('productoPrecio').value = p.precio;
            document.getElementById('productoStock').value = p.stock;
            document.getElementById('productoCategoria').value = p.categoria;
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
        const res = await (id ? api.put(`/api/productos/${id}`, data) : api.post('/api/productos', data));
        if (!res.ok) throw new Error();
        showNotification(`Producto ${id ? 'actualizado' : 'creado'} con éxito.`, 'success');
        modalProducto.hide();
        await cargarDatosIniciales();
    } catch (e) {
        showNotification('No se pudo guardar el producto.', 'error');
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
    document.getElementById('ofertaProductoId').innerHTML = productos.map(p => `<option value="${p.id}">${p.nombre} (${puestos.find(n => n.id === p.negocio.id)?.nombreNegocio})</option>`).join('');
    document.getElementById('modalOfertaTitle').textContent = 'Nueva Oferta';
    if (id) {
        const o = ofertas.find(o => o.id === id);
        if (o) {
            document.getElementById('modalOfertaTitle').textContent = 'Editar Oferta';
            document.getElementById('ofertaId').value = o.id;
            document.getElementById('ofertaProductoId').value = o.producto.id;
            document.getElementById('ofertaTitulo').value = o.titulo;
            document.getElementById('ofertaDescripcion').value = o.descripcion;
            document.getElementById('ofertaDescuento').value = o.descuento;
            document.getElementById('ofertaFechaInicio').value = o.fechaInicio;
            document.getElementById('ofertaFechaFin').value = o.fechaExpiracion;
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
        const res = await (id ? api.put(`/api/ofertas/${id}`, data) : api.post('/api/ofertas', data));
        if (!res.ok) throw new Error();
        showNotification(`Oferta ${id ? 'actualizada' : 'creada'} con éxito.`, 'success');
        modalOferta.hide();
        await cargarDatosIniciales();
    } catch (e) {
        showNotification('No se pudo guardar la oferta.', 'error');
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