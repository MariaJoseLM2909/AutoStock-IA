package com.autostock.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompatibilidadDTO {
    private Long idCompatibilidad;
    private String marcaVehiculo;
    private String linea;
    private String modelo;
    private String anio;
}
