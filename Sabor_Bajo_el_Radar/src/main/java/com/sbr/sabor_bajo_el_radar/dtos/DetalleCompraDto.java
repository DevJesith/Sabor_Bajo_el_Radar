package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.DetalleCompra}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class DetalleCompraDto implements Serializable {
    private final Integer id;
    private final CompraDto compraIdCompra;
    private final ProductoDto producto;
    private final Integer cantidad;
    private final BigDecimal precioUnitario;
    private final BigDecimal subtotal;

    public DetalleCompraDto(Integer id, CompraDto compraIdCompra, ProductoDto producto, Integer cantidad, BigDecimal precioUnitario, BigDecimal subtotal) {
        this.id = id;
        this.compraIdCompra = compraIdCompra;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }

    public Integer getId() {
        return id;
    }

    public CompraDto getCompraIdCompra() {
        return compraIdCompra;
    }

    public ProductoDto getProducto() {
        return producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DetalleCompraDto entity = (DetalleCompraDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.compraIdCompra, entity.compraIdCompra) &&
                Objects.equals(this.producto, entity.producto) &&
                Objects.equals(this.cantidad, entity.cantidad) &&
                Objects.equals(this.precioUnitario, entity.precioUnitario) &&
                Objects.equals(this.subtotal, entity.subtotal);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, compraIdCompra, producto, cantidad, precioUnitario, subtotal);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "compraIdCompra = " + compraIdCompra + ", " +
                "producto = " + producto + ", " +
                "cantidad = " + cantidad + ", " +
                "precioUnitario = " + precioUnitario + ", " +
                "subtotal = " + subtotal + ")";
    }
}