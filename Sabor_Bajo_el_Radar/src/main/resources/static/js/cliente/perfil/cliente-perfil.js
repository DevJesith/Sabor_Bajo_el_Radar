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

    // --- OBTENER CSRF TOKEN PARA LAS PETICIONES ---
    const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

    // --- LÓGICA DE ACTUALIZACIÓN DE CUENTA ---
    const formInfoCuenta = document.getElementById('formInfoCuenta');
    if (formInfoCuenta) {
        formInfoCuenta.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Recolectar datos del formulario
            const data = {
                nombres: document.getElementById('nombres').value,
                apellidos: document.getElementById('apellidos').value,
                telefono: document.getElementById('telefono').value,
                documento: document.getElementById('documento').value,
                contrasenaActual: document.getElementById('passwordActual').value,
                nuevaContrasena: document.getElementById('passwordNueva').value
            };

            const passwordConfirmar = document.getElementById('passwordConfirmar').value;
            if (data.nuevaContrasena && data.nuevaContrasena !== passwordConfirmar) {
                return showNotification('La nueva contraseña y su confirmación no coinciden.', 'error');
            }

            try {
                const response = await fetch('/api/perfil-cliente', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json', [csrfHeader]: csrfToken},
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'No se pudo actualizar el perfil.');
                }

                showNotification('¡Información actualizada con éxito!', 'success');
                // Limpiar campos de contraseña tras éxito
                document.getElementById('passwordActual').value = '';
                document.getElementById('passwordNueva').value = '';
                document.getElementById('passwordConfirmar').value = '';

                // Recargar nombre en sidebar
                cargarDatosUsuario();

            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }

    // --- LÓGICA DE ELIMINACIÓN DE CUENTA ---
    const modalEliminarEl = document.getElementById('modalConfirmarEliminacion');
    if (modalEliminarEl) {
        const modalEliminar = new bootstrap.Modal(modalEliminarEl);
        document.getElementById('btnEliminarCuenta')?.addEventListener('click', () => modalEliminar.show());

        document.getElementById('btnConfirmarEliminacionDefinitiva')?.addEventListener('click', async () => {
            modalEliminar.hide();
            try {
                const response = await fetch('/api/perfil-cliente', {
                    method: 'DELETE',
                    headers: {[csrfHeader]: csrfToken}
                });

                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.error || 'No se pudo eliminar la cuenta.');
                }

                await Swal.fire({
                    title: 'Cuenta Eliminada',
                    text: 'Tu cuenta ha sido eliminada exitosamente. Serás redirigido.',
                    icon: 'success',
                    timer: 2500,
                    showConfirmButton: false,
                    allowOutsideClick: false
                });
                window.location.href = '/login?eliminado=true';

            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }

    // Formateo de tarjeta
    const modalTarjeta = document.getElementById('modalAgregarTarjeta');
    if (modalTarjeta) {
        const cardNumberInput = modalTarjeta.querySelector('input[placeholder*="0000"]');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function (e) {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }
    }

    // Cargar datos al inicio
    cargarDatosUsuario();
});

// Cerrar sesión
function cerrarSesion() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: "Serás redirigido a la página de inicio.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión'
    }).then((result) => {
        if (result.isConfirmed) {
            // Crear formulario dinámico para logout POST
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/logout';

            // Añadir CSRF token
            const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
            const csrfParam = document.querySelector('meta[name="_csrf_param"]')?.content || '_csrf'; // default spring param

            if (csrfToken) {
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = csrfParam;
                hiddenField.value = csrfToken;
                form.appendChild(hiddenField);
            }

            document.body.appendChild(form);
            form.submit();
        }
    });
}

