package com.sbr.sabor_bajo_el_radar.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "negocio")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Negocio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_negocio", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "vendedor_id", nullable = false)
//    @JsonIgnoreProperties("negocios")
    private Vendedor vendedor;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "admin_id")
//    @JsonIgnoreProperties("negocios")
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
    private String estadoNegocio = "inactivo";

    @Lob
    @Column(name = "esta_legalizado", nullable = false)
    private String estaLegalizado;

    @ColumnDefault("'pendiente'")
    @Lob
    @Column(name = "estado", nullable = false)
    private String estado = "pendiente";

    @Column(name = "fecha_aprobacion")
    private Instant fechaAprobacion;

    // ⭐ CAMPO AÑADIDO: fecha_creacion
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "fecha_creacion")
    private Instant fechaCreacion;

    @Lob
    @Column(name = "motivo_rechazo")
    private String motivoRechazo;

    @Lob // Usamos @Lob para permitir strings muy largos (para imágenes en base64)
    @Column(name = "imagen_url")
    private String imagenUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Instant getFechaAprobacion() {
        return fechaAprobacion;
    }

    public void setFechaAprobacion(Instant fechaAprobacion) {
        this.fechaAprobacion = fechaAprobacion;
    }

    public Instant getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Instant fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getMotivoRechazo() {
        return motivoRechazo;
    }

    public void setMotivoRechazo(String motivoRechazo) {
        this.motivoRechazo = motivoRechazo;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
}