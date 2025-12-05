// ===============================================
//  SCRIPT PARA SIDEBAR RESPONSIVE DEL ADMINISTRADOR
// ===============================================
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');

    if (!sidebar) {
        console.error("El elemento con id 'sidebar' no fue encontrado.");
        return;
    }

    // Solo crear el botón si no existe
    if (!document.querySelector('.sidebar-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
        toggleBtn.setAttribute('aria-label', 'Toggle menu');
        document.body.appendChild(toggleBtn);

        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        toggleBtn.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', closeSidebar);

        // Cerrar al hacer clic en un enlace en móvil
        sidebar.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    closeSidebar();
                }
            });
        });
    }

    function toggleSidebar() {
        const toggleBtnIcon = document.querySelector('.sidebar-toggle i');

        if (window.innerWidth < 768) {
            // Comportamiento móvil: Mostrar/ocultar
            sidebar.classList.toggle('show');
            document.querySelector('.sidebar-overlay').classList.toggle('active');
            toggleBtnIcon.className = sidebar.classList.contains('show') ? 'bi bi-x-lg' : 'bi bi-list';
        } else {
            // Comportamiento desktop/tablet: Colapsar
            sidebar.classList.toggle('collapsed');
            toggleBtnIcon.className = sidebar.classList.contains('collapsed') ? 'bi bi-chevron-right' : 'bi bi-list';
        }
    }

    function closeSidebar() {
        sidebar.classList.remove('show');
        document.querySelector('.sidebar-overlay').classList.remove('active');
        const toggleBtnIcon = document.querySelector('.sidebar-toggle i');
        if (toggleBtnIcon) {
            toggleBtnIcon.className = 'bi bi-list';
        }
    }

    // Resetear estados al cambiar el tamaño de la ventana para evitar bugs
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeSidebar();
        }
    });
});