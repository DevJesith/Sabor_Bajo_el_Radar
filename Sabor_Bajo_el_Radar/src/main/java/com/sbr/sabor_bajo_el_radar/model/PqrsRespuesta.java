package com.sbr.sabor_bajo_el_radar.model;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "pqrs_respuesta")
public class PqrsRespuesta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "pqrs_id", nullable = false)
    private Pqr pqrs;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "admin_id", nullable = false)
    private Admin admin;

    @Lob
    @Column(name = "respuesta", nullable = false)
    private String respuesta;

    @ColumnDefault("current_timestamp()")
    @Column(name = "fecha_respuesta", nullable = false)
    private Instant fechaRespuesta;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Pqr getPqrs() {
        return pqrs;
    }

    public void setPqrs(Pqr pqrs) {
        this.pqrs = pqrs;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }

    public Instant getFechaRespuesta() {
        return fechaRespuesta;
    }

    public void setFechaRespuesta(Instant fechaRespuesta) {
        this.fechaRespuesta = fechaRespuesta;
    }

}