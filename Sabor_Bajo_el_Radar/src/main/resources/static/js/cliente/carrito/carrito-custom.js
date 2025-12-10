// ==========================================
// VARIABLES GLOBALES
// ==========================================

// Formateador de moneda (COP)
const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

// Estado del carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    renderCartItems();
    cargarDatosUsuario();
});

// ==========================================
// RENDERIZADO
// ==========================================

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsPage');

    // Caso: Carrito Vacío
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart text-center py-5">
                <i class="fas fa-shopping-basket mb-3" style="font-size: 4rem; color: #dee2e6;"></i>
                <h3 class="text-muted">Tu carrito está vacío</h3>
                <p class="text-muted mb-4">¿Tienes hambre? Explora los mejores puestos de tu zona.</p>
                <a href="/cliente" class="btn btn-primary btn-lg rounded-pill px-5">
                    <i class="fas fa-utensils me-2"></i>Ver menú
                </a>
            </div>
        `;
        // Ocultar resumen si está vacío
        const summary = document.querySelector('.summary-section');
        if (summary) {
            summary.style.opacity = '0.5';
            summary.querySelector('button').disabled = true;
        }
        updateSummary();
        return;
    }

    // Habilitar resumen
    const summary = document.querySelector('.summary-section');
    if (summary) {
        summary.style.opacity = '1';
        summary.querySelector('button').disabled = false;
    }

    // Caso: Carrito con productos
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        // Lógica de Imagen (Si no tiene, placeholder)
        let imageHtml = '';
        if (item.image && item.image.trim() !== "") {
            // Nota: En la versión optimizada NO guardamos imagen en storage para evitar quota error.
            // Si quieres ver imagen aquí, necesitarías volver a habilitar el guardado o usar URLs cortas.
            // Por ahora asumimos que no hay imagen guardada y mostramos el icono.
            imageHtml = `<img src="${item.image}" alt="${item.name}" class="cart-item-image">`;
        } else {
            imageHtml = `
                <div class="cart-item-image d-flex align-items-center justify-content-center bg-light text-muted">
                    <i class="fas fa-utensils fa-lg"></i>
                </div>
            `;
        }

        return `
        <div class="cart-item-page">
            ${imageHtml}
            
            <div class="cart-item-details">
                <div class="d-flex justify-content-between">
                    <div>
                        <h5 class="cart-item-name mb-1">${item.name}</h5>
                        ${item.isCombo ? '<span class="badge bg-success mb-1">Combo</span>' : ''}
                    </div>
                    <button class="btn-remove-item text-danger border-0 bg-transparent" onclick="removeItem(${index})" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                
                <small class="text-muted d-block mb-2">Vendido por: <strong>${item.vendorName}</strong></small>
                <p class="cart-item-price mb-2 text-primary fw-bold">${formatCurrency(item.price)}</p>
                
                <div class="cart-item-actions d-flex justify-content-between align-items-center mt-auto">
                    <div class="quantity-controls">
                        <button onclick="decreaseQuantity(${index})"><i class="fas fa-minus"></i></button>
                        <span>${item.quantity}</span>
                        <button onclick="increaseQuantity(${index})"><i class="fas fa-plus"></i></button>
                    </div>
                    <span class="cart-item-total fw-bold text-dark">
                        Sub: ${formatCurrency(item.price * item.quantity)}
                    </span>
                </div>
            </div>
        </div>
    `
    }).join('');

    updateSummary();
}

// ==========================================
// LÓGICA DE ACTUALIZACIÓN
// ==========================================

function increaseQuantity(index) {
    if (cart[index]) {
        cart[index].quantity += 1;
        saveCart();
        renderCartItems();
    }
}

function decreaseQuantity(index) {
    if (cart[index]) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            saveCart();
            renderCartItems();
        } else {
            removeItem(index);
        }
    }
}

function removeItem(index) {
    if (confirm('¿Eliminar producto?')) {
        cart.splice(index, 1);
        saveCart();
        renderCartItems();
        showNotification('Producto eliminado', 'info');
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = totalItems;
}

// ==========================================
// RESUMEN
// ==========================================

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0;
    const total = subtotal + shipping;

    const subEl = document.getElementById('subtotal');
    const totEl = document.getElementById('totalPrice');

    if (subEl) subEl.textContent = formatCurrency(subtotal);
    if (totEl) totEl.textContent = formatCurrency(total);
}

// ==========================================
// NAVEGACIÓN Y UTILIDADES
// ==========================================

function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    window.location.href = '/finalizar-compra';
}

function showNotification(message, type = 'success') {
    const colors = {success: 'bg-success', error: 'bg-danger', info: 'bg-info', warning: 'bg-warning text-dark'};
    const notification = document.createElement('div');
    notification.className = 'position-fixed top-0 end-0 p-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="toast show align-items-center text-white ${colors[type] || 'bg-primary'} border-0">
            <div class="d-flex"><div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>
        </div>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
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