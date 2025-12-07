// ==========================================
// VARIABLES GLOBALES
// ==========================================

// Formateador de moneda (Igual que en home)
const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

// Obtener IDs de favoritos del localStorage
let favoritesIds = JSON.parse(localStorage.getItem('favorites')) || [];

// Aquí guardaremos los datos reales traídos del backend
let allVendors = [];

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    cargarFavoritosBackend(); // <--- Cargar datos reales

    // Configurar el buscador
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
});

// ==========================================
// LÓGICA DE BACKEND
// ==========================================

async function cargarFavoritosBackend() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '<div class="w-100 text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';

    try {
        // Reutilizamos el endpoint del home para obtener la info actualizada de los negocios
        const response = await fetch('/api/cliente/home/negocios');

        if (!response.ok) throw new Error('Error al cargar datos');

        allVendors = await response.json();

        updateStats();
        renderFavorites();

    } catch (error) {
        console.error(error);
        favoritesList.innerHTML = '<div class="col-12 text-center text-muted">No se pudo cargar la información de los favoritos.</div>';
    }
}

// ==========================================
// RENDERIZADO
// ==========================================

function renderFavorites(categoryFilter = 'todos') {
    const favoritesList = document.getElementById('favoritesList');
    const emptyState = document.getElementById('emptyState');

    // 1. Filtrar los negocios que están en la lista de IDs guardados en localStorage
    let favoriteVendors = allVendors.filter(v => favoritesIds.includes(v.id));

    // 2. Filtrar por categoría seleccionada
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
    favoritesList.innerHTML = favoriteVendors.map(vendor => {
        // Manejo de imagen
        let imageSrc = vendor.image;
        if (!imageSrc || imageSrc.trim() === '') {
            imageSrc = 'https://via.placeholder.com/300x200/ff6b35/ffffff?text=' + encodeURIComponent(vendor.name);
        }

        // Datos simulados para completar la tarjeta visualmente (ya que el backend aún no los manda todos)
        const deliveryTime = "30-45 min";

        // String seguro para redirección
        const vendorString = JSON.stringify(vendor).replace(/'/g, "&apos;").replace(/"/g, "&quot;");

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
                        <span>
                            <i class="fas fa-clock"></i>
                            ${deliveryTime}
                        </span>
                        <span class="text-success">
                            <i class="fas fa-motorcycle"></i>
                            Envío gratis
                        </span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// ==========================================
// FUNCIONALIDAD
// ==========================================

function toggleFavorite(vendorId) {
    const index = favoritesIds.indexOf(vendorId);

    if (index > -1) {
        // Remover de favoritos
        favoritesIds.splice(index, 1);
        showNotification('Eliminado de favoritos', 'info');
    } else {
        // Agregar a favoritos (por si acaso, aunque en esta pantalla usualmente se quitan)
        favoritesIds.push(vendorId);
        showNotification('Agregado a favoritos', 'success');
    }

    // Guardar en localStorage
    localStorage.setItem('favorites', JSON.stringify(favoritesIds));

    // Actualizar estadísticas y vista
    updateStats();

    // Re-renderizar respetando el filtro actual
    const activeFilter = document.querySelector('.category-filter-btn.active');
    const category = activeFilter ? activeFilter.getAttribute('data-category') : 'todos';
    renderFavorites(category);
}

function updateStats() {
    // Calculamos estadísticas basadas en los favoritos reales
    const favoriteVendors = allVendors.filter(v => favoritesIds.includes(v.id));
    const categories = [...new Set(favoriteVendors.map(v => v.category))];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    document.getElementById('totalFavorites').textContent = favoritesIds.length;
    document.getElementById('totalCategories').textContent = categories.length;
    document.getElementById('totalOrders').textContent = orders.length;
}

// Redirigir al usuario al home (ya que el modal de menú está allá)
function irAlHomeConVendor(vendorId) {
    // Podrías implementar lógica para abrir el modal automáticamente al llegar al home
    // Por ahora, redirigimos simple
    window.location.href = '/cliente';
}

function filtrarFavoritosVisualmente(searchTerm) {
    const cards = document.querySelectorAll('.favorite-card-item');
    let visibleCount = 0;

    cards.forEach(card => {
        const name = card.querySelector('.favorite-name').textContent.toLowerCase();
        const category = card.querySelector('.badge').textContent.toLowerCase();

        if (name.includes(searchTerm) || category.includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const emptyState = document.getElementById('emptyState');
    if (visibleCount === 0 && cards.length > 0) {
        // Si hay cartas pero ninguna coincide con la búsqueda
        // Opcional: mostrar mensaje de "no coincidencias"
    }
}

// ==========================================
// UTILIDADES
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