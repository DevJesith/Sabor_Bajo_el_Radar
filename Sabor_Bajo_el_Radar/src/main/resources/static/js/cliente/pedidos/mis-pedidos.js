// // ==========================================
// // VARIABLES GLOBALES
// // ==========================================
// let orders = [];
//
// // Formateador de moneda
// const formatCurrency = (value) => new Intl.NumberFormat('es-CO', {
//     style: 'currency', currency: 'COP', minimumFractionDigits: 0
// }).format(value);
//
// // ==========================================
// // INICIALIZACIÓN
// // ==========================================
// document.addEventListener('DOMContentLoaded', function () {
//     updateCartCount();
//     cargarPedidosBackend();
//
//     // Filtros
//     document.querySelectorAll('.filter-btn').forEach(btn => {
//         btn.addEventListener('click', function () {
//             document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
//             this.classList.add('active');
//             renderOrders(this.getAttribute('data-filter'));
//         });
//     });
// });
//
// // ==========================================
// // API BACKEND
// // ==========================================
// async function cargarPedidosBackend() {
//     const listContainer = document.getElementById('ordersList');
//     listContainer.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary"></div></div>';
//
//     try {
//         const response = await fetch('/api/pedidos');
//         if (!response.ok) throw new Error('Error al cargar pedidos');
//
//         orders = await response.json();
//         updateCounters();
//         renderOrders('todos');
//
//     } catch (error) {
//         console.error(error);
//         listContainer.innerHTML = '<div class="col-12 text-center text-danger">No se pudieron cargar tus pedidos.</div>';
//     }
// }
//
// async function cancelarPedidoBackend(idPedido) {
//     if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) return;
//
//     try {
//         // Headers para CSRF
//         const token = document.querySelector('meta[name="_csrf"]')?.content;
//         const headerName = document.querySelector('meta[name="_csrf_header"]')?.content;
//
//         const headers = {'Content-Type': 'application/json'};
//         if (token && headerName) headers[headerName] = token;
//
//         const response = await fetch(`/api/pedidos/${idPedido.replace('ORD-', '')}/cancelar`, {
//             method: 'POST',
//             headers: headers
//         });
//
//         const result = await response.json();
//
//         if (response.ok) {
//             alert('✅ Pedido cancelado exitosamente');
//             // Cerrar modal y recargar
//             const modalEl = document.getElementById('modalDetallePedido');
//             const modal = bootstrap.Modal.getInstance(modalEl);
//             modal.hide();
//             cargarPedidosBackend();
//         } else {
//             alert('❌ ' + (result.error || 'No se pudo cancelar el pedido'));
//         }
//
//     } catch (error) {
//         console.error(error);
//         alert('❌ Error de conexión al intentar cancelar el pedido');
//     }
// }
//
// // ==========================================
// // RENDERIZADO Y FILTROS
// // ==========================================
// function renderOrders(filter = 'todos') {
//     const ordersList = document.getElementById('ordersList');
//     const emptyState = document.getElementById('emptyState');
//
//     let filteredOrders = orders;
//
//     if (filter !== 'todos') {
//         filteredOrders = orders.filter(order => {
//             const status = order.status.toLowerCase();
//
//             if (filter === 'en-proceso') {
//                 return ['pendiente', 'aceptado', 'preparando'].includes(status);
//             }
//             if (filter === 'en-camino') {
//                 return status === 'en_camino';
//             }
//             if (filter === 'entregado') {
//                 return status === 'entregado';
//             }
//             if (filter === 'cancelado') {
//                 return status === 'cancelado';
//             }
//             return false;
//         });
//     }
//
//     if (filteredOrders.length === 0) {
//         ordersList.innerHTML = '';
//         if (filter === 'todos') emptyState.style.display = 'block';
//         else ordersList.innerHTML = '<p class="text-center text-muted w-100 py-4">No hay pedidos en esta categoría.</p>';
//         return;
//     }
//
//     emptyState.style.display = 'none';
//
//     ordersList.innerHTML = filteredOrders.map(order => `
//         <div class="col-12">
//             <div class="order-card" onclick='openOrderDetail(${JSON.stringify(order).replace(/'/g, "&apos;")})'>
//                 <div class="order-header">
//                     <div>
//                         <div class="order-id">${order.id}</div>
//                         <div class="order-date">${formatDate(order.date)}</div>
//                     </div>
//                     <div class="order-status status-${order.status.toLowerCase().replace(' ', '-')}">
//                         ${order.status}
//                     </div>
//                 </div>
//
//                 <div class="order-vendor">
//                     <div class="vendor-image-small bg-light d-flex align-items-center justify-content-center">
//                         <i class="fas fa-store text-muted"></i>
//                     </div>
//                     <div>
//                         <p class="vendor-name">${order.vendorName || 'Restaurante'}</p>
//                     </div>
//                 </div>
//
//                 <div class="order-items-summary">
//                     ${order.items.map(item => `
//                         <p><strong>${item.quantity}x</strong> ${item.name}</p>
//                     `).join('')}
//                 </div>
//
//                 <div class="order-footer">
//                     <div class="order-total">Total: ${formatCurrency(order.total)}</div>
//                     <button class="btn btn-outline-primary btn-sm">Ver detalles</button>
//                 </div>
//             </div>
//         </div>
//     `).join('');
// }
//
// function updateCounters() {
//     document.getElementById('countTodos').textContent = orders.length;
//     document.getElementById('countEnProceso').textContent = orders.filter(o => ['pendiente', 'aceptado', 'preparando'].includes(o.status.toLowerCase())).length;
//     document.getElementById('countEnCamino').textContent = orders.filter(o => o.status.toLowerCase() === 'en_camino').length;
//     document.getElementById('countEntregado').textContent = orders.filter(o => o.status.toLowerCase() === 'entregado').length;
//     document.getElementById('countCancelado').textContent = orders.filter(o => o.status.toLowerCase() === 'cancelado').length;
// }
//
// // ==========================================
// // MODAL DETALLE CON LÓGICA DE CANCELACIÓN MEJORADA
// // ==========================================
// function openOrderDetail(order) {
//     // 1. Datos básicos
//     document.getElementById('modalOrderId').textContent = order.id;
//     document.getElementById('modalOrderDate').textContent = formatDate(order.date);
//     document.getElementById('modalAddress').textContent = order.deliveryAddress || 'Dirección registrada';
//     document.getElementById('modalCustomerName').textContent = order.customerName || 'Cliente';
//     document.getElementById('modalPhone').textContent = order.customerPhone || 'Sin teléfono';
//
//     // 2. Nota
//     const noteSection = document.getElementById('modalNoteSection');
//     if (noteSection) {
//         if (order.note && order.note.trim() !== "") {
//             document.getElementById('modalNoteText').textContent = order.note;
//             noteSection.style.display = 'block';
//         } else {
//             noteSection.style.display = 'none';
//         }
//     }
//
//     // 3. Timeline
//     renderTimeline(order.status);
//
//     // 4. Items
//     const itemsHTML = order.items.map(item => `
//         <div class="modal-order-item d-flex justify-content-between mb-2">
//             <div>
//                 <span class="badge bg-light text-dark border me-2">${item.quantity}x</span>
//                 <span>${item.name}</span>
//             </div>
//             <div class="fw-bold">${formatCurrency(item.price * item.quantity)}</div>
//         </div>
//     `).join('');
//     document.getElementById('modalOrderItems').innerHTML = itemsHTML;
//
//     // 5. Total
//     document.getElementById('modalTotal').textContent = formatCurrency(order.total);
//
//     // 6. LÓGICA DE CANCELACIÓN MEJORADA (10 MINUTOS)
//     configurarLogicaCancelacion(order);
//
//     // 7. Mostrar modal
//     const modal = new bootstrap.Modal(document.getElementById('modalDetallePedido'));
//     modal.show();
// }
//
// /**
//  * Configura la lógica de cancelación del pedido
//  * @param {Object} order - Objeto del pedido con todos sus datos
//  */
// function configurarLogicaCancelacion(order) {
//     const btnCancelar = document.getElementById('btnCancelarPedido');
//     const alertInfo = document.getElementById('cancelInfoAlert');
//     const btnRastrear = document.getElementById('btnRastrear');
//
//     const status = order.status.toLowerCase();
//
//     // Ocultar todos los elementos por defecto
//     if (btnCancelar) btnCancelar.style.display = 'none';
//     if (btnRastrear) btnRastrear.style.display = 'none';
//     if (alertInfo) {
//         alertInfo.style.cssText = 'display: none;'; // Resetear estilos inline
//     }
//
//     // === CASO 1: PEDIDO CANCELADO ===
//     if (status === 'cancelado') {
//         if (alertInfo) {
//             alertInfo.style.cssText = 'display: flex !important;';
//             alertInfo.className = 'alert alert-danger d-flex align-items-center mb-3';
//             alertInfo.innerHTML = `
//                 <i class="fas fa-times-circle flex-shrink-0 me-2 fs-4"></i>
//                 <div>
//                     <strong>Este pedido fue cancelado.</strong>
//                 </div>
//             `;
//         }
//         return;
//     }
//
//     // === CASO 2: SOLO EN ESTADO "PENDIENTE" SE PUEDE CANCELAR ===
//     if (status === 'pendiente') {
//         // ✅ Mostrar botón de cancelar SIN ningún mensaje
//         if (btnCancelar) {
//             btnCancelar.style.display = 'inline-block';
//             btnCancelar.onclick = () => cancelarPedidoBackend(order.id);
//         }
//         // NO mostrar ninguna alerta
//         if (alertInfo) {
//             alertInfo.style.display = 'none';
//         }
//         return;
//     }
//
//     // === CASO 3: PEDIDO EN PREPARACIÓN (aceptado, preparando) ===
//     if (['aceptado', 'preparando'].includes(status)) {
//         // NO se muestra el botón, NO se muestra alerta
//         return;
//     }
//
//     // === CASO 4: PEDIDO EN CAMINO (Mostrar rastreo) ===
//     if (status === 'en_camino') {
//         if (btnRastrear) {
//             btnRastrear.style.display = 'inline-block';
//         }
//         return;
//     }
//
//     // === CASO 5: PEDIDO ENTREGADO ===
//     if (status === 'entregado') {
//         // No hacer nada especial
//         return;
//     }
// }
//
// /**
//  * Calcula el tiempo transcurrido desde la fecha del pedido
//  * @param {string} fechaPedido - Fecha en formato ISO del pedido
//  * @returns {Object} Objeto con minutos y segundos transcurridos
//  */
// function calcularTiempoTranscurrido(fechaPedido) {
//     const orderDate = new Date(fechaPedido);
//     const now = new Date();
//     const diffMs = now - orderDate; // Diferencia en milisegundos
//
//     const totalMinutos = Math.floor(diffMs / 60000); // Total de minutos transcurridos
//     const segundos = Math.floor((diffMs % 60000) / 1000); // Segundos restantes
//
//     return {
//         minutos: totalMinutos,
//         segundos: segundos,
//         totalMs: diffMs
//     };
// }
//
// // ==========================================
// // UTILIDADES
// // ==========================================
// function formatDate(dateString) {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('es-CO', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//     });
// }
//
// function updateCartCount() {
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const total = cart.reduce((sum, i) => sum + i.quantity, 0);
//     const badge = document.getElementById('cartCount');
//     if (badge) badge.textContent = total;
// }
//
// function renderTimeline(currentStatus) {
//     const container = document.getElementById('orderTimeline');
//     const status = currentStatus.toLowerCase().replace(' ', '_');
//
//     const steps = [
//         {key: 'pendiente', label: 'Confirmación', icon: 'fa-clipboard-check'},
//         {key: 'preparando', label: 'Preparando', icon: 'fa-fire'},
//         {key: 'en_camino', label: 'En camino', icon: 'fa-motorcycle'},
//         {key: 'entregado', label: 'Entregado', icon: 'fa-box-open'}
//     ];
//
//     let currentIndex = steps.findIndex(s => s.key === status);
//     if (status === 'aceptado') currentIndex = 1;
//     if (currentIndex === -1 && status !== 'cancelado') currentIndex = 0;
//
//     if (status === 'cancelado') {
//         container.innerHTML = `
//             <div class="text-center text-danger fw-bold py-4">
//                 <i class="fas fa-ban fa-3x mb-3"></i>
//                 <br>
//                 <span class="fs-5">Pedido Cancelado</span>
//             </div>
//         `;
//         return;
//     }
//
//     let html = '';
//     steps.forEach((step, index) => {
//         let cssClass = '';
//         if (index < currentIndex) cssClass = 'completed';
//         else if (index === currentIndex) cssClass = 'active';
//
//         html += `
//             <div class="timeline-step ${cssClass}" style="flex: 1;">
//                 <div class="step-icon"><i class="fas ${step.icon}"></i></div>
//                 <div class="step-label">${step.label}</div>
//             </div>`;
//     });
//
//     const progressPercent = currentIndex === -1 ? 0 : (currentIndex / (steps.length - 1)) * 100;
//     container.innerHTML = `<div class="timeline-progress" style="width: ${progressPercent}%;"></div>${html}`;
// }
//
// // Funciones adicionales para los botones
// function rastrearPedido() {
//     alert('🗺️ Función de rastreo en desarrollo...');
// }
//
// function repetirPedido() {
//     alert('🔄 Función de repetir pedido en desarrollo...');
// }

