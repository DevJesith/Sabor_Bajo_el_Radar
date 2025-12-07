// ==========================================
// VARIABLES GLOBALES
// ==========================================
let map;
let marker;
// Coordenadas por defecto (Centro de Bogotá)
let selectedLocation = {
    lat: 4.6097,
    lng: -74.0817,
    address: ''
};

// Variable para almacenar las direcciones traídas del backend
let savedAddresses = [];

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    initMap();
    cargarDireccionesBackend(); // Carga real
    setupEventListeners();
});

// ==========================================
// API & BACKEND
// ==========================================

// Obtener headers con CSRF Token (Seguridad Spring Boot)
const getApiHeaders = () => {
    const token = document.querySelector('meta[name="_csrf"]')?.content || '';
    const headerName = document.querySelector('meta[name="_csrf_header"]')?.content || '';
    return {
        'Content-Type': 'application/json',
        [headerName]: token
    };
};

async function cargarDireccionesBackend() {
    const container = document.getElementById('savedAddressesList');
    container.innerHTML = '<div class="text-center py-3"><i class="fas fa-spinner fa-spin text-primary"></i> Cargando...</div>';

    try {
        const response = await fetch('/api/direcciones');
        if (!response.ok) throw new Error('Error cargando direcciones');

        savedAddresses = await response.json();
        renderSavedAddresses();

        // Si hay direcciones, centrar mapa en la predeterminada o la primera
        if (savedAddresses.length > 0) {
            const def = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
            centrarMapaEn(def.lat, def.lng);
        }

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="text-center text-danger">No se pudieron cargar las direcciones.</p>';
    }
}

async function saveNewAddress() {
    // 1. Validaciones básicas
    if (!document.getElementById('fullAddress').value || !document.getElementById('locality').value) {
        showNotification('Por favor completa los campos obligatorios', 'error');
        return;
    }

    // 2. Preparar el objeto DTO
    let tag = document.querySelector('input[name="addressTag"]:checked').value;
    if (tag === 'Otro' && document.getElementById('customTag').value) {
        tag = document.getElementById('customTag').value;
    }

    const editId = document.getElementById('formNuevaDireccion').dataset.editId;

    const dataDTO = {
        id: editId ? parseInt(editId) : null,
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

    try {
        // 3. Enviar al backend
        const response = await fetch('/api/direcciones', {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify(dataDTO)
        });

        if (!response.ok) throw new Error('Error al guardar');

        // 4. Actualizar UI
        showNotification('Dirección guardada correctamente', 'success');

        // Cerrar modal y recargar
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevaDireccion'));
        modal.hide();
        document.getElementById('formNuevaDireccion').reset();
        delete document.getElementById('formNuevaDireccion').dataset.editId;

        cargarDireccionesBackend();

    } catch (error) {
        showNotification('No se pudo guardar la dirección', 'error');
    }
}

async function deleteAddress(addressId) {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;

    try {
        const response = await fetch(`/api/direcciones/${addressId}`, {
            method: 'DELETE',
            headers: getApiHeaders()
        });

        if (response.ok) {
            showNotification('Dirección eliminada', 'info');
            cargarDireccionesBackend();
        } else {
            throw new Error('Error eliminando');
        }
    } catch (error) {
        showNotification('Error al eliminar la dirección', 'error');
    }
}

// ==========================================
// MAPA (LEAFLET)
// ==========================================

function initMap() {
    // Inicializar mapa
    map = L.map('map').setView([selectedLocation.lat, selectedLocation.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Icono rojo personalizado
    const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Marcador movible
    marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        draggable: true,
        icon: redIcon
    }).addTo(map);

    // Eventos del mapa
    marker.on('dragend', function (e) {
        const pos = marker.getLatLng();
        updateSelectedLocation(pos.lat, pos.lng);
    });

    map.on('click', function (e) {
        updateSelectedLocation(e.latlng.lat, e.latlng.lng);
    });
}

function updateSelectedLocation(lat, lng) {
    selectedLocation.lat = lat;
    selectedLocation.lng = lng;
    marker.setLatLng([lat, lng]);
    map.panTo([lat, lng]); // Centrar suavemente

    // Obtener dirección textual (Reverse Geocoding)
    reverseGeocode(lat, lng);
}

function centrarMapaEn(lat, lng) {
    if (map && marker) {
        updateSelectedLocation(lat, lng);
        map.setView([lat, lng], 16); // Zoom más cercano
    }
}

async function reverseGeocode(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await response.json();

        selectedLocation.address = data.display_name || 'Ubicación seleccionada';

        document.getElementById('selectedLocationInfo').style.display = 'block';
        document.getElementById('selectedAddressText').textContent = selectedLocation.address;
        document.getElementById('selectedCoords').textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    } catch (error) {
        selectedLocation.address = 'Ubicación sin nombre';
    }
}

