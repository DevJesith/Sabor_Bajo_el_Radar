// Script para manejar el sidebar responsive con toggle
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (!sidebar) {
        console.error('No se encontró el elemento sidebar');
        return;
    }

    // Crear botón de toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.setAttribute('aria-label', 'Toggle sidebar');
    document.body.appendChild(toggleBtn);

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // Función para actualizar posición del botón
    function updateButtonPosition() {
        if (window.innerWidth > 767) {
            if (sidebar.classList.contains('collapsed')) {
                toggleBtn.style.left = '95px';
            } else {
                toggleBtn.style.left = '15px';
            }
        } else {
            toggleBtn.style.left = '15px';
        }
    }

    // Toggle sidebar
    toggleBtn.addEventListener('click', function () {
        if (window.innerWidth > 767) {
            // Desktop/Tablet: colapsar
            sidebar.classList.toggle('collapsed');
            const icon = toggleBtn.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-right';
            } else {
                icon.className = 'fas fa-bars';
            }
            setTimeout(updateButtonPosition, 50);
        } else {
            // Móvil: mostrar/ocultar
            sidebar.classList.toggle('show');
            overlay.classList.toggle('active');
            const icon = toggleBtn.querySelector('i');
            if (sidebar.classList.contains('show')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        }
    });

    // Cerrar con overlay (solo móvil)
    overlay.addEventListener('click', function () {
        sidebar.classList.remove('show');
        overlay.classList.remove('active');
        toggleBtn.querySelector('i').className = 'fas fa-bars';
    });

    // Cerrar al hacer clic en enlaces (solo móvil)
    const sidebarLinks = sidebar.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 767) {
                sidebar.classList.remove('show');
                overlay.classList.remove('active');
                toggleBtn.querySelector('i').className = 'fas fa-bars';
            }
        });
    });

    // Resetear al cambiar tamaño de ventana
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            sidebar.classList.remove('show', 'collapsed');
            overlay.classList.remove('active');
            toggleBtn.querySelector('i').className = 'fas fa-bars';
            updateButtonPosition();
        }, 250);
    });

    // Inicializar posición del botón
    updateButtonPosition();
});