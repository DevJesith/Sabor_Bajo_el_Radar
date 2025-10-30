// Script para manejar el sidebar responsive con toggle
document.addEventListener('DOMContentLoaded', function () {
    console.log('Script sidebar_responsive cargado correctamente');

    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (!sidebar) {
        console.error('No se encontró el elemento sidebar');
        return;
    }

    // Crear botón de toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
    toggleBtn.setAttribute('aria-label', 'Toggle sidebar');
    document.body.appendChild(toggleBtn);

    console.log('Botón toggle creado');

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    console.log('Overlay creado');

    // Función para mover el botón
    function updateButtonPosition() {
        if (window.innerWidth > 767) {
            if (sidebar.classList.contains('collapsed')) {
                // Sidebar colapsado: botón junto al borde derecho del sidebar colapsado
                toggleBtn.style.left = '95px'; // 80px sidebar + 15px margen
            } else {
                // Sidebar expandido: botón dentro del sidebar
                toggleBtn.style.left = '15px';
            }
        } else {
            // En móvil siempre fijo
            toggleBtn.style.left = '15px';
        }
    }

    // Toggle sidebar
    toggleBtn.addEventListener('click', function () {
        console.log('Click en botón toggle - Ancho: ' + window.innerWidth + 'px');

        if (window.innerWidth > 767) {
            // Desktop/Tablet: colapsar
            sidebar.classList.toggle('collapsed');
            const icon = toggleBtn.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.className = 'bi bi-chevron-right';
                console.log('Sidebar colapsado');
            } else {
                icon.className = 'bi bi-list';
                console.log('Sidebar expandido');
            }
            // Actualizar posición del botón con un pequeño delay para la animación
            setTimeout(updateButtonPosition, 50);
        } else {
            // Móvil: mostrar/ocultar
            sidebar.classList.toggle('show');
            overlay.classList.toggle('active');
            const icon = toggleBtn.querySelector('i');
            if (sidebar.classList.contains('show')) {
                icon.className = 'bi bi-x-lg';
                console.log('Sidebar visible (móvil)');
            } else {
                icon.className = 'bi bi-list';
                console.log('Sidebar oculto (móvil)');
            }
        }
    });

    // Cerrar con overlay (solo móvil)
    overlay.addEventListener('click', function () {
        console.log('Click en overlay - cerrando sidebar');
        sidebar.classList.remove('show');
        overlay.classList.remove('active');
        toggleBtn.querySelector('i').className = 'bi bi-list';
    });

    // Cerrar al hacer clic en enlaces (solo móvil)
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 767) {
                console.log('Click en enlace (móvil) - cerrando sidebar');
                sidebar.classList.remove('show');
                overlay.classList.remove('active');
                toggleBtn.querySelector('i').className = 'bi bi-list';
            }
        });
    });

    // Resetear al cambiar tamaño de ventana
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            console.log('Ventana redimensionada - reseteando sidebar');
            sidebar.classList.remove('show', 'collapsed');
            overlay.classList.remove('active');
            toggleBtn.querySelector('i').className = 'bi bi-list';
            updateButtonPosition();
        }, 250);
    });

    // Inicializar posición del botón
    updateButtonPosition();
});