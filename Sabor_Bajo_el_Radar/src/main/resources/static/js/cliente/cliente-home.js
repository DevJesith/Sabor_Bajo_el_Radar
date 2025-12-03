// Carrito de compras (obtener del localStorage si existe)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Favoritos
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Filtros activos
let activeFilters = {
    locality: '',
    category: 'todos',
    maxPrice: 50,
    minRating: 0,
    hasDiscount: false,
    freeDelivery: false,
    isNew: false,
    searchTerm: ''
};

// Inicializar búsqueda
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('mainSearchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.trim().toLowerCase();

            if (searchTerm.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            const results = vendors.filter(vendor =>
                vendor.name.toLowerCase().includes(searchTerm) ||
                vendor.category.toLowerCase().includes(searchTerm)
            );

            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-no-results">No se encontraron resultados</div>';
            } else {
                searchResults.innerHTML = results.map(vendor => `
                    <div class="search-result-item" onclick='openMenu(${JSON.stringify(vendor).replace(/'/g, "&apos;")})'>
                        <div><h6>${vendor.name}</h6><p class="small text-muted">${vendor.category}</p></div>
                    </div>
                `).join('');
            }

            searchResults.style.display = 'block';
        });

        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    // Inicializar filtros
    initializeFilters();
});

function initializeFilters() {
    // Price range
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function (e) {
            document.getElementById('priceRangeValue').textContent = `S/ ${e.target.value}`;
        });
    }

    // Category filters
    document.querySelectorAll('.category-filter-item').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.category-filter-item').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function applyFilters() {
    const filtersOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('filtersOffcanvas'));
    if (filtersOffcanvas) filtersOffcanvas.hide();
    showNotification('Filtros aplicados', 'success');
}

function clearFilters() {
    document.querySelectorAll('.category-filter-item').forEach((btn, index) => {
        btn.classList.remove('active');
        if (index === 0) btn.classList.add('active');
    });
    document.getElementById('priceRange').value = 50;
    document.getElementById('priceRangeValue').textContent = 'S/ 50';
    showNotification('Filtros limpiados', 'info');
}

// Datos de vendedores simulados
const vendors = [
    {
        id: 1,
        name: 'El Buen Sabor Urbano',
        category: 'Comida Rápida',
        image: 'landscape',
        discount: '20% OFF',
        rating: 4.5,
        menu: [
            {id: 1, name: 'Hamburguesa Clásica', price: 12.90, description: 'Carne, lechuga, tomate, queso'},
            {id: 2, name: 'Hot Dog Especial', price: 8.50, description: 'Salchicha alemana, salsas especiales'},
            {id: 3, name: 'Papas Fritas', price: 5.00, description: 'Papas crujientes con sal'},
        ],
    },
    {
        id: 2,
        name: 'Sabores de la Calle',
        category: 'Comida Criolla',
        image: 'landscape',
        discount: '15% OFF',
        rating: 4.8,
        menu: [
            {id: 4, name: 'Lomo Saltado', price: 18.00, description: 'Carne, tomate, cebolla, papas'},
            {id: 5, name: 'Ají de Gallina', price: 16.50, description: 'Pollo en salsa cremosa'},
            {id: 6, name: 'Arroz con Pollo', price: 14.00, description: 'Arroz verde con pollo jugoso'},
        ],
    },
    {
        id: 3,
        name: 'Rincón Urbano',
        category: 'Desayunos',
        image: 'landscape',
        discount: '10% OFF',
        rating: 4.3,
        menu: [
            {id: 7, name: 'Desayuno Americano', price: 12.00, description: 'Huevos, tocino, pan tostado'},
            {id: 8, name: 'Pancakes', price: 10.00, description: 'Pancakes con miel y frutas'},
            {id: 9, name: 'Café con Leche', price: 4.50, description: 'Café expreso con leche'},
        ],
    },
    {
        id: 4,
        name: 'La Esquina del Sabor',
        category: 'Antojitos',
        image: 'landscape',
        discount: '25% OFF',
        rating: 4.6,
        menu: [
            {id: 10, name: 'Salchipapa Especial', price: 10.00, description: 'Papas y salchichas con salsas'},
            {id: 11, name: 'Choripán', price: 8.00, description: 'Chorizo en pan francés'},
            {id: 12, name: 'Tamales', price: 6.50, description: 'Tamales tradicionales'},
        ],
    },
    {
        id: 5,
        name: 'Dulce Tentación',
        category: 'Postres',
        image: 'landscape',
        discount: '30% OFF',
        rating: 4.9,
        menu: [
            {id: 13, name: 'Torta de Chocolate', price: 8.00, description: 'Torta húmeda de chocolate'},
            {id: 14, name: 'Cheesecake', price: 9.50, description: 'Cheesecake de frutos rojos'},
            {id: 15, name: 'Helado Artesanal', price: 7.00, description: 'Helado cremoso de vainilla'},
        ],
    },
    {
        id: 6,
        name: 'Express Gourmet',
        category: 'Comida Internacional',
        image: 'landscape',
        discount: '20% OFF',
        rating: 4.7,
        menu: [
            {id: 16, name: 'Pizza Margarita', price: 22.00, description: 'Pizza con tomate y albahaca'},
            {id: 17, name: 'Pasta Carbonara', price: 18.50, description: 'Pasta con salsa cremosa'},
            {id: 18, name: 'Ensalada César', price: 12.00, description: 'Lechuga, pollo, crutones'},
        ],
    },
];

