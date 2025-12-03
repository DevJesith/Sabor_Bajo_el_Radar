// Obtener carrito del localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Renderizar items del pedido
function renderOrderItems() {
    const orderItemsContainer = document.getElementById('orderItems');

    if (cart.length === 0) {
        window.location.href = 'cliente-home.html';
        return;
    }

    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div>
                <p class="order-item-name">${item.name}</p>
                <small class="order-item-quantity">x${item.quantity}</small>
            </div>
            <span class="order-item-price">$ ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    updateCheckoutSummary();
}

// Actualizar resumen del checkout
function updateCheckoutSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // GRATIS
    const tax = subtotal * 0.19; // 19% IVA
    const total = subtotal + shipping + tax;

    document.getElementById('checkoutSubtotal').textContent = `$ ${subtotal.toFixed(2)}`;
    document.getElementById('checkoutTax').textContent = `$ ${tax.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$ ${total.toFixed(2)}`;
}

// Manejar cambio de método de pago
document.addEventListener('DOMContentLoaded', function () {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('cardDetails');

    paymentMethods.forEach(method => {
        method.addEventListener('change', function () {
            if (this.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });

    // Formatear número de tarjeta
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Formatear fecha de expiración
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    renderOrderItems();
});

// Validar formulario
function validateForm() {
    const requiredFields = {
        fullName: 'Nombre completo',
        email: 'Correo electrónico',
        phone: 'Teléfono',
        idDocument: 'Documento de identidad',
        address: 'Dirección',
        city: 'Ciudad',
        locality: 'Localidad'
    };

    for (const [fieldId, fieldName] of Object.entries(requiredFields)) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            showNotification(`Por favor completa el campo: ${fieldName}`, 'error');
            field.focus();
            return false;
        }
    }

    // Validar email
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor ingresa un correo válido', 'error');
        return false;
    }

    // Validar método de pago
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCVV = document.getElementById('cardCVV').value;
        const cardName = document.getElementById('cardName').value;

        if (!cardNumber || cardNumber.length < 13) {
            showNotification('Número de tarjeta inválido', 'error');
            return false;
        }

        if (!cardExpiry || cardExpiry.length !== 5) {
            showNotification('Fecha de expiración inválida', 'error');
            return false;
        }

        if (!cardCVV || cardCVV.length < 3) {
            showNotification('CVV inválido', 'error');
            return false;
        }

        if (!cardName.trim()) {
            showNotification('Por favor ingresa el nombre del titular', 'error');
            return false;
        }
    }

    return true;
}

// Procesar pago
function processPayment() {
    if (!validateForm()) {
        return;
    }

    // Mostrar loading
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Procesando...';

    // Recopilar datos del pedido
    const orderData = {
        customer: {
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            idDocument: document.getElementById('idDocument').value
        },
        address: {
            street: document.getElementById('address').value,
            city: document.getElementById('city').value,
            locality: document.getElementById('locality').value,
            reference: document.getElementById('addressReference').value
        },
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
        items: cart,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        tax: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.19,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.19,
        note: localStorage.getItem('orderNote') || '',
        timestamp: new Date().toISOString()
    };

    // Simular procesamiento de pago
    setTimeout(() => {
        // Aquí iría la integración con la pasarela de pago real
        console.log('Orden procesada:', orderData);

        // Guardar orden en localStorage (temporal)
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderId = 'ORD-' + Date.now();
        orders.push({id: orderId, ...orderData});
        localStorage.setItem('orders', JSON.stringify(orders));

        // Limpiar carrito
        localStorage.removeItem('cart');
        localStorage.removeItem('orderNote');

        // Redirigir a página de confirmación
        showNotification('¡Pedido realizado con éxito!', 'success');

        setTimeout(() => {
            window.location.href = 'confirmacion.html?order=' + orderId;
        }, 2000);
    }, 2000);
}

// Mostrar notificación
function showNotification(message, type = 'success') {
    const bgColor = type === 'success' ? 'bg-success' : 'bg-danger';
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';

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