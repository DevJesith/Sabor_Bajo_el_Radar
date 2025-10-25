package com.sbr.sabor_bajo_el_radar.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * DTO for {@link com.sbr.sabor_bajo_el_radar.model.Usuario}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class UsuarioDto implements Serializable {
    private final Integer id;
    private final String nombres;
    private final String apellidos;
    private final String documento;
    private final String telefono;
    private final String correo;
    private final String contraseña;
    private final String rol;
    private final LocalDate fechaRegistro;

    public UsuarioDto(Integer id, String nombres, String apellidos, String documento, String telefono, String correo, String contraseña, String rol, LocalDate fechaRegistro) {
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.documento = documento;
        this.telefono = telefono;
        this.correo = correo;
        this.contraseña = contraseña;
        this.rol = rol;
        this.fechaRegistro = fechaRegistro;
    }

    public Integer getId() {
        return id;
    }

    public String getNombres() {
        return nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public String getDocumento() {
        return documento;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public String getContraseña() {
        return contraseña;
    }

    public String getRol() {
        return rol;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsuarioDto entity = (UsuarioDto) o;
        return Objects.equals(this.id, entity.id) &&
                Objects.equals(this.nombres, entity.nombres) &&
                Objects.equals(this.apellidos, entity.apellidos) &&
                Objects.equals(this.documento, entity.documento) &&
                Objects.equals(this.telefono, entity.telefono) &&
                Objects.equals(this.correo, entity.correo) &&
                Objects.equals(this.contraseña, entity.contraseña) &&
                Objects.equals(this.rol, entity.rol) &&
                Objects.equals(this.fechaRegistro, entity.fechaRegistro);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nombres, apellidos, documento, telefono, correo, contraseña, rol, fechaRegistro);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "nombres = " + nombres + ", " +
                "apellidos = " + apellidos + ", " +
                "documento = " + documento + ", " +
                "telefono = " + telefono + ", " +
                "correo = " + correo + ", " +
                "contraseña = " + contraseña + ", " +
                "rol = " + rol + ", " +
                "fechaRegistro = " + fechaRegistro + ")";
    }
}