// --- FUNCIÓN DE NOTIFICACIÓN (GLOBAL Y ÚNICA) ---
function showNotification(message, type = 'success') {
    const bgColor = type === 'success' ? 'bg-success' : 'bg-danger';
    const notification = document.createElement('div');
    notification.className = `position-fixed top-0 end-0 p-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `<div class="toast show align-items-center text-white ${bgColor} border-0" role="alert"><div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div>`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// --- LÓGICA DE MÉTODOS DE PAGO ---
document.addEventListener('DOMContentLoaded', function () {
    const linkPagos = document.querySelector('[data-section="metodos-pago"]');
    if (linkPagos) {
        linkPagos.addEventListener('click', cargarMetodosPago);
    }
});

function toggleCamposPago() {
    const tipo = document.getElementById('tipoMetodo').value;
    const camposTarjeta = document.getElementById('camposTarjeta');
    const camposBilletera = document.getElementById('camposBilletera');

    if (tipo === 'TARJETA') {
        camposTarjeta.style.display = 'block';
        camposBilletera.style.display = 'none';
        document.getElementById('pagoNumero').setAttribute('required', 'true');
        document.getElementById('pagoCelular').removeAttribute('required');
    } else {
        camposTarjeta.style.display = 'none';
        camposBilletera.style.display = 'block';
        document.getElementById('pagoNumero').removeAttribute('required');
        document.getElementById('pagoCelular').setAttribute('required', 'true');
    }
}

async function cargarMetodosPago() {
    const container = document.getElementById('lista-metodos-pago');
    container.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Cargando...</div>';

    try {
        const response = await fetch('/api/metodos-pago');
        if (!response.ok) throw new Error('Error al cargar métodos');
        const metodos = await response.json();

        if (metodos.length === 0) {
            container.innerHTML = '<div class="alert alert-info">No tienes métodos de pago guardados.</div>';
            return;
        }

        let html = '';
        metodos.forEach(m => {
            let icono = 'fa-credit-card';
            let color = 'text-primary';
            let titulo = m.franquicia || 'Método de pago';

            if (m.tipo === 'NEQUI') {
                icono = 'fa-mobile-alt';
                color = 'text-purple';
                titulo = 'Nequi';
            } else if (m.tipo === 'DAVIPLATA') {
                icono = 'fa-home';
                color = 'text-danger';
                titulo = 'DaviPlata';
            }

            html += `
                <div class="card profile-card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center gap-3">
                                <i class="fas ${icono} fs-2 ${color}"></i>
                                <div>
                                    <h6 class="mb-0">${m.numeroMascara}</h6>
                                    <small class="text-muted">${titulo} - ${m.titular}</small>
                                </div>
                            </div>
                            <div>
                                <button class="btn btn-sm btn-outline-danger" onclick="eliminarMetodoPago(${m.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;

    } catch (error) {
        console.error(error);
        container.innerHTML = '<div class="alert alert-danger">Error cargando la información.</div>';
    }
}

async function guardarMetodoPago() {
    const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

    const tipo = document.getElementById('tipoMetodo').value;
    const titular = document.getElementById('pagoTitular').value;
    let numero = '';
    let vencimiento = null;
    let franquicia = null;

    if (tipo === 'TARJETA') {
        numero = document.getElementById('pagoNumero').value.replace(/\s/g, '');
        vencimiento = document.getElementById('pagoVencimiento').value;
        franquicia = numero.startsWith('4') ? 'Visa' : 'Mastercard';

        if (numero.length < 13 || !vencimiento) {
            showNotification('Por favor completa los datos de la tarjeta', 'error');
            return;
        }
    } else {
        numero = document.getElementById('pagoCelular').value;
        franquicia = tipo;
        if (!numero) {
            showNotification('Ingresa el número de celular', 'error');
            return;
        }
    }

    const data = {
        tipo: tipo,
        titular: titular,
        numero: numero,
        fechaVencimiento: vencimiento,
        franquicia: franquicia
    };

    try {
        const response = await fetch('/api/metodos-pago', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showNotification('Método agregado exitosamente', 'success');
            const modalEl = document.getElementById('modalAgregarTarjeta');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            document.getElementById('formAgregarTarjeta').reset();
            cargarMetodosPago();
        } else {
            const err = await response.json();
            showNotification(err.error || 'Error al guardar', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
    }
}

async function eliminarMetodoPago(id) {
    const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

    const confirmacion = await Swal.fire({
        title: '¿Eliminar método?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar'
    });

    if (confirmacion.isConfirmed) {
        try {
            const response = await fetch(`/api/metodos-pago/${id}`, {
                method: 'DELETE',
                headers: {[csrfHeader]: csrfToken}
            });

            if (response.ok) {
                Swal.fire('Eliminado', 'El método ha sido eliminado.', 'success');
                cargarMetodosPago();
            } else {
                Swal.fire('Error', 'No se pudo eliminar.', 'error');
            }
        } catch (error) {
            console.error(error);
        }
    }
}

// ===============================================
// CARGAR NOMBRE EN SIDEBAR (CORREGIDO)
// ===============================================
async function cargarDatosUsuario() {
    try {
        const response = await fetch('/api/perfil-cliente');
        if (!response.ok) return;

        const usuario = await response.json();

        // 1. Sidebar Nombre
        const sidebarName = document.getElementById('sidebarUserName');
        if (sidebarName && usuario.nombres) {
            sidebarName.textContent = `Hola, ${usuario.nombres.split(' ')[0]}`;
        }

        // 2. Sidebar Inicial (Avatar)
        const sidebarInitial = document.getElementById('sidebarUserInitial');
        if (sidebarInitial && usuario.nombres) {
            sidebarInitial.textContent = usuario.nombres.charAt(0).toUpperCase();
        }

    } catch (error) {
        console.log("Usuario no autenticado");
    }
}