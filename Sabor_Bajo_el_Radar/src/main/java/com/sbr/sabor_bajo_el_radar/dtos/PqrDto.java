package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.Pqr}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class PqrDto implements Serializable {
    private final Integer id;
    private final UsuarioDto usuario;
    private final String tipo;
    private final String descripcion;
    private final String estado;
    private final Instant fecha;

    public PqrDto(Integer id, UsuarioDto usuario, String tipo, String descripcion, String estado, Instant fecha) {
        this.id = id;
        this.usuario = usuario;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.fecha = fecha;
    }

    public Integer getId() {
        return id;
    }

    public UsuarioDto getUsuario() {
        return usuario;
    }

    public String getTipo() {
        return tipo;
    }

    public String getDescripcion() {
        return descripcion;
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
        PqrDto entity = (PqrDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.usuario, entity.usuario) &&
                Objects.equals(this.tipo, entity.tipo) &&
                Objects.equals(this.descripcion, entity.descripcion) &&
                Objects.equals(this.estado, entity.estado) &&
                Objects.equals(this.fecha, entity.fecha);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, usuario, tipo, descripcion, estado, fecha);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "usuario = " + usuario + ", " +
                "tipo = " + tipo + ", " +
                "descripcion = " + descripcion + ", " +
                "estado = " + estado + ", " +
                "fecha = " + fecha + ")";
    }
}