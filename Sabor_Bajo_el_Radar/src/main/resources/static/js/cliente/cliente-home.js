// ==========================================
// VARIABLES GLOBALES
// ==========================================

// Formateador de moneda Colombiana (COP)
const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};


// Carrito de compras (obtener del localStorage si existe)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Favoritos
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Lista de vendedores (Ahora se llenará desde el Backend)
let vendors = [];

// Filtros activos
let activeFilters = {
    locality: '',
    category: 'todos',
    maxPrice: 130000,
    minRating: 0,
    hasDiscount: false,
    freeDelivery: false,
    isNew: false,
    searchTerm: ''
};

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    // 1. Cargar datos del usuario (Nombre en Navbar)
    cargarDatosUsuario();

    // 2. Cargar los negocios desde el Backend
    cargarNegociosBackend();

    // 3. Inicializar lógica del buscador
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
                // Escapamos comillas para evitar errores en el onclick
                searchResults.innerHTML = results.map(vendor => `
                    <div class="search-result-item" onclick='openMenu(${JSON.stringify(vendor).replace(/'/g, "&apos;")})'>
                        <div><h6>${vendor.name}</h6><p class="small text-muted">${vendor.category}</p></div>
                    </div>
                `).join('');
            }

            searchResults.style.display = 'block';
        });

        // Cerrar resultados al hacer click fuera
        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    // 4. Inicializar listeners de filtros
    initializeFilters();
    updateCartCount(); // Actualizar contador del carrito visual
});

// ==========================================
// LÓGICA DE CONEXIÓN CON BACKEND
// ==========================================

async function cargarNegociosBackend() {
    // Poner loaders en las secciones mientras carga
    const sections = ['recommendedVendors', 'promotionVendors', 'breakfastVendors', 'dessertVendors'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<div class="w-100 text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    });

    try {
        // Petición al endpoint creado en el Backend
        const response = await fetch('/api/cliente/home/negocios');

        if (!response.ok) {
            throw new Error('Error al obtener datos del servidor');
        }

        // Guardamos los datos reales en la variable global
        vendors = await response.json();

        // Renderizamos las tarjetas en el HTML
        renderizarSecciones();

    } catch (error) {
        console.error("Error cargando negocios:", error);
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '<p class="text-center text-muted w-100">No se pudieron cargar los restaurantes. Intenta más tarde.</p>';
        });
    }
}

function renderizarSecciones() {
    if (vendors.length === 0) {
        // Manejar caso sin datos
        return;
    }

    // --- LÓGICA DE VISUALIZACIÓN ---

    // 1. Recomendados: Mostramos todos
    const displayVendors = vendors.length < 4 ? [...vendors, ...vendors] : vendors;

    const recContainer = document.getElementById('recommendedVendors');
    if (recContainer) {
        recContainer.innerHTML = displayVendors.map(createVendorCard).join('');
    }

    // 2. Promociones
    const promoContainer = document.getElementById('promotionVendors');
    if (promoContainer) {
        promoContainer.innerHTML = displayVendors.map(createVendorCard).join('');
    }

    // 3. Desayunos
    const breakfastContainer = document.getElementById('breakfastVendors');
    if (breakfastContainer) {
        const desayunos = vendors.filter(v => v.category.toLowerCase().includes('desayuno'));
        breakfastContainer.innerHTML = desayunos.length > 0
            ? desayunos.map(createVendorCard).join('')
            : '<p class="text-muted text-center w-100 p-3">No hay puestos de desayunos disponibles.</p>';
    }

    // 4. Postres
    const dessertContainer = document.getElementById('dessertVendors');
    if (dessertContainer) {
        const postres = vendors.filter(v => v.category.toLowerCase().includes('postre'));
        dessertContainer.innerHTML = postres.length > 0
            ? postres.map(createVendorCard).join('')
            : '<p class="text-muted text-center w-100 p-3">No hay puestos de postres disponibles.</p>';
    }
}

