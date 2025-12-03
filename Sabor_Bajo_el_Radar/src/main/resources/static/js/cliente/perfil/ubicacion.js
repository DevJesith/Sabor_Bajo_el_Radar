// Variables globales
let map;
let marker;
let selectedLocation = {
    lat: 4.7110,  // Bogotá por defecto
    lng: -74.0721,
    address: ''
};

// Obtener direcciones guardadas del localStorage
let savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || generateSampleAddresses();

// Generar direcciones de ejemplo
function generateSampleAddresses() {
    const samples = [
        {
            id: 1,
            tag: 'Casa',
            fullAddress: 'Calle 123 #45-67',
            city: 'Bogotá',
            locality: 'Usaquén',
            details: 'Casa blanca con puerta verde',
            contactName: 'Jesith Ramírez',
            contactPhone: '+57 300 123 4567',
            lat: 4.7110,
            lng: -74.0721,
            isDefault: true
        },
        {
            id: 2,
            tag: 'Trabajo',
            fullAddress: 'Carrera 7 #89-12, Edificio Torre Central',
            city: 'Bogotá',
            locality: 'Chapinero',
            details: 'Piso 5, Oficina 501',
            contactName: 'Jesith Ramírez',
            contactPhone: '+57 300 123 4567',
            lat: 4.6482,
            lng: -74.0776,
            isDefault: false
        }
    ];

    localStorage.setItem('savedAddresses', JSON.stringify(samples));
    return samples;
}

// Actualizar contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Inicializar mapa
function initMap() {
    // Crear mapa centrado en Bogotá
    map = L.map('map').setView([selectedLocation.lat, selectedLocation.lng], 13);

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Crear marcador draggable
    marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        draggable: true,
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map);

    // Evento cuando se arrastra el marcador
    marker.on('dragend', function (e) {
        const position = marker.getLatLng();
        selectedLocation.lat = position.lat;
        selectedLocation.lng = position.lng;
        reverseGeocode(position.lat, position.lng);
    });

    // Evento click en el mapa
    map.on('click', function (e) {
        marker.setLatLng(e.latlng);
        selectedLocation.lat = e.latlng.lat;
        selectedLocation.lng = e.latlng.lng;
        reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    // Obtener dirección inicial
    reverseGeocode(selectedLocation.lat, selectedLocation.lng);
}

// Geocodificación inversa (obtener dirección de coordenadas)
async function reverseGeocode(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await response.json();

        selectedLocation.address = data.display_name || 'Dirección no encontrada';

        // Mostrar información
        document.getElementById('selectedLocationInfo').style.display = 'block';
        document.getElementById('selectedAddressText').textContent = selectedLocation.address;
        document.getElementById('selectedCoords').textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    } catch (error) {
        console.error('Error en geocodificación:', error);
        selectedLocation.address = 'Error al obtener dirección';
    }
}

// Detectar ubicación actual
function detectCurrentLocation() {
    if (navigator.geolocation) {
        showNotification('Detectando tu ubicación...', 'info');

        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                selectedLocation.lat = lat;
                selectedLocation.lng = lng;

                map.setView([lat, lng], 15);
                marker.setLatLng([lat, lng]);
                reverseGeocode(lat, lng);

                showNotification('Ubicación detectada correctamente', 'success');
            },
            function (error) {
                showNotification('No se pudo detectar tu ubicación. Por favor, activa el GPS.', 'error');
                console.error('Error:', error);
            }
        );
    } else {
        showNotification('Tu navegador no soporta geolocalización', 'error');
    }
}

