package com.sbr.sabor_bajo_el_radar.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "metodo_pago")
public class MetodoPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Usuario usuario;

    // Valores esperados: "TARJETA", "NEQUI", "DAVIPLATA", "PSE"
    @Column(nullable = false, length = 20)
    private String tipo;

    // Para tarjeta: "Visa", "Mastercard". Para billetera: "Celular"
    @Column(length = 20)
    private String franquicia;

    // Guardar solo los últimos 4 dígitos para visualización o el número de celular
    @Column(nullable = false, length = 20)
    private String numeroMascara;

    @Column(nullable = false)
    private String titular;

    // Solo para tarjetas (MM/AA)
    @Column(length = 5)
    private String fechaVencimiento;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getFranquicia() {
        return franquicia;
    }

    public void setFranquicia(String franquicia) {
        this.franquicia = franquicia;
    }

    public String getNumeroMascara() {
        return numeroMascara;
    }

    public void setNumeroMascara(String numeroMascara) {
        this.numeroMascara = numeroMascara;
    }

    public String getTitular() {
        return titular;
    }

    public void setTitular(String titular) {
        this.titular = titular;
    }

    public String getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(String fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }
}