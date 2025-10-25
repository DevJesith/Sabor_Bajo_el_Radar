package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sbr.sabor_bajo_el_radar.model.PqrsRespuesta;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * DTO for {@link PqrsRespuesta}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class PqrsRespuestaDto implements Serializable {
    private final Integer id;
    private final PqrDto pqrs;
    private final AdminDto admin;
    private final String respuesta;
    private final Instant fechaRespuesta;

    public PqrsRespuestaDto(Integer id, PqrDto pqrs, AdminDto admin, String respuesta, Instant fechaRespuesta) {
        this.id = id;
        this.pqrs = pqrs;
        this.admin = admin;
        this.respuesta = respuesta;
        this.fechaRespuesta = fechaRespuesta;
    }

    public Integer getId() {
        return id;
    }

    public PqrDto getPqrs() {
        return pqrs;
    }

    public AdminDto getAdmin() {
        return admin;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public Instant getFechaRespuesta() {
        return fechaRespuesta;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PqrsRespuestaDto entity = (PqrsRespuestaDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.pqrs, entity.pqrs) &&
                Objects.equals(this.admin, entity.admin) &&
                Objects.equals(this.respuesta, entity.respuesta) &&
                Objects.equals(this.fechaRespuesta, entity.fechaRespuesta);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, pqrs, admin, respuesta, fechaRespuesta);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "pqrs = " + pqrs + ", " +
                "admin = " + admin + ", " +
                "respuesta = " + respuesta + ", " +
                "fechaRespuesta = " + fechaRespuesta + ")";
    }
}