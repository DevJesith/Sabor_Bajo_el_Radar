// Navegación entre secciones
document.addEventListener('DOMContentLoaded', function () {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.content-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remover clase active de todos los links
            sidebarLinks.forEach(l => l.classList.remove('active'));

            // Agregar clase active al link clickeado
            this.classList.add('active');

            // Obtener la sección a mostrar
            const sectionId = this.getAttribute('data-section');

            // Ocultar todas las secciones
            contentSections.forEach(section => section.classList.remove('active'));

            // Mostrar la sección seleccionada
            document.getElementById(sectionId).classList.add('active');

            // Cerrar sidebar en móvil
            if (window.innerWidth <= 767) {
                document.getElementById('sidebar').classList.remove('show');
                document.querySelector('.sidebar-overlay').classList.remove('active');
            }
        });
    });
});

// Guardar información de cuenta
document.getElementById('formInfoCuenta').addEventListener('submit', function (e) {
    e.preventDefault();

    // Validar contraseñas si se están cambiando
    const passwordActual = document.getElementById('passwordActual').value;
    const passwordNueva = document.getElementById('passwordNueva').value;
    const passwordConfirmar = document.getElementById('passwordConfirmar').value;

    if (passwordActual || passwordNueva || passwordConfirmar) {
        if (!passwordActual) {
            showNotification('Por favor ingresa tu contraseña actual', 'error');
            return;
        }

        if (passwordNueva !== passwordConfirmar) {
            showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        if (passwordNueva.length < 6) {
            showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
    }

    // Aquí iría la lógica para guardar los cambios
    showNotification('Información actualizada correctamente', 'success');

    // Limpiar campos de contraseña
    document.getElementById('passwordActual').value = '';
    document.getElementById('passwordNueva').value = '';
    document.getElementById('passwordConfirmar').value = '';
});

// Agregar tarjeta
function agregarTarjeta() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarTarjeta'));

    // Aquí iría la lógica para agregar la tarjeta
    showNotification('Método de pago agregado correctamente', 'success');

    modal.hide();

    // Limpiar formulario
    document.getElementById('formAgregarTarjeta').reset();
}

// Cerrar sesión
function cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Limpiar localStorage
        localStorage.removeItem('cart');
        localStorage.removeItem('orderNote');

        showNotification('Sesión cerrada correctamente', 'success');

        // Redirigir al login o home
        setTimeout(() => {
            window.location.href = 'cliente-home.html';
        }, 1500);
    }
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

// Formatear inputs de tarjeta
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modalAgregarTarjeta');

    if (modal) {
        const cardNumberInput = modal.querySelector('input[placeholder*="1234"]');
        const expiryInput = modal.querySelector('input[placeholder="MM/AA"]');

        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }

        if (expiryInput) {
            expiryInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                e.target.value = value;
            });
        }
    }
});