package com.autostock.backend.dto;

import com.autostock.backend.entity.Rol;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {
    private Long idUsuario;
    private String email;
    private String nombre;
    private String apellido;
    private Rol rol;
}
