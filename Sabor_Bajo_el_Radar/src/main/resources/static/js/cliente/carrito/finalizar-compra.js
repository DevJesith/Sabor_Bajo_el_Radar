// ==========================================
// VARIABLES GLOBALES
// ==========================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const formatCurrency = (val) => new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
}).format(val);

// Headers para peticiones seguras
const getApiHeaders = () => {
    const token = document.querySelector('meta[name="_csrf"]')?.content;
    const headerName = document.querySelector('meta[name="_csrf_header"]')?.content;
    return {'Content-Type': 'application/json', [headerName]: token};
};

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    if (cart.length === 0) {
        window.location.href = '/cliente';
        return;
    }

    renderOrderSummary();
    loadUserInfo();
    loadAddresses();
    loadPaymentMethods();
});

// ==========================================
// CARGA DE DATOS (APIs)
// ==========================================

// 1. Cargar Info del Usuario
async function loadUserInfo() {
    try {
        const res = await fetch('/api/perfil-cliente');
        if (res.ok) {
            const user = await res.json();
            document.getElementById('userInfoContainer').innerHTML = `
                <div class="row">
                    <div class="col-md-6 mb-2"><strong>Nombre:</strong> ${user.nombres} ${user.apellidos}</div>
                    <div class="col-md-6 mb-2"><strong>Correo:</strong> ${user.correo}</div>
                    <div class="col-md-6"><strong>Teléfono:</strong> ${user.telefono}</div>
                    <div class="col-md-6"><strong>Documento:</strong> ${user.documento}</div>
                </div>
            `;
        }
    } catch (e) {
        document.getElementById('userInfoContainer').innerHTML = '<p class="text-danger">Error cargando información.</p>';
    }
}

// 2. Cargar Direcciones
async function loadAddresses() {
    const container = document.getElementById('addressesContainer');
    try {
        const res = await fetch('/api/direcciones');
        const addresses = await res.json();

        if (addresses.length === 0) {
            container.innerHTML = `<div class="alert alert-warning">No tienes direcciones guardadas. <a href="/ubicacion">Agrega una aquí</a></div>`;
            return;
        }

        container.innerHTML = addresses.map((addr, index) => `
            <div class="form-check address-option-card">
                <input class="form-check-input" type="radio" name="selectedAddress" id="addr_${addr.id}" value="${addr.id}" ${addr.isDefault ? 'checked' : ''}>
                <label class="form-check-label w-100" for="addr_${addr.id}">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-${getIcon(addr.tag)} fs-4 me-3 text-secondary"></i>
                        <div>
                            <strong>${addr.tag}</strong> (${addr.fullAddress})
                            <small class="d-block text-muted">${addr.locality}, ${addr.city}</small>
                        </div>
                    </div>
                </label>
            </div>
        `).join('');

        // Si ninguna es default, marcar la primera
        if (!document.querySelector('input[name="selectedAddress"]:checked')) {
            const first = document.querySelector('input[name="selectedAddress"]');
            if (first) first.checked = true;
        }

    } catch (e) {
        container.innerHTML = '<p class="text-danger">Error cargando direcciones.</p>';
    }
}

// 3. Cargar Métodos de Pago
async function loadPaymentMethods() {
    const container = document.getElementById('paymentMethodsContainer');
    try {
        const res = await fetch('/api/metodos-pago');
        const methods = await res.json();

        let html = methods.map(m => `
            <div class="form-check payment-option-card">
                <input class="form-check-input" type="radio" name="selectedPayment" id="pay_${m.id}" value="${m.id}">
                <label class="form-check-label w-100" for="pay_${m.id}">
                    <div class="d-flex align-items-center">
                        <i class="fas ${m.tipo === 'NEQUI' ? 'fa-mobile-alt' : 'fa-credit-card'} fs-4 me-3 text-primary"></i>
                        <div>
                            <strong>${m.tipo}</strong> ${m.franquicia ? `(${m.franquicia})` : ''}
                            <small class="d-block text-muted">${m.numeroMascara} - ${m.titular}</small>
                        </div>
                    </div>
                </label>
            </div>
        `).join('');

        container.innerHTML = html;

    } catch (e) {
        console.error(e);
    }
}

