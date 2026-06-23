package com.autostock.backend.dto;

import lombok.Data;

@Data
public class ItemCarritoRequestDTO {
    private Long idUsuario;
    private Long idProducto;
    private Integer cantidad = 1;
}