// Función para crear tarjeta de vendedor
function createVendorCard(vendor) {
    const isFavorite = favorites.includes(vendor.id);
    return `
        <div class="col-md-2 col-6 mb-4">
            <div class="vendor-card" onclick='openMenu(${JSON.stringify(vendor).replace(/'/g, '&apos;')})'>
                <div class="position-relative">
                    <div class="vendor-image"></div>
                    ${vendor.discount ? `<span class="badge-discount">${vendor.discount}</span>` : ''}
                    <button class="favorite-heart ${isFavorite ? 'favorited' : ''}" 
                            onclick="event.stopPropagation(); toggleFavorite(${vendor.id})"
                            style="position: absolute; top: 10px; right: 10px; background: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 10;">
                        <i class="fas fa-heart" style="color: ${isFavorite ? '#ff6b35' : '#ccc'};"></i>
                    </button>
                </div>
                <div class="p-3">
                    <h6 class="fw-bold mb-1">${vendor.name}</h6>
                    <p class="text-muted small mb-2">${vendor.category}</p>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-star text-warning me-1"></i>
                        <span class="small">${vendor.rating}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para abrir el modal del menú
function openMenu(vendor) {
    document.getElementById('vendorName').textContent = vendor.name;
    document.getElementById('vendorCategory').textContent = vendor.category;

    const menuHTML = vendor.menu.map(item => `
        <div class="modal-product">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <h6 class="fw-bold mb-1">${item.name}</h6>
                    <p class="text-muted small mb-2">${item.description}</p>
                    <p class="fw-bold mb-0 text-primary">S/ ${item.price.toFixed(2)}</p>
                </div>
                <div class="col-md-4 text-end">
                    <button class="btn btn-add-to-cart" onclick='addToCart(${JSON.stringify(item).replace(/'/g, '&apos;')}, "${vendor.name}")'>
                        <i class="fas fa-plus me-1"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('menuItems').innerHTML = menuHTML;

    const modal = new bootstrap.Modal(document.getElementById('menuModal'));
    modal.show();
}

// Función para agregar al carrito
function addToCart(item, vendorName) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            vendorName: vendorName,
            quantity: 1
        });
    }

    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCart();

    // Mostrar notificación
    showNotification(`${item.name} agregado al carrito`);
}

// Función para actualizar el carrito
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Actualizar items del carrito
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-muted text-center">Tu carrito está vacío</p>';
        cartTotal.textContent = 'S/ 0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 class="mb-0 fw-bold">${item.name}</h6>
                    <small class="text-muted">${item.vendorName}</small>
                </div>
                <i class="fas fa-trash btn-remove" onclick="removeFromCart(${item.id})"></i>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div class="cart-item-quantity">
                    <button onclick="decreaseQuantity(${item.id})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="fw-bold">${item.quantity}</span>
                    <button onclick="increaseQuantity(${item.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <span class="fw-bold text-primary">S/ ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        </div>
    `).join('');

    // Actualizar total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `S/ ${total.toFixed(2)}`;
}

// Función para aumentar cantidad
function increaseQuantity(itemId) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

// Función para disminuir cantidad
function decreaseQuantity(itemId) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

// Función para eliminar del carrito
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showNotification('Item eliminado del carrito');
}

// Función para proceder al pago
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Procediendo al pago. Total: S/ ${total.toFixed(2)}`);

    // Aquí puedes redirigir a una página de checkout
    // window.location.href = 'checkout.html';
}

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'position-fixed top-0 end-0 p-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-body bg-success text-white rounded">
                <i class="fas fa-check-circle me-2"></i>${message}
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Eliminar después de 2 segundos
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Función para hacer scroll horizontal
function scrollSection(sectionId, direction) {
    const section = document.getElementById(sectionId).parentElement;
    const scrollAmount = 300;

    if (direction === 'left') {
        section.scrollBy({left: -scrollAmount, behavior: 'smooth'});
    } else {
        section.scrollBy({left: scrollAmount, behavior: 'smooth'});
    }
}

// Renderizar vendedores en las secciones
const allVendors = [...vendors, ...vendors]; // Duplicamos para tener más items
document.getElementById('recommendedVendors').innerHTML = allVendors.map(createVendorCard).join('');
document.getElementById('promotionVendors').innerHTML = allVendors.map(createVendorCard).join('');
document.getElementById('breakfastVendors').innerHTML = allVendors.map(createVendorCard).join('');
document.getElementById('dessertVendors').innerHTML = allVendors.map(createVendorCard).join('');

// Inicializar carrito vacío al cargar la página
updateCart();

// Toggle favorito
function toggleFavorite(vendorId) {
    const index = favorites.indexOf(vendorId);

    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('Eliminado de favoritos', 'info');
    } else {
        favorites.push(vendorId);
        showNotification('Agregado a favoritos', 'success');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Re-renderizar tarjetas
    const allVendors = [...vendors, ...vendors];
    document.getElementById('recommendedVendors').innerHTML = allVendors.map(createVendorCard).join('');
    document.getElementById('promotionVendors').innerHTML = allVendors.map(createVendorCard).join('');
    document.getElementById('breakfastVendors').innerHTML = allVendors.map(createVendorCard).join('');
    document.getElementById('dessertVendors').innerHTML = allVendors.map(createVendorCard).join('');
}

// Mostrar notificación con diferentes tipos
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
    }, 2000);
}

// Agregar link al botón "Ver Carrito" en el offcanvas
document.addEventListener('DOMContentLoaded', function () {
    // Puedes agregar el botón de ver carrito aquí si lo necesitas
});