// Renderizar direcciones guardadas
function renderSavedAddresses() {
    const container = document.getElementById('savedAddressesList');

    if (savedAddresses.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-map-marked-alt fs-1 text-muted mb-3"></i>
                <p class="text-muted">No tienes direcciones guardadas</p>
            </div>
        `;
        return;
    }

    container.innerHTML = savedAddresses.map(address => `
        <div class="address-card ${address.isDefault ? 'default-address' : ''}" onclick="selectAddress(${address.id})">
            <span class="address-tag tag-${address.tag.toLowerCase()}">
                <i class="fas fa-${getTagIcon(address.tag)}"></i>
                ${address.tag}
            </span>
            <p class="address-text">
                <strong>${address.fullAddress}</strong><br>
                ${address.locality}, ${address.city}
                ${address.details ? `<br><small class="text-muted">${address.details}</small>` : ''}
            </p>
            <div class="address-actions">
                <button class="btn-use-address" onclick="event.stopPropagation(); useAddress(${address.id})">
                    <i class="fas fa-check me-1"></i> Usar
                </button>
                <button class="btn-edit-address" onclick="event.stopPropagation(); editAddress(${address.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-address" onclick="event.stopPropagation(); deleteAddress(${address.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Obtener icono según etiqueta
function getTagIcon(tag) {
    const icons = {
        'Casa': 'home',
        'Trabajo': 'briefcase',
        'Otro': 'map-marker-alt'
    };
    return icons[tag] || 'map-marker-alt';
}

// Seleccionar dirección
function selectAddress(addressId) {
    const address = savedAddresses.find(a => a.id === addressId);
    if (address) {
        selectedLocation.lat = address.lat;
        selectedLocation.lng = address.lng;
        selectedLocation.address = `${address.fullAddress}, ${address.locality}, ${address.city}`;

        map.setView([address.lat, address.lng], 15);
        marker.setLatLng([address.lat, address.lng]);

        document.getElementById('selectedLocationInfo').style.display = 'block';
        document.getElementById('selectedAddressText').textContent = selectedLocation.address;
        document.getElementById('selectedCoords').textContent = `${address.lat.toFixed(6)}, ${address.lng.toFixed(6)}`;
    }
}

// Usar dirección
function useAddress(addressId) {
    const address = savedAddresses.find(a => a.id === addressId);
    if (address) {
        localStorage.setItem('currentAddress', JSON.stringify(address));
        showNotification('Dirección seleccionada correctamente', 'success');
        setTimeout(() => {
            window.location.href = 'cliente-home.html';
        }, 1500);
    }
}

// Editar dirección
function editAddress(addressId) {
    const address = savedAddresses.find(a => a.id === addressId);
    if (address) {
        // Llenar formulario con datos
        document.querySelector(`input[name="addressTag"][value="${address.tag}"]`).checked = true;
        document.getElementById('fullAddress').value = address.fullAddress;
        document.getElementById('city').value = address.city;
        document.getElementById('locality').value = address.locality;
        document.getElementById('addressDetails').value = address.details || '';
        document.getElementById('contactName').value = address.contactName || '';
        document.getElementById('contactPhone').value = address.contactPhone || '';
        document.getElementById('setAsDefault').checked = address.isDefault;

        // Guardar ID para edición
        document.getElementById('formNuevaDireccion').dataset.editId = addressId;

        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('modalNuevaDireccion'));
        modal.show();
    }
}

// Eliminar dirección
function deleteAddress(addressId) {
    if (confirm('¿Estás seguro de eliminar esta dirección?')) {
        savedAddresses = savedAddresses.filter(a => a.id !== addressId);
        localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
        renderSavedAddresses();
        showNotification('Dirección eliminada', 'info');
    }
}

// Confirmar ubicación
function confirmLocation() {
    const newAddress = {
        id: Date.now(),
        tag: 'Nuevo',
        fullAddress: selectedLocation.address,
        city: 'Bogotá',
        locality: '',
        details: '',
        contactName: '',
        contactPhone: '',
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        isDefault: false
    };

    // Abrir modal para completar detalles
    document.getElementById('fullAddress').value = selectedLocation.address;
    const modal = new bootstrap.Modal(document.getElementById('modalNuevaDireccion'));
    modal.show();
}

// Guardar nueva dirección
function saveNewAddress() {
    const form = document.getElementById('formNuevaDireccion');
    const editId = form.dataset.editId;

    // Validar campos requeridos
    if (!document.getElementById('fullAddress').value || !document.getElementById('locality').value) {
        showNotification('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    // Obtener tag seleccionado
    let tag = document.querySelector('input[name="addressTag"]:checked').value;
    if (tag === 'Otro' && document.getElementById('customTag').value) {
        tag = document.getElementById('customTag').value;
    }

    const newAddress = {
        id: editId ? parseInt(editId) : Date.now(),
        tag: tag,
        fullAddress: document.getElementById('fullAddress').value,
        city: document.getElementById('city').value,
        locality: document.getElementById('locality').value,
        details: document.getElementById('addressDetails').value,
        contactName: document.getElementById('contactName').value,
        contactPhone: document.getElementById('contactPhone').value,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        isDefault: document.getElementById('setAsDefault').checked
    };

    if (editId) {
        // Editar dirección existente
        const index = savedAddresses.findIndex(a => a.id === parseInt(editId));
        if (index !== -1) {
            savedAddresses[index] = newAddress;
        }
    } else {
        // Agregar nueva dirección
        savedAddresses.push(newAddress);
    }

    // Si se marca como predeterminada, desmarcar las demás
    if (newAddress.isDefault) {
        savedAddresses.forEach(addr => {
            if (addr.id !== newAddress.id) {
                addr.isDefault = false;
            }
        });
    }

    localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
    renderSavedAddresses();

    // Cerrar modal y limpiar formulario
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevaDireccion'));
    modal.hide();
    form.reset();
    delete form.dataset.editId;

    showNotification('Dirección guardada correctamente', 'success');
}

// Búsqueda de direcciones
document.getElementById('searchAddressInput').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const addressCards = document.querySelectorAll('.address-card');

    addressCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Mostrar/ocultar campo de etiqueta personalizada
document.querySelectorAll('input[name="addressTag"]').forEach(radio => {
    radio.addEventListener('change', function () {
        const customTagDiv = document.getElementById('customTagDiv');
        if (this.value === 'Otro') {
            customTagDiv.style.display = 'block';
        } else {
            customTagDiv.style.display = 'none';
        }
    });
});

// Mostrar notificación
function showNotification(message, type = 'success') {
    const colors = {
        success: 'bg-success',
        error: 'bg-danger',
        info: 'bg-info'
    };

    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };

    const bgColor = colors[type] || colors.success;
    const icon = icons[type] || icons.success;

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

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    initMap();
    renderSavedAddresses();
});