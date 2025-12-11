package com.sbr.sabor_bajo_el_radar.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;

@Setter
@Getter
@Entity
@Table(name = "compra")
public class Compra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_compra", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "vendedor_id", nullable = false)
    private Vendedor vendedor;

    @Column(name = "total", nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @ColumnDefault("'pendiente'")
    @Lob
    @Column(name = "estado", nullable = false)
    private String estado;

    @ColumnDefault("current_timestamp()")
    @Column(name = "fecha", nullable = false)
    private Instant fecha;

    @Lob
    @Column(name = "nota")
    private String nota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "domiciliario_id")
    private Usuario domiciliario;

    @Column(name = "ignorado", nullable = false)
    private boolean ignorado = false;

}