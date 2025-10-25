package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.Producto}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductoDto implements Serializable {
    private final Integer id;
    private final VendedorDto vendedor;
    private final String nombre;
    private final String descripcion;
    private final BigDecimal precio;
    private final Integer stock;
    private final String categoria;

    public ProductoDto(Integer id, VendedorDto vendedor, String nombre, String descripcion, BigDecimal precio, Integer stock, String categoria) {
        this.id = id;
        this.vendedor = vendedor;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
    }

    public Integer getId() {
        return id;
    }

    public VendedorDto getVendedor() {
        return vendedor;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public Integer getStock() {
        return stock;
    }

    public String getCategoria() {
        return categoria;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductoDto entity = (ProductoDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.vendedor, entity.vendedor) &&
                Objects.equals(this.nombre, entity.nombre) &&
                Objects.equals(this.descripcion, entity.descripcion) &&
                Objects.equals(this.precio, entity.precio) &&
                Objects.equals(this.stock, entity.stock) &&
                Objects.equals(this.categoria, entity.categoria);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, vendedor, nombre, descripcion, precio, stock, categoria);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "vendedor = " + vendedor + ", " +
                "nombre = " + nombre + ", " +
                "descripcion = " + descripcion + ", " +
                "precio = " + precio + ", " +
                "stock = " + stock + ", " +
                "categoria = " + categoria + ")";
    }
}