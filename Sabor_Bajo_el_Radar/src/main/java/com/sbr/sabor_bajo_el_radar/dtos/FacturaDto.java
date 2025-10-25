package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.Factura}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class FacturaDto implements Serializable {
    private final Integer id;
    private final CompraDto compraIdCompra;
    private final String numeroFactura;
    private final String metodoPago;
    private final String banco;
    private final Instant fechaPago;

    public FacturaDto(Integer id, CompraDto compraIdCompra, String numeroFactura, String metodoPago, String banco, Instant fechaPago) {
        this.id = id;
        this.compraIdCompra = compraIdCompra;
        this.numeroFactura = numeroFactura;
        this.metodoPago = metodoPago;
        this.banco = banco;
        this.fechaPago = fechaPago;
    }

    public Integer getId() {
        return id;
    }

    public CompraDto getCompraIdCompra() {
        return compraIdCompra;
    }

    public String getNumeroFactura() {
        return numeroFactura;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public String getBanco() {
        return banco;
    }

    public Instant getFechaPago() {
        return fechaPago;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FacturaDto entity = (FacturaDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.compraIdCompra, entity.compraIdCompra) &&
                Objects.equals(this.numeroFactura, entity.numeroFactura) &&
                Objects.equals(this.metodoPago, entity.metodoPago) &&
                Objects.equals(this.banco, entity.banco) &&
                Objects.equals(this.fechaPago, entity.fechaPago);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, compraIdCompra, numeroFactura, metodoPago, banco, fechaPago);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "compraIdCompra = " + compraIdCompra + ", " +
                "numeroFactura = " + numeroFactura + ", " +
                "metodoPago = " + metodoPago + ", " +
                "banco = " + banco + ", " +
                "fechaPago = " + fechaPago + ")";
    }
}