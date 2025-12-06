package com.sbr.sabor_bajo_el_radar.dtos;

import jakarta.validation.constraints.Size;

// Este DTO (Data Transfer Object) recibe los datos del formulario de edición del perfil.
public class PerfilUpdateDTO {

    // --- DATOS BÁSICOS ---
    // Se usan validaciones para asegurar que los datos no lleguen vacíos si se editan.

    @Size(min = 2, message = "Los nombres deben tener al menos 2 caracteres")
    private String nombres;

    @Size(min = 2, message = "Los apellidos deben tener al menos 2 caracteres")
    private String apellidos;

    @Size(min = 7, message = "El documento debe tener al menos 7 caracteres")
    private String documento;

    @Size(min = 10, message = "El teléfono debe tener al menos 10 caracteres")
    private String telefono;

    // --- CAMPOS PARA CAMBIO DE CONTRASEÑA (OPCIONALES) ---
    // Estos campos pueden llegar vacíos si el usuario no quiere cambiar su contraseña.

    private String contrasenaActual;
    private String nuevaContrasena;

    // --- GETTERS Y SETTERS (Necesarios para que Spring pueda leer los datos) ---

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getContrasenaActual() {
        return contrasenaActual;
    }

    public void setContrasenaActual(String contrasenaActual) {
        this.contrasenaActual = contrasenaActual;
    }

    public String getNuevaContrasena() {
        return nuevaContrasena;
    }

    public void setNuevaContrasena(String nuevaContrasena) {
        this.nuevaContrasena = nuevaContrasena;
    }
}