package com.autostock.backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarritoDTO {
    private Long idCarrito;
    private Long idUsuario;
    private List<ItemCarritoDTO> items;
    private BigDecimal total;
}