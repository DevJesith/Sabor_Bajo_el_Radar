// Obtener carrito del localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Actualizar contador del carrito en el navbar
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Renderizar items del carrito
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsPage');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos desde nuestro menú</p>
                <a href="cliente-home.html" class="btn btn-primary btn-lg">
                    <i class="fas fa-utensils me-2"></i>Ver menú
                </a>
            </div>
        `;
        updateSummary();
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item-page">
            <img src="https://via.placeholder.com/80x80/ff6b35/FFFFFF?text=${encodeURIComponent(item.name.substring(0, 1))}" 
                 alt="${item.name}" 
                 class="cart-item-image">
            <div class="cart-item-details">
                <h5 class="cart-item-name">${item.name}</h5>
                <p class="cart-item-price">$ ${item.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button onclick="decreaseQuantity(${index})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button onclick="increaseQuantity(${index})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <span class="cart-item-total">$ ${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="btn-remove-item" onclick="removeItem(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    updateSummary();
}

// Aumentar cantidad
function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCart();
    renderCartItems();
}

// Disminuir cantidad
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCart();
        renderCartItems();
    }
}

// Eliminar item
function removeItem(index) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        cart.splice(index, 1);
        saveCart();
        renderCartItems();
        showNotification('Producto eliminado del carrito', 'error');
    }
}

// Actualizar resumen
function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // GRATIS
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$ ${subtotal.toFixed(2)}`;
    document.getElementById('totalPrice').textContent = `$ ${total.toFixed(2)}`;
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Mostrar sección de código promocional
function showPromoCode() {
    const section = document.getElementById('promoCodeSection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// Aplicar código promocional
function applyPromoCode() {
    const code = document.getElementById('promoCodeInput').value.trim();
    if (code === '') {
        showNotification('Por favor ingresa un código', 'error');
        return;
    }

    // Aquí iría la lógica para validar el código
    // Por ahora solo mostramos un mensaje
    showNotification('Código aplicado correctamente', 'success');
}

// Mostrar sección de notas
function showNoteSection() {
    const section = document.getElementById('noteSection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// Ir al checkout
function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }

    // Guardar nota si existe
    const note = document.getElementById('orderNote').value;
    if (note) {
        localStorage.setItem('orderNote', note);
    }

    window.location.href = 'checkout.html';
}

// Mostrar notificación
function showNotification(message, type = 'success') {
    const bgColor = type === 'success' ? 'bg-success' : 'bg-danger';
    const notification = document.createElement('div');
    notification.className = 'position-fixed top-0 end-0 p-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-body ${bgColor} text-white rounded">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>${message}
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inicializar página
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    renderCartItems();
});