function detectCurrentLocation() {
    if (navigator.geolocation) {
        showNotification('Detectando tu ubicación...', 'info');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const {latitude, longitude} = position.coords;
                centrarMapaEn(latitude, longitude);
                showNotification('Ubicación detectada', 'success');
            },
            () => showNotification('No se pudo obtener la ubicación GPS', 'error')
        );
    } else {
        showNotification('GPS no soportado', 'error');
    }
}

// ==========================================
// RENDERIZADO Y UI
// ==========================================

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

    container.innerHTML = savedAddresses.map(address => {
        // Lógica para el botón "Usar"
        let botonUsarHTML = '';

        if (address.isDefault) {
            // Si es la predeterminada, NO mostramos botón, sino un indicador
            botonUsarHTML = `
                <div class="text-success fw-bold text-center py-1" style="flex: 1; border: 1px solid #28a745; border-radius: 8px; background: white;">
                    <i class="fas fa-check-circle me-1"></i> Seleccionada
                </div>
            `;
        } else {
            // Si NO es predeterminada, mostramos el botón para seleccionarla
            botonUsarHTML = `
                <button class="btn-use-address" onclick="event.stopPropagation(); useAddress(${address.id})">
                    <i class="fas fa-check"></i> Usar
                </button>
            `;
        }

        return `
        <div class="address-card ${address.isDefault ? 'default-address' : ''}" 
             onclick="selectAddressForMap(${address.id})">
            
            <span class="address-tag tag-${address.tag ? address.tag.toLowerCase() : 'otro'}">
                <i class="fas fa-${getTagIcon(address.tag)}"></i> ${address.tag}
            </span>
            
            <p class="address-text mt-3"> <!-- Margen superior extra para que no pegue con el badge -->
                <strong style="font-size: 1.05rem;">${address.fullAddress}</strong><br>
                <span class="text-muted">${address.locality}, ${address.city}</span>
                ${address.details ? `<br><small class="text-muted fst-italic">${address.details}</small>` : ''}
            </p>
            
            <div class="address-actions">
                ${botonUsarHTML}
                <button class="btn-edit-address" onclick="event.stopPropagation(); editAddress(${address.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-address" onclick="event.stopPropagation(); deleteAddress(${address.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `
    }).join('');
}

// Cuando el usuario hace clic en una tarjeta de dirección
function selectAddressForMap(id) {
    const addr = savedAddresses.find(a => a.id === id);
    if (addr && addr.lat && addr.lng) {
        centrarMapaEn(addr.lat, addr.lng);
        // Scrollear hacia el mapa en móvil
        if (window.innerWidth < 992) {
            document.querySelector('.map-panel').scrollIntoView({behavior: 'smooth'});
        }
    }
}

function confirmLocation() {
    // Al confirmar en el mapa, abrimos el modal pre-llenado
    document.getElementById('fullAddress').value = selectedLocation.address;
    const modal = new bootstrap.Modal(document.getElementById('modalNuevaDireccion'));
    modal.show();
}

