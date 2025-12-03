package com.sbr.sabor_bajo_el_radar.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class OfertaDTO {
    private Long id;

    @NotNull(message = "El ID del producto es obligatorio")
    private Long productoId;

    @NotBlank
    private String titulo;

    private String descripcion;

    @NotNull
    @Min(1)
    @Max(100)
    private BigDecimal descuento;

    @NotNull
    private LocalDate fechaInicio;

    @NotNull
    private LocalDate fechaExpiracion;
}