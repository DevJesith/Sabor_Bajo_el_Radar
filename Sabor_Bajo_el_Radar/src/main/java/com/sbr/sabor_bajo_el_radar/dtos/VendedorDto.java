package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sbr.sabor_bajo_el_radar.model.Vendedor;

import java.io.Serializable;
import java.util.Objects;

/**
 * DTO for {@link Vendedor}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class VendedorDto implements Serializable {
    private final Integer id;
    private final UsuarioDto usuario;

    public VendedorDto(Integer id, UsuarioDto usuario) {
        this.id = id;
        this.usuario = usuario;
    }

    public Integer getId() {
        return id;
    }

    public UsuarioDto getUsuario() {
        return usuario;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VendedorDto entity = (VendedorDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.usuario, entity.usuario);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, usuario);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "usuario = " + usuario + ")";
    }
}