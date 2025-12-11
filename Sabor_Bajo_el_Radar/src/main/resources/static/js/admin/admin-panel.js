// ===============================================
//  SCRIPT PRINCIPAL DEL PANEL DE ADMINISTRADOR (VERSIÓN CORREGIDA)
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
            const sinResultados = document.getElementById('sinResultados');
            if (sinResultados) {
                sinResultados.style.display = visibles === 0 ? 'block' : 'none';
            }
        });
    }

    // --- 3. LÓGICA PARA CONFIRMACIÓN DE CORREO MASIVO ---
    const formCorreoMasivo = document.getElementById('formCorreoMasivo');
    const btnEnviarCorreo = document.getElementById('btnEnviarCorreo');
    if (formCorreoMasivo && btnEnviarCorreo) {
        btnEnviarCorreo.addEventListener('click', function (event) {
            event.preventDefault();
            Swal.fire({
                title: '¿Confirmar envío?',
                text: "Estás a punto de enviar un correo masivo.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, enviar',
                cancelButtonText: 'Cancelar'
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
            console.log('Abriendo modal para negocio ID:', id);

            // Verificar que negociosData existe
            if (typeof negociosData === 'undefined') {
                console.error('negociosData no está definido');
                Swal.fire('Error', 'No se pudieron cargar los datos de los negocios.', 'error');
                return;
            }

            const negocio = negociosData.find(n => n.id === id);
            if (!negocio) {
                console.error('Negocio no encontrado:', id);
                return;
            }

            console.log('Datos del negocio:', negocio);

            // Rellenar datos del Vendedor (con validación de existencia)
            const nombreCompleto = `${negocio.vendedor?.usuario?.nombres || 'N/A'} ${negocio.vendedor?.usuario?.apellidos || ''}`.trim();
            const vendedorNombre = document.getElementById('detalle-vendedor-nombre');
            if (vendedorNombre) vendedorNombre.textContent = nombreCompleto;

            const vendedorCorreo = document.getElementById('detalle-vendedor-correo');
            if (vendedorCorreo) vendedorCorreo.textContent = negocio.vendedor?.usuario?.correo || 'N/A';

            const vendedorTelefono = document.getElementById('detalle-vendedor-telefono');
            if (vendedorTelefono) vendedorTelefono.textContent = negocio.vendedor?.usuario?.telefono || 'N/A';

            // Rellenar datos del Negocio
            const negocioImagen = document.getElementById('detalle-negocio-imagen');
            if (negocioImagen) {
                negocioImagen.src = negocio.imagenUrl || 'https://via.placeholder.com/400x200?text=Sin+Imagen';
            }

            const negocioNombre = document.getElementById('detalle-negocio-nombre');
            if (negocioNombre) negocioNombre.textContent = negocio.nombreNegocio || 'N/A';

            const negocioUbicacion = document.getElementById('detalle-negocio-ubicacion');
            if (negocioUbicacion) negocioUbicacion.textContent = negocio.ubicacionNegocio || 'N/A';

            const negocioTipo = document.getElementById('detalle-negocio-tipo');
            if (negocioTipo) negocioTipo.textContent = negocio.tipoNegocio || 'N/A';

            const estadoBadge = document.getElementById('detalle-negocio-estado');
            if (estadoBadge) {
                estadoBadge.textContent = negocio.estado || 'N/A';
                estadoBadge.className = 'badge';
                if (negocio.estado === 'pendiente') {
                    estadoBadge.classList.add('bg-warning', 'text-dark');
                } else if (negocio.estado === 'rechazado') {
                    estadoBadge.classList.add('bg-danger');
                } else {
                    estadoBadge.classList.add('bg-success');
                }
            }

            const footer = document.getElementById('modal-detalles-footer');
            if (footer) {
                footer.innerHTML = '';

                if (negocio.estado === 'pendiente') {
                    footer.innerHTML = `
                        <button type="button" class="btn btn-danger" onclick="abrirModalRechazo(${negocio.id})">
                            <i class="bi bi-x-circle-fill"></i> Rechazar
                        </button>
                        <button type="button" class="btn btn-success" onclick="aprobarNegocio(${negocio.id})">
                            <i class="bi bi-check-circle-fill"></i> Aprobar
                        </button>
                    `;
                } else {
                    footer.innerHTML = `
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    `;
                }
            }

            modalDetalles.show();
        };

        // --- LÓGICA PARA ABRIR MODAL DE RECHAZO ---
        window.abrirModalRechazo = function (id) {
            console.log('Abriendo modal de rechazo para ID:', id);
            negocioIdParaAccion = id;
            const motivoRechazo = document.getElementById('motivoRechazo');
            if (motivoRechazo) motivoRechazo.value = '';
            modalDetalles.hide();
            modalRechazo.show();
        };

        // --- LÓGICA PARA CONFIRMAR EL RECHAZO ---
        if (btnConfirmarRechazo) {
            btnConfirmarRechazo.addEventListener('click', async () => {
                const motivoRechazo = document.getElementById('motivoRechazo');
                const motivo = motivoRechazo ? motivoRechazo.value : '';

                if (!motivo.trim()) {
                    return Swal.fire('Error', 'Debes escribir un motivo para el rechazo.', 'error');
                }

                const token = document.querySelector('meta[name="_csrf"]')?.content;
                const header = document.querySelector('meta[name="_csrf_header"]')?.content;

                if (!token || !header) {
                    return Swal.fire('Error', 'No se encontró el token CSRF.', 'error');
                }

                try {
                    const response = await fetch(`/api/admin/negocios/rechazar/${negocioIdParaAccion}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            [header]: token
                        },
                        body: JSON.stringify({motivo: motivo})
                    });

                    if (!response.ok) throw new Error('Falló la petición de rechazo.');

                    modalRechazo.hide();
                    await Swal.fire('¡Rechazado!', 'El negocio ha sido rechazado.', 'success');
                    window.location.reload();
                } catch (error) {
                    console.error('Error al rechazar:', error);
                    Swal.fire('Error', 'No se pudo rechazar el negocio.', 'error');
                }
            });
        }
    }

    // --- LÓGICA PARA APROBAR ---
    window.aprobarNegocio = async function (id) {
        console.log('Aprobando negocio ID:', id);

        const result = await Swal.fire({
            title: '¿Aprobar este negocio?',
            text: "El negocio pasará a estar activo y visible.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, aprobar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            const token = document.querySelector('meta[name="_csrf"]')?.content;
            const header = document.querySelector('meta[name="_csrf_header"]')?.content;

            if (!token || !header) {
                return Swal.fire('Error', 'No se encontró el token CSRF.', 'error');
            }

            try {
                const response = await fetch(`/api/admin/negocios/aprobar/${id}`, {
                    method: 'POST',
                    headers: {[header]: token}
                });

                if (!response.ok) throw new Error('Falló la petición de aprobación.');

                // Ocultar modal de detalles si está abierto
                const modalDetallesEl = document.getElementById('modalDetallesNegocio');
                if (modalDetallesEl) {
                    const modalDetalles = bootstrap.Modal.getInstance(modalDetallesEl);
                    if (modalDetalles) modalDetalles.hide();
                }

                await Swal.fire('¡Aprobado!', 'El negocio ha sido aprobado y activado.', 'success');
                window.location.reload();
            } catch (error) {
                console.error('Error al aprobar:', error);
                Swal.fire('Error', 'No se pudo aprobar el negocio.', 'error');
            }
        }
    };
});