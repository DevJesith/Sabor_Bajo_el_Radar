package com.sbr.sabor_bajo_el_radar.dtos;

import jakarta.validation.constraints.NotBlank;

public class MetodoPagoDTO {
    @NotBlank
    private String tipo; // TARJETA, NEQUI, DAVIPLATA

    private String franquicia; // Visa, Mastercard (calculado en front o back)

    @NotBlank
    private String numero; // Número completo (el back lo enmascarará)

    @NotBlank
    private String titular;

    private String fechaVencimiento; // Opcional si es Nequi

    // Getters y Setters
    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getFranquicia() {
        return franquicia;
    }

    public void setFranquicia(String franquicia) {
        this.franquicia = franquicia;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getTitular() {
        return titular;
    }

    public void setTitular(String titular) {
        this.titular = titular;
    }

    public String getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(String fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
}