// Función para crear el HTML de la tarjeta (Card)
function createVendorCard(vendor) {
    const isFavorite = favorites.includes(vendor.id);

    // Manejo de imagen
    let imageSrc = vendor.image;
    if (!imageSrc || imageSrc.trim() === '') {
        imageSrc = 'https://via.placeholder.com/300x200/ff6b35/ffffff?text=' + encodeURIComponent(vendor.name);
    }

    // String seguro para el onclick
    const vendorString = JSON.stringify(vendor).replace(/'/g, "&apos;").replace(/"/g, "&quot;");

    return `
        <div class="col-md-3 col-sm-6 mb-4">
            <div class="vendor-card h-100 shadow-sm" onclick='openMenu(${vendorString})' style="cursor: pointer; background: white; border-radius: 15px; overflow: hidden;">
                <div class="position-relative">
                    <img src="${imageSrc}" class="card-img-top" alt="${vendor.name}" style="width: 100%; height: 160px; object-fit: cover;">
                    ${vendor.discount ? `<span class="badge-discount" style="position: absolute; top: 10px; left: 10px; background: #ff6b35; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">${vendor.discount}</span>` : ''}
                    <button class="favorite-heart" 
                            onclick="event.stopPropagation(); toggleFavorite(${vendor.id})"
                            style="position: absolute; top: 10px; right: 10px; background: white; border: none; width: 32px; height: 32px; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); display:flex; justify-content:center; align-items:center; transition: transform 0.2s;">
                        <i class="fas fa-heart" style="color: ${isFavorite ? '#ff6b35' : '#ccc'}; font-size: 16px;"></i>
                    </button>
                </div>
                <div class="card-body p-3">
                    <h5 class="card-title fw-bold mb-2 text-dark" style="font-size: 1.1rem;">${vendor.name}</h5>
                    <div class="mb-2">
                        <span class="badge rounded-pill bg-danger" style="font-weight: 500; padding: 0.5em 0.8em;">
                            ${vendor.category}
                        </span>
                    </div>
                    <p class="card-text text-muted small mb-0">
                        <i class="fas fa-map-marker-alt me-1 text-secondary"></i> 
                        ${vendor.location || 'Ubicación no disponible'}
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Función para abrir el modal del menú
// Función para abrir el modal del menú (CORREGIDA - Sin duplicados)
function openMenu(vendorInput) {
    let vendor = vendorInput;
    if (typeof vendorInput === 'string') {
        try {
            vendor = JSON.parse(vendorInput);
        } catch (e) {
            console.error(e);
            return;
        }
    }

    document.getElementById('vendorName').textContent = vendor.name;
    document.getElementById('vendorCategory').textContent = vendor.category;
    const menuContainer = document.getElementById('menuItems');

    // Preparar contenido HTML
    let contentHTML = '';

    // 1. RENDERIZAR COMBOS (Si existen)
    if (vendor.combos && vendor.combos.length > 0) {

        // Generamos PRIMERO el HTML de las tarjetas en una variable temporal
        const combosCardsHTML = vendor.combos.map(combo => {
            const itemParaCarrito = {
                id: combo.productId,
                offerId: combo.id,
                name: combo.name,
                price: combo.price,
                image: combo.image,
                isCombo: true
            };
            // ID único local para el carrito
            itemParaCarrito._uniqueId = 'COMBO-' + combo.id;

            const safeItem = encodeURIComponent(JSON.stringify(itemParaCarrito));
            const safeVendorName = encodeURIComponent(vendor.name);

            return `
            <div class="modal-product border-success bg-light mb-3" style="border-width: 1px; border-style: solid;">
                <div class="row align-items-center">
                    <div class="col-8">
                        <div class="d-flex align-items-center mb-1">
                            <span class="badge bg-success me-2">OFERTA</span>
                            <h6 class="fw-bold mb-0 text-success">${combo.name}</h6>
                        </div>
                        <p class="text-muted small mb-2 fst-italic">"${combo.description}"</p>
                        <p class="fw-bold mb-0 text-success fs-5">${formatCurrency(combo.price)}</p>
                    </div>
                    <div class="col-4 text-end">
                        <button class="btn btn-success btn-sm rounded-pill px-3" 
                                onclick="addToCartWrapper('${safeItem}', '${safeVendorName}')">
                            <i class="fas fa-plus me-1"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');

        // AHORA construimos el bloque en el orden correcto:
        // 1. Título -> 2. Tarjetas -> 3. Línea separadora
        contentHTML += `<h6 class="mb-3 mt-2 fw-bold text-success"><i class="fas fa-tags me-2"></i>Combos y Promociones</h6>`;
        contentHTML += combosCardsHTML;
        contentHTML += `<hr class="my-4">`;
    }

    // 2. RENDERIZAR MENÚ NORMAL
    if (!vendor.menu || vendor.menu.length === 0) {
        // Solo mostramos mensaje de "vacío" si tampoco hay combos
        if (!vendor.combos || vendor.combos.length === 0) {
            contentHTML += `
                <div class="text-center py-5">
                    <i class="fas fa-utensils text-muted fs-1 mb-3"></i>
                    <p class="text-muted">Este puesto aún no ha publicado productos.</p>
                </div>`;
        }
    } else {
        contentHTML += `<h6 class="mb-3 fw-bold text-dark"><i class="fas fa-list me-2"></i>Menú</h6>`;

        contentHTML += vendor.menu.map(item => {
            const safeItem = encodeURIComponent(JSON.stringify(item));
            const safeVendorName = encodeURIComponent(vendor.name);
            return `
            <div class="modal-product">
                <div class="row align-items-center">
                    <div class="col-8">
                        <h6 class="fw-bold mb-1">${item.name}</h6>
                        <p class="text-muted small mb-2 text-truncate">${item.description || 'Sin descripción'}</p>
                        <p class="fw-bold mb-0 text-primary">${formatCurrency(item.price)}</p>
                    </div>
                    <div class="col-4 text-end">
                        <button class="btn btn-outline-primary btn-sm rounded-pill px-3" 
                                onclick="addToCartWrapper('${safeItem}', '${safeVendorName}')">
                            <i class="fas fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }

    menuContainer.innerHTML = contentHTML;
    const modal = new bootstrap.Modal(document.getElementById('menuModal'));
    modal.show();
}

// Wrapper para decodificar
function addToCartWrapper(encodedItem, encodedVendorName) {
    try {
        const item = JSON.parse(decodeURIComponent(encodedItem));
        const vendorName = decodeURIComponent(encodedVendorName);
        addToCart(item, vendorName);
    } catch (e) {
        console.error("Error al agregar al carrito:", e);
        showNotification("Error al agregar producto", "error");
    }
}

// ==========================================
// FILTROS
// ==========================================

function initializeFilters() {
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.min = 0;
        priceRange.max = 100000;
        priceRange.step = 2000;
        priceRange.value = 20000;
        document.getElementById('priceRangeValue').textContent = formatCurrency(priceRange.value);

        priceRange.addEventListener('input', function (e) {
            document.getElementById('priceRangeValue').textContent = formatCurrency(e.target.value);
        });
    }

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
    showNotification('Filtros aplicados (Simulado)', 'success');
}

function clearFilters() {
    document.querySelectorAll('.category-filter-item').forEach((btn, index) => {
        btn.classList.remove('active');
        if (index === 0) btn.classList.add('active');
    });
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.value = 50;
        document.getElementById('priceRangeValue').textContent = 'S/ 50';
    }
    showNotification('Filtros limpiados', 'info');
}

// ==========================================
// CARRITO DE COMPRAS (CORREGIDO)
// ==========================================

function addToCart(item, vendorName) {

    // Usamos _uniqueId si existe (combo), sino el id normal (producto)
    const cartId = item._uniqueId || item.id;

    // Buscamos si ya existe usando el ID compuesto
    const existingItem = cart.find(cartItem => (cartItem._uniqueId || cartItem.id) === cartId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // IMPORTANTE: No guardamos item.image para evitar QuotaExceededError
        cart.push({
            id: item.id,
            offerId: item.offerId,
            _uniqueId: cartId,
            name: item.name,
            price: item.price,
            vendorName: vendorName,
            quantity: 1
            // image: item.image // OMITIDO INTENCIONALMENTE
        });
    }

    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCart();
        showNotification(`${item.name} agregado al carrito`);
    } catch (e) {
        console.error("Error storage:", e);
        showNotification("El carrito está lleno. Intenta borrar algunos items.", "error");
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Si no estamos en la vista con el offcanvas, salir
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-muted text-center py-4">Tu carrito está vacío</p>';
        if (cartTotal) cartTotal.textContent = formatCurrency(0);
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        // --- CORRECCIÓN CLAVE AQUÍ ---
        const identificadorUnico = item._uniqueId || item.id;

        return `
        <div class="cart-item">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 class="mb-0 fw-bold">${item.name}</h6>
                    <small class="text-muted">${item.vendorName}</small>
                </div>
                <!-- Usamos comillas simples para pasar el string del ID -->
                <i class="fas fa-trash btn-remove" onclick="removeFromCart('${identificadorUnico}')"></i>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div class="cart-item-quantity">
                    <button onclick="decreaseQuantity('${identificadorUnico}')"><i class="fas fa-minus"></i></button>
                    <span class="fw-bold">${item.quantity}</span>
                    <button onclick="increaseQuantity('${identificadorUnico}')"><i class="fas fa-plus"></i></button>
                </div>
                <span class="fw-bold text-primary">${formatCurrency(item.price * item.quantity)}</span>
            </div>
        </div>
    `
    }).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = formatCurrency(total);
}

function increaseQuantity(identifier) {
    const item = cart.find(item => (item._uniqueId || item.id).toString() === identifier.toString());
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCart();
    }
}

function decreaseQuantity(identifier) {
    const item = cart.find(item => (item._uniqueId || item.id).toString() === identifier.toString());
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCart();
    }
}

function removeFromCart(identifier) {
    // Filtramos comparando contra _uniqueId (si existe) o contra id
    cart = cart.filter(item => {
        const itemId = (item._uniqueId || item.id).toString();
        return itemId !== identifier.toString();
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCart();
    showNotification('Item eliminado del carrito', 'info');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        return;
    }
    window.location.href = '/finalizar-compra';
}

// ==========================================
// FAVORITOS
// ==========================================

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
    renderizarSecciones();
}

// ==========================================
// UTILIDADES
// ==========================================

function scrollSection(sectionId, direction) {
    const section = document.getElementById(sectionId).parentElement;
    const scrollAmount = 300;

    if (direction === 'left') {
        section.scrollBy({left: -scrollAmount, behavior: 'smooth'});
    } else {
        section.scrollBy({left: scrollAmount, behavior: 'smooth'});
    }
}

function showNotification(message, type = 'success') {
    const colors = {
        success: 'bg-success',
        error: 'bg-danger',
        info: 'bg-info',
        warning: 'bg-warning text-dark'
    };
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };

    const bgColor = colors[type] || colors.success;
    const icon = icons[type] || icons.success;

    const notification = document.createElement('div');
    notification.className = 'position-fixed top-0 end-0 p-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="toast show align-items-center text-white ${bgColor} border-0">
            <div class="d-flex"><div class="toast-body"><i class="fas fa-${icon} me-2"></i>${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>
        </div>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
}

async function cargarDatosUsuario() {
    try {
        const response = await fetch('/api/perfil-cliente');
        if (!response.ok) return;

        const usuario = await response.json();
        const userSpans = document.querySelectorAll('.dropdown-toggle .d-none.d-lg-inline');
        const userPerfil = document.querySelectorAll('.text-white .mb-1');


        if (usuario && usuario.nombres) {
            userSpans.forEach(span => {
                span.textContent = `Hola, ${usuario.nombres.split(' ')[0]}`;
            });
        }

        if (usuario && usuario.nombres) {
            userPerfil.forEach(span => {
                span.textContent = `Hola, ${usuario.nombres.split(' ')[0]}`;
            });
        }


    } catch (error) {
        console.log("Usuario no autenticado");
    }
}