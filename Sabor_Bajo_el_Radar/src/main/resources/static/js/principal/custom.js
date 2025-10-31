let contadorCliente = document.getElementById("contador-cliente");
let contadorVendedor = document.getElementById("contador-vendedor");
let contadorDomiciliario = document.getElementById("contador-domiciliario");

// Metas individuales
let metaCliente = 8000;
let metaVendedor = 5000;
let metaDomiciliario = 6500;
let velocidad = 1; // milisegundos

// Contadores independientes
let numeroCliente = 0;
let numeroVendedor = 0;
let numeroDomiciliario = 0;


// Intervalo Cliente
let intervaloCliente = setInterval(() => {
    if (numeroCliente < metaCliente) {
        numeroCliente++;
        contadorCliente.textContent = "+ " + numeroCliente;
    } else {
        clearInterval(intervaloCliente);
    }
}, velocidad);


let intervaloVendedor = setInterval(() => {
    if (numeroVendedor < metaVendedor) {
        numeroVendedor++;
        contadorVendedor.textContent = "+ " + numeroVendedor;
    } else {
        clearInterval(intervaloVendedor);
    }
}, velocidad);


// Intervalo Domiciliario
let intervaloDomiciliario = setInterval(() => {
    if (numeroDomiciliario < metaDomiciliario) {
        numeroDomiciliario++;
        contadorDomiciliario.textContent = "+ " + numeroDomiciliario;
    } else {
        clearInterval(intervaloDomiciliario);
    }
}, velocidad);
