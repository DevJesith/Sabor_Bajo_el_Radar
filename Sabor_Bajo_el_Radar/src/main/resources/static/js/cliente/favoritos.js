// Obtener favoritos del localStorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Vendors de ejemplo para demostración
const allVendors = [
    {
        id: 1,
        name: 'El Buen Sabor Urbano',
        category: 'Comida Rápida',
        image: 'landscape',
        discount: '20% OFF',
        rating: 4.5,
        totalOrders: 127,
        deliveryTime: '25-35 min'
    },
    {
        id: 2,
        name: 'Sabores de la Calle',
        category: 'Comida Criolla',
        image: 'landscape',
        discount: '15% OFF',
        rating: 4.8,
        totalOrders: 203,
        deliveryTime: '30-40 min'
    },
    {
        id: 3,
        name: 'Rincón Urbano',
        category: 'Desayunos',
        image: 'landscape',
        discount: '10% OFF',
        rating: 4.3,
        totalOrders: 89,
        deliveryTime: '20-30 min'
    },
    {
        id: 4,
        name: 'La Esquina del Sabor',
        category: 'Antojitos',
        image: 'landscape',
        discount: '25% OFF',
        rating: 4.6,
        totalOrders: 156,
        deliveryTime: '15-25 min'
    },
    {
        id: 5,
        name: 'Dulce Tentación',
        category: 'Postres',
        image: 'landscape',
        discount: '30% OFF',
        rating: 4.9,
        totalOrders: 342,
        deliveryTime: '20-30 min'
    },
    {
        id: 6,
        name: 'Express Gourmet',
        category: 'Comida Internacional',
        image: 'landscape',
        discount: '20% OFF',
        rating: 4.7,
        totalOrders: 178,
        deliveryTime: '35-45 min'
    }
];

// Inicializar favoritos de ejemplo si está vacío
if (favorites.length === 0) {
    favorites = [1, 2, 5]; // IDs de vendors favoritos
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Actualizar contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Actualizar estadísticas
function updateStats() {
    const favoriteVendors = allVendors.filter(v => favorites.includes(v.id));
    const categories = [...new Set(favoriteVendors.map(v => v.category))];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    document.getElementById('totalFavorites').textContent = favorites.length;
    document.getElementById('totalCategories').textContent = categories.length;
    document.getElementById('totalOrders').textContent = orders.length;
}

// Renderizar favoritos
function renderFavorites(categoryFilter = 'todos') {
    const favoritesList = document.getElementById('favoritesList');
    const emptyState = document.getElementById('emptyState');

    // Obtener vendors favoritos
    let favoriteVendors = allVendors.filter(v => favorites.includes(v.id));

    // Filtrar por categoría
    if (categoryFilter !== 'todos') {
        favoriteVendors = favoriteVendors.filter(v => v.category === categoryFilter);
    }

    // Mostrar estado vacío si no hay favoritos
    if (favoriteVendors.length === 0) {
        favoritesList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // Renderizar cards
    favoritesList.innerHTML = favoriteVendors.map(vendor => `
        <div class="col-md-4 col-sm-6 mb-4">
            <div class="favorite-card" onclick="openVendor(${vendor.id})">
                <div class="favorite-image-container">
                    <div class="favorite-image"></div>
                    ${vendor.discount ? `<span class="badge-discount">${vendor.discount}</span>` : ''}
                    <button class="favorite-heart favorited" onclick="event.stopPropagation(); toggleFavorite(${vendor.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="favorite-info">
                    <div class="favorite-header">
                        <h5 class="favorite-name">${vendor.name}</h5>
                    </div>
                    <p class="favorite-category">${vendor.category}</p>
                    <div class="favorite-rating">
                        <i class="fas fa-star"></i>
                        <span>${vendor.rating}</span>
                        <span class="text-muted">(${vendor.totalOrders} pedidos)</span>
                    </div>
                    <div class="favorite-stats">
                        <span>
                            <i class="fas fa-clock"></i>
                            ${vendor.deliveryTime}
                        </span>
                        <span>
                            <i class="fas fa-motorcycle"></i>
                            Envío gratis
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle favorito
function toggleFavorite(vendorId) {
    const index = favorites.indexOf(vendorId);

    if (index > -1) {
        // Remover de favoritos
        favorites.splice(index, 1);
        showNotification('Eliminado de favoritos', 'info');
    } else {
        // Agregar a favoritos
        favorites.push(vendorId);
        showNotification('Agregado a favoritos', 'success');
    }

    // Guardar en localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Actualizar vista
    updateStats();

    // Re-renderizar solo si estamos en la página de favoritos
    const activeFilter = document.querySelector('.category-filter-btn.active');
    if (activeFilter) {
        renderFavorites(activeFilter.getAttribute('data-category'));
    }
}

// Abrir vendor
function openVendor(vendorId) {
    // Redirigir al home y abrir el modal del vendor
    window.location.href = `cliente-home.html?vendor=${vendorId}`;
}

// Buscar en favoritos
document.querySelector('.search-input').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const favoriteCards = document.querySelectorAll('.favorite-card');

    favoriteCards.forEach(card => {
        const name = card.querySelector('.favorite-name').textContent.toLowerCase();
        const category = card.querySelector('.favorite-category').textContent.toLowerCase();

        if (name.includes(searchTerm) || category.includes(searchTerm)) {
            card.parentElement.style.display = 'block';
        } else {
            card.parentElement.style.display = 'none';
        }
    });
});

// Mostrar notificación
function showNotification(message, type = 'success') {
    const colors = {
        success: 'bg-success',
        error: 'bg-danger',
        info: 'bg-info'
    };

    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };

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

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    updateStats();
    renderFavorites();

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
});