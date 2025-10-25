package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.Oferta}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class OfertaDto implements Serializable {
    private final Integer id;
    private final VendedorDto vendedor;
    private final ProductoDto producto;
    private final BigDecimal descuento;
    private final LocalDate fechaInicio;
    private final LocalDate fechaExpiracion;

    public OfertaDto(Integer id, VendedorDto vendedor, ProductoDto producto, BigDecimal descuento, LocalDate fechaInicio, LocalDate fechaExpiracion) {
        this.id = id;
        this.vendedor = vendedor;
        this.producto = producto;
        this.descuento = descuento;
        this.fechaInicio = fechaInicio;
        this.fechaExpiracion = fechaExpiracion;
    }

    public Integer getId() {
        return id;
    }

    public VendedorDto getVendedor() {
        return vendedor;
    }

    public ProductoDto getProducto() {
        return producto;
    }

    public BigDecimal getDescuento() {
        return descuento;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public LocalDate getFechaExpiracion() {
        return fechaExpiracion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OfertaDto entity = (OfertaDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.vendedor, entity.vendedor) &&
                Objects.equals(this.producto, entity.producto) &&
                Objects.equals(this.descuento, entity.descuento) &&
                Objects.equals(this.fechaInicio, entity.fechaInicio) &&
                Objects.equals(this.fechaExpiracion, entity.fechaExpiracion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, vendedor, producto, descuento, fechaInicio, fechaExpiracion);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "vendedor = " + vendedor + ", " +
                "producto = " + producto + ", " +
                "descuento = " + descuento + ", " +
                "fechaInicio = " + fechaInicio + ", " +
                "fechaExpiracion = " + fechaExpiracion + ")";
    }
}