function editAddress(id) {
    const addr = savedAddresses.find(a => a.id === id);
    if (addr) {
        // Cargar datos en el form
        const tagRadio = document.querySelector(`input[name="addressTag"][value="${addr.tag}"]`);
        if (tagRadio) tagRadio.checked = true;
        else {
            document.getElementById('tagOtro').checked = true;
            document.getElementById('customTagDiv').style.display = 'block';
            document.getElementById('customTag').value = addr.tag;
        }

        document.getElementById('fullAddress').value = addr.fullAddress;
        document.getElementById('city').value = addr.city;
        document.getElementById('locality').value = addr.locality;
        document.getElementById('addressDetails').value = addr.details || '';
        document.getElementById('contactName').value = addr.contactName || '';
        document.getElementById('contactPhone').value = addr.contactPhone || '';
        document.getElementById('setAsDefault').checked = addr.isDefault;

        // Guardar ID en el form para saber que es edición
        document.getElementById('formNuevaDireccion').dataset.editId = id;

        // Actualizar coordenadas globales para que si guarda, mantenga la ubicación
        selectedLocation.lat = addr.lat;
        selectedLocation.lng = addr.lng;
        centrarMapaEn(addr.lat, addr.lng);

        const modal = new bootstrap.Modal(document.getElementById('modalNuevaDireccion'));
        modal.show();
    }
}

async function useAddress(addressId) {
    // Encontrar la dirección
    const address = savedAddresses.find(a => a.id === addressId);
    if (!address) return;

    // Crear objeto actualizado marcándola como default
    const updatedAddress = {...address, isDefault: true};

    try {
        // Reutilizamos el endpoint de guardar/actualizar
        const response = await fetch('/api/direcciones', {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify(updatedAddress)
        });

        if (!response.ok) throw new Error('Error al seleccionar dirección');

        showNotification('Dirección seleccionada como principal', 'success');

        // Recargar la lista para que se actualicen los botones
        cargarDireccionesBackend();

        // Opcional: Redirigir al home
        // setTimeout(() => window.location.href = '/cliente', 1000);

    } catch (error) {
        showNotification('No se pudo cambiar la dirección', 'error');
    }
}

// ==========================================
// HELPERS
// ==========================================

function getTagIcon(tag) {
    const icons = {'Casa': 'home', 'Trabajo': 'briefcase'};
    return icons[tag] || 'map-marker-alt';
}

function showNotification(message, type = 'success') {
    const colors = {success: 'bg-success', error: 'bg-danger', info: 'bg-info'};
    const notification = document.createElement('div');
    notification.className = 'position-fixed top-0 end-0 p-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="toast show align-items-center text-white ${colors[type] || 'bg-primary'} border-0">
            <div class="d-flex"><div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>
        </div>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = total;
}

function setupEventListeners() {
    // Radio buttons de tags
    document.querySelectorAll('input[name="addressTag"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const customDiv = document.getElementById('customTagDiv');
            customDiv.style.display = (this.value === 'Otro') ? 'block' : 'none';
        });
    });

    // Buscador local
    document.getElementById('searchAddressInput')?.addEventListener('input', function (e) {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.address-card');
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(term) ? 'block' : 'none';
        });
    });
}

function abrirModalNuevaDireccion() {
    // Limpiar formulario
    document.getElementById('formNuevaDireccion').reset();
    delete document.getElementById('formNuevaDireccion').dataset.editId;

    // Llenar con la dirección actual del mapa
    document.getElementById('fullAddress').value = selectedLocation.address || '';

    // Si no hay direcciones guardadas, marcar "Predeterminada" obligatoriamente y ocultar el check
    const checkDefault = document.getElementById('setAsDefault');
    if (savedAddresses.length === 0) {
        checkDefault.checked = true;
        checkDefault.disabled = true; // Forzar que la primera sea predeterminada
    } else {
        checkDefault.checked = false;
        checkDefault.disabled = false;
    }

    const modal = new bootstrap.Modal(document.getElementById('modalNuevaDireccion'));
    modal.show();
}