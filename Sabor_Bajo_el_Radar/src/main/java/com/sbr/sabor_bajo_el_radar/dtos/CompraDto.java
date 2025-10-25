package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.Compra}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class CompraDto implements Serializable {
    private final Integer id;
    private final ClienteDto cliente;
    private final VendedorDto vendedor;
    private final BigDecimal total;
    private final String estado;
    private final Instant fecha;

    public CompraDto(Integer id, ClienteDto cliente, VendedorDto vendedor, BigDecimal total, String estado, Instant fecha) {
        this.id = id;
        this.cliente = cliente;
        this.vendedor = vendedor;
        this.total = total;
        this.estado = estado;
        this.fecha = fecha;
    }

    public Integer getId() {
        return id;
    }

    public ClienteDto getCliente() {
        return cliente;
    }

    public VendedorDto getVendedor() {
        return vendedor;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public String getEstado() {
        return estado;
    }

    public Instant getFecha() {
        return fecha;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CompraDto entity = (CompraDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.cliente, entity.cliente) &&
                Objects.equals(this.vendedor, entity.vendedor) &&
                Objects.equals(this.total, entity.total) &&
                Objects.equals(this.estado, entity.estado) &&
                Objects.equals(this.fecha, entity.fecha);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, cliente, vendedor, total, estado, fecha);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "cliente = " + cliente + ", " +
                "vendedor = " + vendedor + ", " +
                "total = " + total + ", " +
                "estado = " + estado + ", " +
                "fecha = " + fecha + ")";
    }
}