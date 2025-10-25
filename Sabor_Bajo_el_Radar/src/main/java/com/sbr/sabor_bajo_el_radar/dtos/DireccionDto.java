package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.Direccion}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class DireccionDto implements Serializable {
    private final Integer id;
    private final UsuarioDto usuario;
    private final String barrio;
    private final String localidad;
    private final String direccion;
    private final String especificacion;

    public DireccionDto(Integer id, UsuarioDto usuario, String barrio, String localidad, String direccion, String especificacion) {
        this.id = id;
        this.usuario = usuario;
        this.barrio = barrio;
        this.localidad = localidad;
        this.direccion = direccion;
        this.especificacion = especificacion;
    }

    public Integer getId() {
        return id;
    }

    public UsuarioDto getUsuario() {
        return usuario;
    }

    public String getBarrio() {
        return barrio;
    }

    public String getLocalidad() {
        return localidad;
    }

    public String getDireccion() {
        return direccion;
    }

    public String getEspecificacion() {
        return especificacion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DireccionDto entity = (DireccionDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.usuario, entity.usuario) &&
                Objects.equals(this.barrio, entity.barrio) &&
                Objects.equals(this.localidad, entity.localidad) &&
                Objects.equals(this.direccion, entity.direccion) &&
                Objects.equals(this.especificacion, entity.especificacion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, usuario, barrio, localidad, direccion, especificacion);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "usuario = " + usuario + ", " +
                "barrio = " + barrio + ", " +
                "localidad = " + localidad + ", " +
                "direccion = " + direccion + ", " +
                "especificacion = " + especificacion + ")";
    }
}