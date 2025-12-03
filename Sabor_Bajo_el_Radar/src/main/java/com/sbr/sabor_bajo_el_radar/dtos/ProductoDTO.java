package com.sbr.sabor_bajo_el_radar.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductoDTO {
    private Long id;

    @NotNull(message = "El ID del negocio es obligatorio")
    private Long negocioId;

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @Min(0)
    private BigDecimal precio;

    @NotNull(message = "El stock es obligatorio")
    @Min(0)
    private Integer stock;

    @NotBlank(message = "La categoría es obligatoria")
    private String categoria;
}