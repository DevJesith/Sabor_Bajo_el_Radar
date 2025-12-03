// Obtener pedidos del localStorage (simulado)
let orders = JSON.parse(localStorage.getItem('orders')) || generateSampleOrders();

// Generar pedidos de muestra si no existen
function generateSampleOrders() {
    const sampleOrders = [
        {
            id: 'ORD-2024-001',
            date: '2024-03-15T14:30:00',
            vendorName: 'El Buen Sabor Urbano',
            vendorCategory: 'Comida Rápida',
            status: 'entregado',
            items: [
                {name: 'Hamburguesa Clásica', quantity: 2, price: 12.90},
                {name: 'Papas Fritas', quantity: 1, price: 5.00}
            ],
            subtotal: 30.80,
            shipping: 0,
            tax: 5.85,
            total: 36.65,
            deliveryAddress: 'Calle 123 #45-67, Bogotá',
            customerName: 'Jesith Ramírez',
            phone: '+57 300 123 4567',
            timeline: [
                {title: 'Pedido realizado', time: '14:30', completed: true},
                {title: 'Pedido confirmado', time: '14:35', completed: true},
                {title: 'En preparación', time: '14:40', completed: true},
                {title: 'En camino', time: '15:00', completed: true},
                {title: 'Entregado', time: '15:30', completed: true}
            ]
        },
        {
            id: 'ORD-2024-002',
            date: '2024-03-20T19:15:00',
            vendorName: 'Express Gourmet',
            vendorCategory: 'Comida Internacional',
            status: 'en-camino',
            items: [
                {name: 'Pizza Margarita', quantity: 1, price: 22.00},
                {name: 'Ensalada César', quantity: 1, price: 12.00}
            ],
            subtotal: 34.00,
            shipping: 0,
            tax: 6.46,
            total: 40.46,
            deliveryAddress: 'Carrera 7 #89-12, Bogotá',
            customerName: 'Jesith Ramírez',
            phone: '+57 300 123 4567',
            timeline: [
                {title: 'Pedido realizado', time: '19:15', completed: true},
                {title: 'Pedido confirmado', time: '19:18', completed: true},
                {title: 'En preparación', time: '19:25', completed: true},
                {title: 'En camino', time: '19:45', current: true},
                {title: 'Entregado', time: '', completed: false}
            ]
        },
        {
            id: 'ORD-2024-003',
            date: '2024-03-22T12:00:00',
            vendorName: 'Dulce Tentación',
            vendorCategory: 'Postres',
            status: 'en-proceso',
            items: [
                {name: 'Torta de Chocolate', quantity: 2, price: 8.00},
                {name: 'Cheesecake', quantity: 1, price: 9.50}
            ],
            subtotal: 25.50,
            shipping: 0,
            tax: 4.85,
            total: 30.35,
            deliveryAddress: 'Calle 45 #12-34, Bogotá',
            customerName: 'Jesith Ramírez',
            phone: '+57 300 123 4567',
            timeline: [
                {title: 'Pedido realizado', time: '12:00', completed: true},
                {title: 'Pedido confirmado', time: '12:05', current: true},
                {title: 'En preparación', time: '', completed: false},
                {title: 'En camino', time: '', completed: false},
                {title: 'Entregado', time: '', completed: false}
            ]
        }
    ];

    localStorage.setItem('orders', JSON.stringify(sampleOrders));
    return sampleOrders;
}

