// ===============================================
//  SCRIPT PRINCIPAL DEL PANEL DE ADMINISTRADOR (VERSIÓN FINAL)
// ===============================================
document.addEventListener('DOMContentLoaded', function () {

    // --- 1. LÓGICA DE NAVEGACIÓN ENTRE SECCIONES ---
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.content-section');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            if (this.getAttribute('href') === '#') {
                event.preventDefault();
            } else {
                return;
            }
            const sectionId = this.getAttribute('data-section');
            if (!sectionId) return;
            contentSections.forEach(section => section.classList.remove('active'));
            sidebarLinks.forEach(l => l.classList.remove('active'));
            document.getElementById(sectionId)?.classList.add('active');
            this.classList.add('active');
        });
    });

    // --- 2. LÓGICA DE LA SECCIÓN 'USUARIOS' ---
    const buscadorUsuarios = document.getElementById('buscadorUsuarios');
    if (buscadorUsuarios) {
        buscadorUsuarios.addEventListener('input', function () {
            const filtro = this.value.toLowerCase();
            const filas = document.querySelectorAll('#tablaUsuarios tbody tr');
            let visibles = 0;
            filas.forEach(fila => {
                const coincide = fila.textContent.toLowerCase().includes(filtro);
                fila.style.display = coincide ? '' : 'none';
                if (coincide) visibles++;
            });
            document.getElementById('sinResultados').style.display = visibles === 0 ? 'block' : 'none';
        });
    }

    // --- 3. LÓGICA PARA CONFIRMACIÓN DE CORREO MASIVO ---
    const formCorreoMasivo = document.getElementById('formCorreoMasivo');
    const btnEnviarCorreo = document.getElementById('btnEnviarCorreo');
    if (formCorreoMasivo && btnEnviarCorreo) {
        btnEnviarCorreo.addEventListener('click', function (event) {
            event.preventDefault();
            Swal.fire({
                title: '¿Confirmar envío?', text: "Estás a punto de enviar un correo masivo.",
                icon: 'question', showCancelButton: true, confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33', confirmButtonText: 'Sí, enviar', cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    formCorreoMasivo.submit();
                }
            });
        });
    }

    // --- 4. LÓGICA UNIFICADA PARA GESTIÓN DE NEGOCIOS ---
    const modalRechazoEl = document.getElementById('modalRechazo');
    const modalDetallesEl = document.getElementById('modalDetallesNegocio');

    if (modalRechazoEl && modalDetallesEl) {
        const modalRechazo = new bootstrap.Modal(modalRechazoEl);
        const modalDetalles = new bootstrap.Modal(modalDetallesEl);
        const btnConfirmarRechazo = document.getElementById('btnConfirmarRechazo');
        let negocioIdParaAccion = null;

        // --- LÓGICA PARA ABRIR EL MODAL DE DETALLES ---
        window.abrirModalDetalles = function (id) {
            // La variable 'negociosData' viene del script th:inline en el HTML
            const negocio = negociosData.find(n => n.id === id);
            if (!negocio) return;

            // Rellenar datos del Vendedor
            document.getElementById('detalle-vendedor-nombre').textContent = negocio.vendedor?.usuario?.nombres || 'N/A';
            document.getElementById('detalle-vendedor-apellidos').textContent = negocio.vendedor?.usuario?.apellidos || '';
            document.getElementById('detalle-vendedor-correo').textContent = negocio.vendedor?.usuario?.correo || 'N/A';
            document.getElementById('detalle-vendedor-telefono').textContent = negocio.vendedor?.usuario?.telefono || 'N/A';

            // Rellenar datos del Negocio
            document.getElementById('detalle-negocio-imagen').src = negocio.imagenUrl || 'https://via.placeholder.com/400x200?text=Sin+Imagen';
            document.getElementById('detalle-negocio-nombre').textContent = negocio.nombreNegocio;
            document.getElementById('detalle-negocio-descripcion').textContent = negocio.descripcionNegocio || 'Sin descripción.';
            document.getElementById('detalle-negocio-ubicacion').textContent = negocio.ubicacionNegocio;
            document.getElementById('detalle-negocio-tipo').textContent = negocio.tipoNegocio;

            const estadoBadge = document.getElementById('detalle-negocio-estado');
            estadoBadge.textContent = negocio.estado;
            estadoBadge.className = 'badge';
            if (negocio.estado === 'pendiente') estadoBadge.classList.add('bg-warning', 'text-dark');
            else if (negocio.estado === 'rechazado') estadoBadge.classList.add('bg-danger');
            else estadoBadge.classList.add('bg-success');

            const footer = document.getElementById('modal-detalles-footer');
            footer.innerHTML = '';

            if (negocio.estado === 'pendiente') {
                footer.innerHTML = `
                    <button type="button" class="btn btn-danger" onclick="abrirModalRechazo(${negocio.id})"><i class="bi bi-x-circle-fill"></i> Rechazar</button>
                    <button type="button" class="btn btn-success" onclick="aprobarNegocio(${negocio.id})"><i class="bi bi-check-circle-fill"></i> Aprobar</button>
                `;
            } else {
                footer.innerHTML = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>`;
            }
            modalDetalles.show();
        };

        // --- LÓGICA PARA ABRIR MODAL DE RECHAZO ---
        window.abrirModalRechazo = function (id) {
            negocioIdParaAccion = id;
            document.getElementById('motivoRechazo').value = '';
            modalDetalles.hide(); // Ocultamos el modal de detalles
            modalRechazo.show(); // Mostramos el de rechazo
        };

        // --- LÓGICA PARA CONFIRMAR EL RECHAZO ---
        btnConfirmarRechazo.addEventListener('click', async () => {
            const motivo = document.getElementById('motivoRechazo').value;
            if (!motivo.trim()) {
                return Swal.fire('Error', 'Debes escribir un motivo para el rechazo.', 'error');
            }

            const token = document.querySelector('meta[name="_csrf"]').content;
            const header = document.querySelector('meta[name="_csrf_header"]').content;

            try {
                const response = await fetch(`/api/admin/negocios/rechazar/${negocioIdParaAccion}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', [header]: token},
                    body: JSON.stringify({motivo: motivo})
                });
                if (!response.ok) throw new Error('Falló la petición de rechazo.');
                modalRechazo.hide();
                await Swal.fire('¡Rechazado!', 'El negocio ha sido rechazado.', 'success');
                window.location.reload();
            } catch (error) {
                Swal.fire('Error', 'No se pudo rechazar el negocio.', 'error');
            }
        });
    }

    // --- LÓGICA PARA APROBAR ---
    window.aprobarNegocio = async function (id) {
        const result = await Swal.fire({
            title: '¿Aprobar este negocio?', text: "El negocio pasará a estar activo y visible.",
            icon: 'question', showCancelButton: true, confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33', confirmButtonText: 'Sí, aprobar', cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            const token = document.querySelector('meta[name="_csrf"]').content;
            const header = document.querySelector('meta[name="_csrf_header"]').content;
            try {
                const response = await fetch(`/api/admin/negocios/aprobar/${id}`, {
                    method: 'POST',
                    headers: {[header]: token}
                });
                if (!response.ok) throw new Error('Falló la petición de aprobación.');
                // Ocultar modal de detalles si está abierto
                const modalDetalles = bootstrap.Modal.getInstance(document.getElementById('modalDetallesNegocio'));
                if (modalDetalles) modalDetalles.hide();

                await Swal.fire('¡Aprobado!', 'El negocio ha sido aprobado y activado.', 'success');
                window.location.reload();
            } catch (error) {
                Swal.fire('Error', 'No se pudo aprobar el negocio.', 'error');
            }
        }
    };
});