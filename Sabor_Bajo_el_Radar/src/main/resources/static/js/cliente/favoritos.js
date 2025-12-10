// ==========================================
// VARIABLES GLOBALES
// ==========================================

// Formateador de moneda
const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

// IDs de favoritos (localStorage)
let favoritesIds = JSON.parse(localStorage.getItem('favorites')) || [];

// Carrito (localStorage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Datos reales de los negocios (se llenará desde el backend)
let allVendors = [];

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount(); // Actualizar badge del carrito
    cargarFavoritosBackend(); // Cargar datos reales
    cargarDatosUsuario();

    // Configurar buscador
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            filtrarFavoritosVisualmente(searchTerm);
        });
    }

    // Filtros de categoría
    const categoryButtons = document.querySelectorAll('.category-filter-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            renderFavorites(category);
        });
    });

    // --- LÓGICA DEL CARRITO LATERAL ---
    // Listener para renderizar el carrito cuando se abre la barra lateral
    const cartOffcanvas = document.getElementById('cartOffcanvas');
    if (cartOffcanvas) {
        cartOffcanvas.addEventListener('show.bs.offcanvas', renderCartSidebar);
    }
});

// ==========================================
// LÓGICA DE BACKEND (FAVORITOS)
// ==========================================

async function cargarFavoritosBackend() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '<div class="w-100 text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';

    try {
        // Reutilizamos el endpoint del home para obtener la info actualizada de los negocios
        const response = await fetch('/api/cliente/home/negocios');

        if (!response.ok) throw new Error('Error al cargar datos');

        allVendors = await response.json();

        // Actualizamos estadísticas y renderizamos
        updateStats();
        renderFavorites();

    } catch (error) {
        console.error(error);
        favoritesList.innerHTML = '<div class="col-12 text-center text-muted">No se pudo cargar la información de los favoritos.</div>';
    }
}

// ==========================================
// RENDERIZADO (FAVORITOS)
// ==========================================

