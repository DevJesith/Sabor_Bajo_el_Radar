// ========== SIDEBAR RESPONSIVE CON MENÚ HAMBURGUESA ==========

document.addEventListener('DOMContentLoaded', function () {
    initSidebarResponsive();
});

function initSidebarResponsive() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    // Crear botón hamburguesa si no existe
    if (!document.querySelector('.sidebar-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        toggleBtn.setAttribute('aria-label', 'Toggle menu');
        document.body.appendChild(toggleBtn);

        // Crear overlay para móvil
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        // Event listeners
        toggleBtn.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', closeSidebar);

        // Cerrar sidebar al hacer clic en un enlace (solo móvil)
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function () {
                if (window.innerWidth < 768) {
                    closeSidebar();
                }
            });
        });
    }

    // Ajustar al cambiar tamaño de ventana
    window.addEventListener('resize', handleResize);
    handleResize(); // Ejecutar al cargar
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const toggleBtn = document.querySelector('.sidebar-toggle');

    if (window.innerWidth < 768) {
        // Comportamiento móvil: mostrar/ocultar
        sidebar.classList.toggle('show');
        overlay.classList.toggle('active');
        toggleBtn.querySelector('i').classList.toggle('fa-bars');
        toggleBtn.querySelector('i').classList.toggle('fa-times');
    } else {
        // Comportamiento desktop/tablet: colapsar
        sidebar.classList.toggle('collapsed');
        toggleBtn.querySelector('i').classList.toggle('fa-bars');
        toggleBtn.querySelector('i').classList.toggle('fa-times');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const toggleBtn = document.querySelector('.sidebar-toggle');

    sidebar.classList.remove('show');
    overlay.classList.remove('active');

    if (toggleBtn) {
        toggleBtn.querySelector('i').classList.remove('fa-times');
        toggleBtn.querySelector('i').classList.add('fa-bars');
    }
}

function handleResize() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const toggleBtn = document.querySelector('.sidebar-toggle');

    // Restablecer estados al cambiar entre breakpoints
    if (window.innerWidth >= 768) {
        sidebar.classList.remove('show');
        if (overlay) overlay.classList.remove('active');

        // Mostrar botón toggle en desktop para colapsar
        if (toggleBtn) {
            toggleBtn.style.display = 'block';
            if (sidebar.classList.contains('collapsed')) {
                toggleBtn.querySelector('i').classList.remove('fa-bars');
                toggleBtn.querySelector('i').classList.add('fa-times');
            } else {
                toggleBtn.querySelector('i').classList.remove('fa-times');
                toggleBtn.querySelector('i').classList.add('fa-bars');
            }
        }
    } else {
        // Móvil: remover collapsed, usar show
        sidebar.classList.remove('collapsed');
        if (toggleBtn) {
            toggleBtn.style.display = 'block';
        }
    }
}

// Prevenir scroll del body cuando el sidebar está abierto en móvil
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class') {
                    if (sidebar.classList.contains('show') && window.innerWidth < 768) {
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflow = '';
                    }
                }
            });
        });
        observer.observe(sidebar, {attributes: true});
    }
});