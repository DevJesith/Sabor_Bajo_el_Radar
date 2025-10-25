package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.MuroSocial}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class MuroSocialDto implements Serializable {
    private final Integer id;
    private final UsuarioDto usuario;
    private final String contenido;
    private final Instant fecha;

    public MuroSocialDto(Integer id, UsuarioDto usuario, String contenido, Instant fecha) {
        this.id = id;
        this.usuario = usuario;
        this.contenido = contenido;
        this.fecha = fecha;
    }

    public Integer getId() {
        return id;
    }

    public UsuarioDto getUsuario() {
        return usuario;
    }

    public String getContenido() {
        return contenido;
    }

    public Instant getFecha() {
        return fecha;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MuroSocialDto entity = (MuroSocialDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.usuario, entity.usuario) &&
                Objects.equals(this.contenido, entity.contenido) &&
                Objects.equals(this.fecha, entity.fecha);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, usuario, contenido, fecha);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "usuario = " + usuario + ", " +
                "contenido = " + contenido + ", " +
                "fecha = " + fecha + ")";
    }
}