// ==========================================
// VARIABLES GLOBALES
// ==========================================
let orders = [];

// Formateador de moneda
const formatCurrency = (value) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0
}).format(value);

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    cargarPedidosBackend();
    cargarDatosUsuario();

    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderOrders(this.getAttribute('data-filter'));
        });
    });
});

// ==========================================
// API BACKEND
// ==========================================
async function cargarPedidosBackend() {
    const listContainer = document.getElementById('ordersList');
    listContainer.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary"></div></div>';

    try {
        const response = await fetch('/api/pedidos');
        if (!response.ok) throw new Error('Error al cargar pedidos');

        orders = await response.json();
        updateCounters();
        renderOrders('todos');

    } catch (error) {
        console.error(error);
        listContainer.innerHTML = '<div class="col-12 text-center text-danger">No se pudieron cargar tus pedidos.</div>';
    }
}

async function cancelarPedidoBackend(idPedidoNumerico) {
    if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) return;

    try {
        // Headers para CSRF
        const token = document.querySelector('meta[name="_csrf"]')?.content;
        const headerName = document.querySelector('meta[name="_csrf_header"]')?.content;

        const headers = {'Content-Type': 'application/json'};
        if (token && headerName) headers[headerName] = token;

        // Enviamos el ID numérico real para la operación
        const response = await fetch(`/api/pedidos/${idPedidoNumerico}/cancelar`, {
            method: 'POST',
            headers: headers
        });

        const result = await response.json();

        if (response.ok) {
            alert('✅ Pedido cancelado exitosamente');
            const modalEl = document.getElementById('modalDetallePedido');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            cargarPedidosBackend();
        } else {
            alert('❌ ' + (result.error || 'No se pudo cancelar el pedido'));
        }

    } catch (error) {
        console.error(error);
        alert('❌ Error de conexión');
    }
}

