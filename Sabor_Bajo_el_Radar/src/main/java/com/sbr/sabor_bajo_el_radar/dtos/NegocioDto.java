package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.Negocio}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class NegocioDto implements Serializable {
    private final Integer id;
    private final VendedorDto vendedor;
    private final AdminDto admin;
    private final String nombreNegocio;
    private final String descripcionNegocio;
    private final String ubicacionNegocio;
    private final String propietarioNegocio;
    private final String tipoNegocio;
    private final String emailNegocio;
    private final String estadoNegocio;
    private final String estaLegalizado;
    private final String aprobado;
    private final Instant fechaAprobacion;
    private final String motivoRechazo;

    public NegocioDto(Integer id, VendedorDto vendedor, AdminDto admin, String nombreNegocio, String descripcionNegocio, String ubicacionNegocio, String propietarioNegocio, String tipoNegocio, String emailNegocio, String estadoNegocio, String estaLegalizado, String aprobado, Instant fechaAprobacion, String motivoRechazo) {
        this.id = id;
        this.vendedor = vendedor;
        this.admin = admin;
        this.nombreNegocio = nombreNegocio;
        this.descripcionNegocio = descripcionNegocio;
        this.ubicacionNegocio = ubicacionNegocio;
        this.propietarioNegocio = propietarioNegocio;
        this.tipoNegocio = tipoNegocio;
        this.emailNegocio = emailNegocio;
        this.estadoNegocio = estadoNegocio;
        this.estaLegalizado = estaLegalizado;
        this.aprobado = aprobado;
        this.fechaAprobacion = fechaAprobacion;
        this.motivoRechazo = motivoRechazo;
    }

    public Integer getId() {
        return id;
    }

    public VendedorDto getVendedor() {
        return vendedor;
    }

    public AdminDto getAdmin() {
        return admin;
    }

    public String getNombreNegocio() {
        return nombreNegocio;
    }

    public String getDescripcionNegocio() {
        return descripcionNegocio;
    }

    public String getUbicacionNegocio() {
        return ubicacionNegocio;
    }

    public String getPropietarioNegocio() {
        return propietarioNegocio;
    }

    public String getTipoNegocio() {
        return tipoNegocio;
    }

    public String getEmailNegocio() {
        return emailNegocio;
    }

    public String getEstadoNegocio() {
        return estadoNegocio;
    }

    public String getEstaLegalizado() {
        return estaLegalizado;
    }

    public String getAprobado() {
        return aprobado;
    }

    public Instant getFechaAprobacion() {
        return fechaAprobacion;
    }

    public String getMotivoRechazo() {
        return motivoRechazo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NegocioDto entity = (NegocioDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.vendedor, entity.vendedor) &&
                Objects.equals(this.admin, entity.admin) &&
                Objects.equals(this.nombreNegocio, entity.nombreNegocio) &&
                Objects.equals(this.descripcionNegocio, entity.descripcionNegocio) &&
                Objects.equals(this.ubicacionNegocio, entity.ubicacionNegocio) &&
                Objects.equals(this.propietarioNegocio, entity.propietarioNegocio) &&
                Objects.equals(this.tipoNegocio, entity.tipoNegocio) &&
                Objects.equals(this.emailNegocio, entity.emailNegocio) &&
                Objects.equals(this.estadoNegocio, entity.estadoNegocio) &&
                Objects.equals(this.estaLegalizado, entity.estaLegalizado) &&
                Objects.equals(this.aprobado, entity.aprobado) &&
                Objects.equals(this.fechaAprobacion, entity.fechaAprobacion) &&
                Objects.equals(this.motivoRechazo, entity.motivoRechazo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, vendedor, admin, nombreNegocio, descripcionNegocio, ubicacionNegocio, propietarioNegocio, tipoNegocio, emailNegocio, estadoNegocio, estaLegalizado, aprobado, fechaAprobacion, motivoRechazo);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "vendedor = " + vendedor + ", " +
                "admin = " + admin + ", " +
                "nombreNegocio = " + nombreNegocio + ", " +
                "descripcionNegocio = " + descripcionNegocio + ", " +
                "ubicacionNegocio = " + ubicacionNegocio + ", " +
                "propietarioNegocio = " + propietarioNegocio + ", " +
                "tipoNegocio = " + tipoNegocio + ", " +
                "emailNegocio = " + emailNegocio + ", " +
                "estadoNegocio = " + estadoNegocio + ", " +
                "estaLegalizado = " + estaLegalizado + ", " +
                "aprobado = " + aprobado + ", " +
                "fechaAprobacion = " + fechaAprobacion + ", " +
                "motivoRechazo = " + motivoRechazo + ")";
    }
}