package com.sbr.sabor_bajo_el_radar.model;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(name = "factura")
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "compra_id_compra", nullable = false)
    private Compra compraIdCompra;

    @Column(name = "numero_factura", nullable = false, length = 45)
    private String numeroFactura;

    @Lob
    @Column(name = "metodo_pago", nullable = false)
    private String metodoPago;

    @Column(name = "banco", length = 45)
    private String banco;

    @ColumnDefault("current_timestamp()")
    @Column(name = "fecha_pago", nullable = false)
    private Instant fechaPago;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Compra getCompraIdCompra() {
        return compraIdCompra;
    }

    public void setCompraIdCompra(Compra compraIdCompra) {
        this.compraIdCompra = compraIdCompra;
    }

    public String getNumeroFactura() {
        return numeroFactura;
    }

    public void setNumeroFactura(String numeroFactura) {
        this.numeroFactura = numeroFactura;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getBanco() {
        return banco;
    }

    public void setBanco(String banco) {
        this.banco = banco;
    }

    public Instant getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(Instant fechaPago) {
        this.fechaPago = fechaPago;
    }

}