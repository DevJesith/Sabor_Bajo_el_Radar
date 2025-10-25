package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.Admin}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AdminDto implements Serializable {
    private final Integer id;
    private final UsuarioDto usuario;
    private final String cargo;
    private final Instant fechaAsignacion;

    public AdminDto(Integer id, UsuarioDto usuario, String cargo, Instant fechaAsignacion) {
        this.id = id;
        this.usuario = usuario;
        this.cargo = cargo;
        this.fechaAsignacion = fechaAsignacion;
    }

    public Integer getId() {
        return id;
    }

    public UsuarioDto getUsuario() {
        return usuario;
    }

    public String getCargo() {
        return cargo;
    }

    public Instant getFechaAsignacion() {
        return fechaAsignacion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AdminDto entity = (AdminDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.usuario, entity.usuario) &&
                Objects.equals(this.cargo, entity.cargo) &&
                Objects.equals(this.fechaAsignacion, entity.fechaAsignacion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, usuario, cargo, fechaAsignacion);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "usuario = " + usuario + ", " +
                "cargo = " + cargo + ", " +
                "fechaAsignacion = " + fechaAsignacion + ")";
    }
}