// ==========================================
// LÓGICA DE PEDIDO
// ==========================================

function renderOrderSummary() {
    const container = document.getElementById('orderItems');
    let subtotal = 0;

    container.innerHTML = cart.map(item => {
        const totalItem = item.price * item.quantity;
        subtotal += totalItem;
        return `
            <div class="order-item">
                <div>
                    <h6 class="mb-0 fw-bold">${item.name}</h6>
                    <small class="text-muted">x${item.quantity} - ${item.vendorName}</small>
                </div>
                <span class="fw-bold text-dark">${formatCurrency(totalItem)}</span>
            </div>
        `;
    }).join('');

    document.getElementById('checkoutSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('checkoutTotal').textContent = formatCurrency(subtotal);
}

async function processOrder() {
    // 1. Obtener Dirección Seleccionada
    const selectedAddressRadio = document.querySelector('input[name="selectedAddress"]:checked');
    if (!selectedAddressRadio) {
        Swal.fire('Falta información', 'Por favor selecciona una dirección de entrega.', 'warning');
        return;
    }

    // 2. Obtener Método de Pago Seleccionado
    const selectedPaymentRadio = document.querySelector('input[name="selectedPayment"]:checked');
    if (!selectedPaymentRadio) {
        Swal.fire('Falta información', 'Por favor selecciona un método de pago.', 'warning');
        return;
    }

    // 3. Confirmación
    const result = await Swal.fire({
        title: '¿Confirmar pedido?',
        text: "Tu pedido será enviado al restaurante.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ff6b35',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, pedir ahora'
    });

    if (result.isConfirmed) {
        enviarPedidoAlBackend({
            addressId: selectedAddressRadio.value,
            paymentData: selectedPaymentRadio.value, // Puede ser ID (Long) o "EFECTIVO" (String)
            note: document.getElementById('orderNote').value,
            items: cart
        });
    }
}

async function enviarPedidoAlBackend(orderData) {
    // Mostrar loading
    Swal.fire({
        title: 'Procesando...',
        text: 'Estamos enviando tu pedido a los restaurantes',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        // Preparar el cuerpo para el DTO de Java
        const payload = {
            addressId: parseInt(orderData.addressId), // Asegurar número
            paymentMethod: orderData.paymentData,
            note: orderData.note || "", // Enviar cadena vacía si es null
            items: orderData.items.map(i => {
                // Si el item tiene un ID compuesto tipo "COMBO-5", el ID real está en i.id (ya limpio)
                // o en i.offerId.
                // Asegurémonos de enviar números
                return {
                    id: parseInt(i.id),          // ID del Producto
                    quantity: parseInt(i.quantity),
                    offerId: i.offerId ? parseInt(i.offerId) : null // Solo si existe
                };
            })
        };

        console.log("Enviando Payload:", JSON.stringify(payload)); // Para depuración

        const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            // Intentar leer el error del servidor
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al procesar el pedido');
        }

        // Éxito
        localStorage.removeItem('cart');
        localStorage.removeItem('orderNote');
        // Limpiamos también checkoutData por si acaso
        localStorage.removeItem('checkoutData');

        await Swal.fire({
            title: '¡Pedido Exitoso!',
            text: 'Tu pedido ha sido recibido. Te redirigiremos a tus pedidos.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });

        window.location.href = '/mis-pedidos';

    } catch (error) {
        console.error(error);
        Swal.fire('Error', error.message || 'No se pudo realizar el pedido. Intenta nuevamente.', 'error');
    }
}

// Helper para iconos
function getIcon(tag) {
    if (!tag) return 'map-marker-alt';
    const t = tag.toLowerCase();
    if (t.includes('casa')) return 'home';
    if (t.includes('trabajo')) return 'briefcase';
    return 'map-marker-alt';
}