document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('creado')) {
        Swal.fire({
            title: '¡Cuenta creada!',
            text: 'El usuario fue registrado exitosamente.',
            icon: 'success',
            timer: 2500,
            showConfirmButton: false,
        });
    }

    if (urlParams.get('actualizado')) {
        Swal.fire({
            title: '¡Cambios guardados!',
            text: 'Los datos del usuario fueron actualizados.',
            icon: 'success',
            timer: 2500,
            showConfirmButton: false,
        });
    }

    if (urlParams.get('eliminado')) {
        Swal.fire({
            title: '¡Usuario eliminado!',
            text: 'El usuario fue eliminado correctamente.',
            icon: 'success',
            timer: 2500,
            showConfirmButton: false,
        });
    }


    //----------------

    const botonesEliminar = document.querySelectorAll('.btn-danger');
    botonesEliminar.forEach((btn) => {
        const href = btn.getAttribute('href');
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            Swal.fire({
                title: '¿Eliminar usuario?',
                text: 'Esta acción no se puede deshacer.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = href;
                }
            });
        });
    });

    //------------------------------------

    const botonesEditar = document.querySelectorAll('.btn-primary');
    botonesEditar.forEach((btn) => {
        const href = btn.getAttribute('href');
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            Swal.fire({
                title: '¿Editar usuario?',
                text: 'Serás redirigido al formulario de edición.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = href;
                }
            });
        });
    });
})