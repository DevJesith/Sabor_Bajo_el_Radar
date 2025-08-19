package com.sbr.sabor_bajo_el_radar.model;

import jakarta.persistence.*;

@Entity
@Table(name = "negocio_vendedor")
public class NegocioVendedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id", nullable = false)
    private Vendedor vendedor;

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

    @Column(name = "email_negocio", nullable = false, length = 45)
    private String emailNegocio;

    @Lob
    @Column(name = "estado_negocio", nullable = false)
    private String estadoNegocio;

    @Column(name = "fecha_inaguracion", nullable = false, length = 45)
    private String fechaInaguracion;

    @Lob
    @Column(name = "esta_legalizado", nullable = false)
    private String estaLegalizado;

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

    public String getFechaInaguracion() {
        return fechaInaguracion;
    }

    public void setFechaInaguracion(String fechaInaguracion) {
        this.fechaInaguracion = fechaInaguracion;
    }

    public String getEstaLegalizado() {
        return estaLegalizado;
    }

    public void setEstaLegalizado(String estaLegalizado) {
        this.estaLegalizado = estaLegalizado;
    }

}