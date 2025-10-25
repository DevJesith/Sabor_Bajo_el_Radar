package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.MedioDeTransporte}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class MedioDeTransporteDto implements Serializable {
    private final Integer id;
    private final DomiciliarioDto domiciliario;
    private final String tipoVehiculo;
    private final String placaVehiculo;
    private final String marca;
    private final String modelo;
    private final String color;
    private final Byte enUso;
    private final String estado;
    private final Instant fechaRegistro;

    public MedioDeTransporteDto(Integer id, DomiciliarioDto domiciliario, String tipoVehiculo, String placaVehiculo, String marca, String modelo, String color, Byte enUso, String estado, Instant fechaRegistro) {
        this.id = id;
        this.domiciliario = domiciliario;
        this.tipoVehiculo = tipoVehiculo;
        this.placaVehiculo = placaVehiculo;
        this.marca = marca;
        this.modelo = modelo;
        this.color = color;
        this.enUso = enUso;
        this.estado = estado;
        this.fechaRegistro = fechaRegistro;
    }

    public Integer getId() {
        return id;
    }

    public DomiciliarioDto getDomiciliario() {
        return domiciliario;
    }

    public String getTipoVehiculo() {
        return tipoVehiculo;
    }

    public String getPlacaVehiculo() {
        return placaVehiculo;
    }

    public String getMarca() {
        return marca;
    }

    public String getModelo() {
        return modelo;
    }

    public String getColor() {
        return color;
    }

    public Byte getEnUso() {
        return enUso;
    }

    public String getEstado() {
        return estado;
    }

    public Instant getFechaRegistro() {
        return fechaRegistro;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MedioDeTransporteDto entity = (MedioDeTransporteDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.domiciliario, entity.domiciliario) &&
                Objects.equals(this.tipoVehiculo, entity.tipoVehiculo) &&
                Objects.equals(this.placaVehiculo, entity.placaVehiculo) &&
                Objects.equals(this.marca, entity.marca) &&
                Objects.equals(this.modelo, entity.modelo) &&
                Objects.equals(this.color, entity.color) &&
                Objects.equals(this.enUso, entity.enUso) &&
                Objects.equals(this.estado, entity.estado) &&
                Objects.equals(this.fechaRegistro, entity.fechaRegistro);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, domiciliario, tipoVehiculo, placaVehiculo, marca, modelo, color, enUso, estado, fechaRegistro);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "domiciliario = " + domiciliario + ", " +
                "tipoVehiculo = " + tipoVehiculo + ", " +
                "placaVehiculo = " + placaVehiculo + ", " +
                "marca = " + marca + ", " +
                "modelo = " + modelo + ", " +
                "color = " + color + ", " +
                "enUso = " + enUso + ", " +
                "estado = " + estado + ", " +
                "fechaRegistro = " + fechaRegistro + ")";
    }
}