package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.Ruta}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class RutaDto implements Serializable {
    private final Integer id;
    private final CompraDto compraIdCompra;
    private final DomiciliarioDto domiciliario;
    private final String estado;
    private final String tiempoEstimado;
    private final String direccionEntrega;
    private final BigDecimal costoEnvio;
    private final BigDecimal distanciaKm;
    private final Integer calificacion;

    public RutaDto(Integer id, CompraDto compraIdCompra, DomiciliarioDto domiciliario, String estado, String tiempoEstimado, String direccionEntrega, BigDecimal costoEnvio, BigDecimal distanciaKm, Integer calificacion) {
        this.id = id;
        this.compraIdCompra = compraIdCompra;
        this.domiciliario = domiciliario;
        this.estado = estado;
        this.tiempoEstimado = tiempoEstimado;
        this.direccionEntrega = direccionEntrega;
        this.costoEnvio = costoEnvio;
        this.distanciaKm = distanciaKm;
        this.calificacion = calificacion;
    }

    public Integer getId() {
        return id;
    }

    public CompraDto getCompraIdCompra() {
        return compraIdCompra;
    }

    public DomiciliarioDto getDomiciliario() {
        return domiciliario;
    }

    public String getEstado() {
        return estado;
    }

    public String getTiempoEstimado() {
        return tiempoEstimado;
    }

    public String getDireccionEntrega() {
        return direccionEntrega;
    }

    public BigDecimal getCostoEnvio() {
        return costoEnvio;
    }

    public BigDecimal getDistanciaKm() {
        return distanciaKm;
    }

    public Integer getCalificacion() {
        return calificacion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RutaDto entity = (RutaDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.compraIdCompra, entity.compraIdCompra) &&
                Objects.equals(this.domiciliario, entity.domiciliario) &&
                Objects.equals(this.estado, entity.estado) &&
                Objects.equals(this.tiempoEstimado, entity.tiempoEstimado) &&
                Objects.equals(this.direccionEntrega, entity.direccionEntrega) &&
                Objects.equals(this.costoEnvio, entity.costoEnvio) &&
                Objects.equals(this.distanciaKm, entity.distanciaKm) &&
                Objects.equals(this.calificacion, entity.calificacion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, compraIdCompra, domiciliario, estado, tiempoEstimado, direccionEntrega, costoEnvio, distanciaKm, calificacion);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "compraIdCompra = " + compraIdCompra + ", " +
                "domiciliario = " + domiciliario + ", " +
                "estado = " + estado + ", " +
                "tiempoEstimado = " + tiempoEstimado + ", " +
                "direccionEntrega = " + direccionEntrega + ", " +
                "costoEnvio = " + costoEnvio + ", " +
                "distanciaKm = " + distanciaKm + ", " +
                "calificacion = " + calificacion + ")";
    }
}