function renderFavorites(categoryFilter = 'todos') {
    const favoritesList = document.getElementById('favoritesList');
    const emptyState = document.getElementById('emptyState');

    // 1. Filtrar solo los que están en favoritos
    let favoriteVendors = allVendors.filter(v => favoritesIds.includes(v.id));

    // 2. Filtrar por categoría seleccionada
    if (categoryFilter !== 'todos') {
        favoriteVendors = favoriteVendors.filter(v => v.category === categoryFilter);
    }

    // Mostrar estado vacío si no hay favoritos
    if (favoriteVendors.length === 0) {
        favoritesList.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Renderizar cards
    favoritesList.innerHTML = favoriteVendors.map(vendor => {
        let imageSrc = vendor.image;
        if (!imageSrc || imageSrc.trim() === '') {
            imageSrc = 'https://via.placeholder.com/300x200/ff6b35/ffffff?text=' + encodeURIComponent(vendor.name);
        }

        const deliveryTime = "30-45 min";

        return `
        <div class="col-md-4 col-sm-6 mb-4 favorite-card-item">
            <div class="favorite-card" onclick="irAlHomeConVendor(${vendor.id})" style="cursor: pointer;">
                <div class="favorite-image-container">
                    <img src="${imageSrc}" class="favorite-image" alt="${vendor.name}">
                    ${vendor.discount ? `<span class="badge-discount">${vendor.discount}</span>` : ''}
                    <button class="favorite-heart favorited" onclick="event.stopPropagation(); toggleFavorite(${vendor.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="favorite-info">
                    <div class="favorite-header">
                        <h5 class="favorite-name text-truncate">${vendor.name}</h5>
                    </div>
                    <div class="mb-2">
                        <span class="badge bg-danger rounded-pill">${vendor.category}</span>
                    </div>
                    <div class="favorite-rating mb-2">
                        <i class="fas fa-star text-warning"></i>
                        <span>${vendor.rating}</span>
                        <span class="text-muted ms-1 small"><i class="fas fa-map-marker-alt ms-2 me-1"></i>${vendor.location || 'Bogotá'}</span>
                    </div>
                    <div class="favorite-stats">
                        <span><i class="fas fa-clock"></i> ${deliveryTime}</span>
                        <span class="text-success"><i class="fas fa-motorcycle"></i> Envío gratis</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// ==========================================
// FUNCIONALIDAD FAVORITOS
// ==========================================

function toggleFavorite(vendorId) {
    const index = favoritesIds.indexOf(vendorId);

    if (index > -1) {
        favoritesIds.splice(index, 1);
        showNotification('Eliminado de favoritos', 'info');
    } else {
        favoritesIds.push(vendorId);
        showNotification('Agregado a favoritos', 'success');
    }

    localStorage.setItem('favorites', JSON.stringify(favoritesIds));
    updateStats();

    const activeFilterBtn = document.querySelector('.category-filter-btn.active');
    const category = activeFilterBtn ? activeFilterBtn.getAttribute('data-category') : 'todos';
    renderFavorites(category);
}

function updateStats() {
    const favoriteVendors = allVendors.filter(v => favoritesIds.includes(v.id));
    const categories = [...new Set(favoriteVendors.map(v => v.category))];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    document.getElementById('totalFavorites').textContent = favoritesIds.length;
    document.getElementById('totalCategories').textContent = categories.length;
    document.getElementById('totalOrders').textContent = orders.length;
}

function irAlHomeConVendor(vendorId) {
    window.location.href = '/cliente';
}

function filtrarFavoritosVisualmente(searchTerm) {
    const cards = document.querySelectorAll('.favorite-card-item');
    cards.forEach(card => {
        const name = card.querySelector('.favorite-name').textContent.toLowerCase();
        const category = card.querySelector('.badge').textContent.toLowerCase();
        card.style.display = (name.includes(searchTerm) || category.includes(searchTerm)) ? 'block' : 'none';
    });
}

// ==========================================
// LÓGICA DEL CARRITO LATERAL (AGREGADA)
// ==========================================

function renderCartSidebar() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItems || !cartTotal) return;

    // Recargar carrito actualizado
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-basket mb-3 text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted">Tu carrito está vacío</p>
                <a href="/cliente" class="btn btn-outline-primary btn-sm rounded-pill">Ir al menú</a>
            </div>`;
        cartTotal.textContent = formatCurrency(0);
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const identificadorUnico = item._uniqueId || item.id;
        return `
        <div class="cart-item mb-3 p-2 border-bottom">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 class="mb-0 fw-bold text-dark" style="font-size: 0.95rem;">${item.name}</h6>
                    <small class="text-muted" style="font-size: 0.8rem;">${item.vendorName || 'Restaurante'}</small>
                </div>
                <i class="fas fa-trash text-danger" style="cursor: pointer;" onclick="removeFromCart('${identificadorUnico}')"></i>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div class="input-group input-group-sm" style="width: 90px;">
                    <button class="btn btn-outline-secondary" type="button" onclick="decreaseQuantity('${identificadorUnico}')">-</button>
                    <span class="input-group-text bg-white border-secondary text-center" style="width: 30px; justify-content: center;">${item.quantity}</span>
                    <button class="btn btn-outline-secondary" type="button" onclick="increaseQuantity('${identificadorUnico}')">+</button>
                </div>
                <span class="fw-bold text-primary">${formatCurrency(item.price * item.quantity)}</span>
            </div>
        </div>
    `
    }).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatCurrency(total);
}

function increaseQuantity(identifier) {
    const item = cart.find(item => (item._uniqueId || item.id).toString() === identifier.toString());
    if (item) {
        item.quantity += 1;
        saveAndUpdate();
    }
}

function decreaseQuantity(identifier) {
    const item = cart.find(item => (item._uniqueId || item.id).toString() === identifier.toString());
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveAndUpdate();
    }
}

function removeFromCart(identifier) {
    cart = cart.filter(item => {
        const itemId = (item._uniqueId || item.id).toString();
        return itemId !== identifier.toString();
    });
    saveAndUpdate();
}

function saveAndUpdate() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartSidebar();
}

function checkout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }
    window.location.href = '/finalizar-compra';
}

// ==========================================
// UTILIDADES COMUNES
// ==========================================

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = totalItems;
}

function showNotification(message, type = 'success') {
    const colors = {success: 'bg-success', error: 'bg-danger', info: 'bg-info'};
    const icons = {success: 'check-circle', error: 'exclamation-circle', info: 'info-circle'};
    const bgColor = colors[type] || colors.success;
    const icon = icons[type] || icons.success;

    const notification = document.createElement('div');
    notification.className = 'position-fixed top-0 end-0 p-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-body ${bgColor} text-white rounded">
                <i class="fas fa-${icon} me-2"></i>${message}
            </div>
        </div>
    `;
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