// ==========================================
// RENDERIZADO Y FILTROS
// ==========================================
function renderOrders(filter = 'todos') {
    const ordersList = document.getElementById('ordersList');
    const emptyState = document.getElementById('emptyState');

    let filteredOrders = orders;

    if (filter !== 'todos') {
        filteredOrders = orders.filter(order => {
            const status = order.status.toLowerCase();

            if (filter === 'en-proceso') {
                return ['pendiente', 'aceptado', 'preparando'].includes(status);
            }
            if (filter === 'en-camino') {
                return status === 'en_camino';
            }
            if (filter === 'entregado') {
                return status === 'entregado';
            }
            if (filter === 'cancelado') {
                return status === 'cancelado';
            }
            return false;
        });
    }

    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '';
        if (filter === 'todos') emptyState.style.display = 'block';
        else ordersList.innerHTML = '<p class="text-center text-muted w-100 py-4">No hay pedidos en esta categoría.</p>';
        return;
    }

    emptyState.style.display = 'none';

    ordersList.innerHTML = filteredOrders.map(order => `
        <div class="col-12">
            <div class="order-card" onclick='openOrderDetail(${JSON.stringify(order).replace(/'/g, "&apos;")})'>
                <div class="order-header">
                    <div>
                        <!-- AQUI MOSTRAMOS LA FACTURA (FAC-...) -->
                        <div class="order-id">${order.invoiceNumber || ('ORD-' + order.id)}</div>
                        <div class="order-date">${formatDate(order.date)}</div>
                    </div>
                    <div class="order-status status-${order.status.toLowerCase().replace(' ', '-')}">
                        ${order.status}
                    </div>
                </div>
                
                <div class="order-vendor">
                    <div class="vendor-image-small bg-light d-flex align-items-center justify-content-center">
                        <i class="fas fa-store text-muted"></i>
                    </div>
                    <div>
                        <p class="vendor-name">${order.vendorName || 'Restaurante'}</p>
                    </div>
                </div>
                
                <div class="order-items-summary">
                    ${order.items.map(item => `
                        <p><strong>${item.quantity}x</strong> ${item.name}</p>
                    `).join('')}
                </div>
                
                <div class="order-footer">
                    <div class="order-total">Total: ${formatCurrency(order.total)}</div>
                    <button class="btn btn-outline-primary btn-sm">Ver detalles</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCounters() {
    document.getElementById('countTodos').textContent = orders.length;
    document.getElementById('countEnProceso').textContent = orders.filter(o => ['pendiente', 'aceptado', 'preparando'].includes(o.status.toLowerCase())).length;
    document.getElementById('countEnCamino').textContent = orders.filter(o => o.status.toLowerCase() === 'en_camino').length;
    document.getElementById('countEntregado').textContent = orders.filter(o => o.status.toLowerCase() === 'entregado').length;
    document.getElementById('countCancelado').textContent = orders.filter(o => o.status.toLowerCase() === 'cancelado').length;
}

// ==========================================
// MODAL DETALLE
// ==========================================
function openOrderDetail(order) {
    // 1. Datos básicos - MOSTRAMOS FACTURA
    document.getElementById('modalOrderId').textContent = order.invoiceNumber || ('ORD-' + order.id);
    document.getElementById('modalOrderDate').textContent = formatDate(order.date);
    document.getElementById('modalAddress').textContent = order.deliveryAddress || 'Dirección registrada';
    document.getElementById('modalCustomerName').textContent = order.customerName || 'Cliente';
    document.getElementById('modalPhone').textContent = order.customerPhone || 'Sin teléfono';

    // 2. Nota
    const noteSection = document.getElementById('modalNoteSection');
    if (noteSection) {
        if (order.note && order.note.trim() !== "") {
            document.getElementById('modalNoteText').textContent = order.note;
            noteSection.style.display = 'block';
        } else {
            noteSection.style.display = 'none';
        }
    }

    // 3. Timeline
    renderTimeline(order.status);

    // 4. Items
    const itemsHTML = order.items.map(item => `
        <div class="modal-order-item d-flex justify-content-between mb-2">
            <div>
                <span class="badge bg-light text-dark border me-2">${item.quantity}x</span>
                <span>${item.name}</span>
            </div>
            <div class="fw-bold">${formatCurrency(item.price * item.quantity)}</div>
        </div>
    `).join('');
    document.getElementById('modalOrderItems').innerHTML = itemsHTML;

    // 5. Total
    document.getElementById('modalTotal').textContent = formatCurrency(order.total);

    // 6. Lógica de Botones (Sin tiempos, solo estado)
    configurarBotonesModal(order);

    // 7. Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('modalDetallePedido'));
    modal.show();
}

/**
 * Configura qué botones mostrar según el estado (Sin lógica de tiempo)
 */
function configurarBotonesModal(order) {
    const btnCancelar = document.getElementById('btnCancelarPedido');
    const alertInfo = document.getElementById('cancelInfoAlert');
    const btnRastrear = document.getElementById('btnRastrear');
    const status = order.status.toLowerCase();

    // Resetear visibilidad
    if (btnCancelar) btnCancelar.style.display = 'none';
    if (btnRastrear) btnRastrear.style.display = 'none';
    if (alertInfo) alertInfo.style.cssText = 'display: none !important;';

    // === CASO 1: CANCELADO ===
    if (status === 'cancelado') {
        if (alertInfo) {
            alertInfo.style.cssText = 'display: flex !important;';
            alertInfo.className = 'alert alert-danger d-flex align-items-center mb-3';
            alertInfo.innerHTML = '<i class="fas fa-times-circle me-2 fs-4"></i><strong>Pedido cancelado</strong>';
        }
        return;
    }

    // === CASO 2: PENDIENTE (Se puede cancelar siempre) ===
    if (status === 'pendiente') {
        if (btnCancelar) {
            btnCancelar.style.display = 'inline-block';
            // Usamos order.id (numérico) para la API
            btnCancelar.onclick = () => cancelarPedidoBackend(order.id);
        }
        return;
    }

    // === CASO 3: EN CAMINO ===
    if (status === 'en_camino' && btnRastrear) {
        btnRastrear.style.display = 'inline-block';
    }
}

// ==========================================
// UTILIDADES
// ==========================================
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, i) => sum + i.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = total;
}

function renderTimeline(currentStatus) {
    const container = document.getElementById('orderTimeline');
    const status = currentStatus.toLowerCase().replace(' ', '_');

    const steps = [
        {key: 'pendiente', label: 'Confirmación', icon: 'fa-clipboard-check'},
        {key: 'preparando', label: 'Preparando', icon: 'fa-fire'},
        {key: 'en_camino', label: 'En camino', icon: 'fa-motorcycle'},
        {key: 'entregado', label: 'Entregado', icon: 'fa-box-open'}
    ];

    let currentIndex = steps.findIndex(s => s.key === status);
    if (status === 'aceptado') currentIndex = 1;
    if (currentIndex === -1 && status !== 'cancelado') currentIndex = 0;

    if (status === 'cancelado') {
        container.innerHTML = `<div class="text-center text-danger fw-bold py-3"><i class="fas fa-ban fa-2x mb-2"></i><br>Cancelado</div>`;
        return;
    }

    let html = '';
    steps.forEach((step, index) => {
        let cssClass = '';
        if (index < currentIndex) cssClass = 'completed';
        else if (index === currentIndex) cssClass = 'active';

        html += `
            <div class="timeline-step ${cssClass}" style="flex: 1;">
                <div class="step-icon"><i class="fas ${step.icon}"></i></div>
                <div class="step-label">${step.label}</div>
            </div>`;
    });

    const progressPercent = (currentIndex / (steps.length - 1)) * 100;
    container.innerHTML = `<div class="timeline-progress" style="width: ${progressPercent}%;"></div>${html}`;
}

async function cargarDatosUsuario() {
    try {
        const response = await fetch('/api/perfil-cliente');
        if (!response.ok) return;

        const usuario = await response.json();
        const userSpans = document.querySelectorAll('.dropdown-toggle .d-none.d-lg-inline');

        if (usuario && usuario.nombres) {
            userSpans.forEach(span => {
                span.textContent = `Hola, ${usuario.nombres.split(' ')[0]}`;
            });
        }
    } catch (error) {
        console.log("Usuario no autenticado");
    }
}