// Actualizar contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Renderizar pedidos
function renderOrders(filter = 'todos') {
    const ordersList = document.getElementById('ordersList');
    const emptyState = document.getElementById('emptyState');

    // Filtrar pedidos
    let filteredOrders = orders;
    if (filter !== 'todos') {
        filteredOrders = orders.filter(order => order.status === filter);
    }

    // Actualizar contadores
    updateCounters();

    // Mostrar estado vacío si no hay pedidos
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // Renderizar pedidos
    ordersList.innerHTML = filteredOrders.map(order => `
        <div class="col-12">
            <div class="order-card" onclick='openOrderDetail(${JSON.stringify(order).replace(/'/g, '&apos;')})'>
                <div class="order-header">
                    <div>
                        <div class="order-id">${order.id}</div>
                        <div class="order-date">${formatDate(order.date)}</div>
                    </div>
                    <div class="order-status status-${order.status}">
                        ${getStatusLabel(order.status)}
                    </div>
                </div>
                
                <div class="order-vendor">
                    <div class="vendor-image-small"></div>
                    <div>
                        <p class="vendor-name">${order.vendorName}</p>
                        <p class="vendor-category">${order.vendorCategory}</p>
                    </div>
                </div>
                
                <div class="order-items-summary">
                    ${order.items.map(item => `
                        <p><strong>${item.quantity}x</strong> ${item.name}</p>
                    `).join('')}
                </div>
                
                <div class="order-footer">
                    <div class="order-total">Total: S/ ${order.total.toFixed(2)}</div>
                    <button class="btn btn-outline-primary btn-sm" onclick="event.stopPropagation(); openOrderDetail(${JSON.stringify(order).replace(/'/g, '&apos;')})">
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Actualizar contadores de filtros
function updateCounters() {
    document.getElementById('countTodos').textContent = orders.length;
    document.getElementById('countEnProceso').textContent = orders.filter(o => o.status === 'en-proceso').length;
    document.getElementById('countEnCamino').textContent = orders.filter(o => o.status === 'en-camino').length;
    document.getElementById('countEntregado').textContent = orders.filter(o => o.status === 'entregado').length;
    document.getElementById('countCancelado').textContent = orders.filter(o => o.status === 'cancelado').length;
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    return date.toLocaleDateString('es-ES', options);
}

// Obtener etiqueta de estado
function getStatusLabel(status) {
    const labels = {
        'en-proceso': 'En proceso',
        'en-camino': 'En camino',
        'entregado': 'Entregado',
        'cancelado': 'Cancelado'
    };
    return labels[status] || status;
}

// Abrir detalle del pedido
function openOrderDetail(order) {
    // Llenar datos del modal
    document.getElementById('modalOrderId').textContent = order.id;
    document.getElementById('modalOrderDate').textContent = formatDate(order.date);

    // Timeline
    const timelineHTML = order.timeline.map(item => `
        <div class="timeline-item ${item.completed ? 'completed' : ''} ${item.current ? 'current' : ''}">
            <div class="timeline-title">${item.title}</div>
            <div class="timeline-time">${item.time || 'Pendiente'}</div>
        </div>
    `).join('');
    document.getElementById('orderTimeline').innerHTML = timelineHTML;

    // Items del pedido
    const itemsHTML = order.items.map(item => `
        <div class="modal-order-item">
            <div>
                <strong>${item.quantity}x</strong> ${item.name}
            </div>
            <div>S/ ${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    document.getElementById('modalOrderItems').innerHTML = itemsHTML;

    // Información de entrega
    document.getElementById('modalAddress').textContent = order.deliveryAddress;
    document.getElementById('modalCustomerName').textContent = order.customerName;
    document.getElementById('modalPhone').textContent = order.phone;

    // Resumen de pago
    document.getElementById('modalSubtotal').textContent = `S/ ${order.subtotal.toFixed(2)}`;
    document.getElementById('modalTax').textContent = `S/ ${order.tax.toFixed(2)}`;
    document.getElementById('modalTotal').textContent = `S/ ${order.total.toFixed(2)}`;

    // Mostrar/ocultar botón de rastreo
    const btnRastrear = document.getElementById('btnRastrear');
    if (order.status === 'en-camino') {
        btnRastrear.style.display = 'inline-block';
    } else {
        btnRastrear.style.display = 'none';
    }

    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById('modalDetallePedido'));
    modal.show();
}

// Rastrear pedido
function rastrearPedido() {
    showNotification('Abriendo mapa de rastreo...', 'info');
    // Aquí iría la integración con el mapa de rastreo
}

// Repetir pedido
function repetirPedido() {
    showNotification('Productos agregados al carrito', 'success');
    setTimeout(() => {
        window.location.href = 'carrito.html';
    }, 1500);
}

// Mostrar notificación
function showNotification(message, type = 'success') {
    const colors = {
        success: 'bg-success',
        error: 'bg-danger',
        info: 'bg-info'
    };

    const bgColor = colors[type] || colors.success;

    const notification = document.createElement('div');
    notification.className = 'position-fixed top-0 end-0 p-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-body ${bgColor} text-white rounded">
                <i class="fas fa-info-circle me-2"></i>${message}
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    renderOrders();

    // Filtros
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            renderOrders(filter);
        });
    });
});