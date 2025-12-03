package com.sbr.sabor_bajo_el_radar.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NegocioDTO {
    private Long id;

    @NotBlank(message = "El nombre del negocio es obligatorio")
    @Size(max = 100)
    private String nombreNegocio;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcionNegocio;

    @NotBlank
    private String ubicacionNegocio;

    // Este campo lo asigna el servidor, no es obligatorio en la petición.
    private String propietarioNegocio;

    @NotBlank
    private String tipoNegocio;

    private String emailNegocio;
    private String estadoNegocio;
    private String imagenUrl;
    private String estaLegalizado;
}