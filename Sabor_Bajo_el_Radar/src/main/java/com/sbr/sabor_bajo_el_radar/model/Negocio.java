package com.sbr.sabor_bajo_el_radar.model;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "negocio")
public class Negocio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_negocio", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "vendedor_id", nullable = false)
    private Vendedor vendedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @Column(name = "nombre_negocio", nullable = false, length = 100)
    private String nombreNegocio;

    @Lob
    @Column(name = "descripcion_negocio")
    private String descripcionNegocio;

    @Column(name = "ubicacion_negocio", nullable = false)
    private String ubicacionNegocio;

    @Column(name = "propietario_negocio", nullable = false, length = 45)
    private String propietarioNegocio;

    @Lob
    @Column(name = "tipo_negocio", nullable = false)
    private String tipoNegocio;

    @Column(name = "email_negocio", length = 45)
    private String emailNegocio;

    @ColumnDefault("'inactivo'")
    @Lob
    @Column(name = "estado_negocio", nullable = false)
    private String estadoNegocio;

    @Lob
    @Column(name = "esta_legalizado", nullable = false)
    private String estaLegalizado;

    @ColumnDefault("'pendiente'")
    @Lob
    @Column(name = "aprobado", nullable = false)
    private String aprobado;

    @Column(name = "fecha_aprobacion")
    private Instant fechaAprobacion;

    @Lob
    @Column(name = "motivo_rechazo")
    private String motivoRechazo;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Vendedor getVendedor() {
        return vendedor;
    }

    public void setVendedor(Vendedor vendedor) {
        this.vendedor = vendedor;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public String getNombreNegocio() {
        return nombreNegocio;
    }

    public void setNombreNegocio(String nombreNegocio) {
        this.nombreNegocio = nombreNegocio;
    }

    public String getDescripcionNegocio() {
        return descripcionNegocio;
    }

    public void setDescripcionNegocio(String descripcionNegocio) {
        this.descripcionNegocio = descripcionNegocio;
    }

    public String getUbicacionNegocio() {
        return ubicacionNegocio;
    }

    public void setUbicacionNegocio(String ubicacionNegocio) {
        this.ubicacionNegocio = ubicacionNegocio;
    }

    public String getPropietarioNegocio() {
        return propietarioNegocio;
    }

    public void setPropietarioNegocio(String propietarioNegocio) {
        this.propietarioNegocio = propietarioNegocio;
    }

    public String getTipoNegocio() {
        return tipoNegocio;
    }

    public void setTipoNegocio(String tipoNegocio) {
        this.tipoNegocio = tipoNegocio;
    }

    public String getEmailNegocio() {
        return emailNegocio;
    }

    public void setEmailNegocio(String emailNegocio) {
        this.emailNegocio = emailNegocio;
    }

    public String getEstadoNegocio() {
        return estadoNegocio;
    }

    public void setEstadoNegocio(String estadoNegocio) {
        this.estadoNegocio = estadoNegocio;
    }

    public String getEstaLegalizado() {
        return estaLegalizado;
    }

    public void setEstaLegalizado(String estaLegalizado) {
        this.estaLegalizado = estaLegalizado;
    }

    public String getAprobado() {
        return aprobado;
    }

    public void setAprobado(String aprobado) {
        this.aprobado = aprobado;
    }

    public Instant getFechaAprobacion() {
        return fechaAprobacion;
    }

    public void setFechaAprobacion(Instant fechaAprobacion) {
        this.fechaAprobacion = fechaAprobacion;
    }

    public String getMotivoRechazo() {
        return motivoRechazo;
    }

    public void setMotivoRechazo(String motivoRechazo) {
        this.motivoRechazo = motivoRechazo;
    }

}