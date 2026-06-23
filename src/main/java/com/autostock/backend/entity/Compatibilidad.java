package com.autostock.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "compatibilidades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Compatibilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCompatibilidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(nullable = false, length = 60)
    private String marcaVehiculo;

    @Column(nullable = false, length = 60)
    private String linea;

    @Column(nullable = false, length = 60)
    private String modelo;

    @Column(length = 10)
    private String anio;
}