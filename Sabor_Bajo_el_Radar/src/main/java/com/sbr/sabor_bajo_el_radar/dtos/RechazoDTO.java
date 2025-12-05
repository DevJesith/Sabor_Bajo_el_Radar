package com.sbr.sabor_bajo_el_radar.dtos;

import jakarta.validation.constraints.NotBlank;

public class RechazoDTO {

    @NotBlank(message = "El motivo de rechazo no puede estar vacio")
    private String motivo;

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}
