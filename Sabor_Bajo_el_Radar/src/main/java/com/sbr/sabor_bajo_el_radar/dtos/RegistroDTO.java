package com.sbr.sabor_bajo_el_radar.dtos;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;


public class RegistroDTO {

    // Empezamos validando campos

    // nombres
    @Getter
    @Setter
    @NotBlank(message = "Los nombres son obligatorios")
    @Size(min = 2, max = 50, message = "Los nombres deben tener entre 2 y 50 caracteres")
    private String nombres;

    // apellidos
    @Getter
    @Setter
    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(min = 2, max = 50, message = "Los apellidos deben tener entre 2 y 50 caracteres")
    private String apellidos;

    // documento
    @Getter
    @Setter
    @NotBlank(message = "El documento es importante")
    @Size(min = 8, max = 10, message = "El documento debe tener minimo 8 y maximo 10 numeros")
    private String documento;

    // Telefono
    @Getter
    @Setter
    @NotBlank(message = "El telefono es obligatorio")
    @Size(min = 10, max = 12, message = "El numero debe tener minimo 9 y maximo 12 digitos")
    private String telefono;

    // Correo
    @Getter
    @Setter
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El Correo debe ser valido")
    @Size(max = 100, message = "El correo no puede tener mas de 100 caracteres")
    private String correo;

    // Contraseña
    @Getter
    @Setter
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(max = 100, message = "La contraseña no puede tener mas de 100 caracteres")
    private String contrasena;

    // confirmar contraseña
    @Getter
    @Setter
    @NotBlank(message = "Debes confirmar tu contraseña")
    private String confirmarContrasena;

    // Rol
    @Getter
    @Setter
    @NotBlank(message = "Debes seleccionar tu rol")
    private String rol;

    // getters and setter
}
