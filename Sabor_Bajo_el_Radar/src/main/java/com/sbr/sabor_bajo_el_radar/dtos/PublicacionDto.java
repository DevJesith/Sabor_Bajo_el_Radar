package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.Publicacion}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class PublicacionDto implements Serializable {
    private final Integer id;
    private final MuroSocialDto muro;
    private final String imagen;
    private final String descripcion;
    private final Instant fecha;

    public PublicacionDto(Integer id, MuroSocialDto muro, String imagen, String descripcion, Instant fecha) {
        this.id = id;
        this.muro = muro;
        this.imagen = imagen;
        this.descripcion = descripcion;
        this.fecha = fecha;
    }

    public Integer getId() {
        return id;
    }

    public MuroSocialDto getMuro() {
        return muro;
    }

    public String getImagen() {
        return imagen;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Instant getFecha() {
        return fecha;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PublicacionDto entity = (PublicacionDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.muro, entity.muro) &&
                Objects.equals(this.imagen, entity.imagen) &&
                Objects.equals(this.descripcion, entity.descripcion) &&
                Objects.equals(this.fecha, entity.fecha);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, muro, imagen, descripcion, fecha);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "muro = " + muro + ", " +
                "imagen = " + imagen + ", " +
                "descripcion = " + descripcion + ", " +
                "fecha = " + fecha + ")";
    }
}