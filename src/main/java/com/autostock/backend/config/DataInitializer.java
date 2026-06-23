package com.autostock.backend.config;

import com.autostock.backend.entity.*;
import com.autostock.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductoRepository productoRepository;
    private final CompatibilidadRepository compatibilidadRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Crear admin
        if (!usuarioRepository.existsByEmail("admin@autostock.com")) {
            Usuario admin = Usuario.builder()
                    .nombre("Admin")
                    .apellido("Sistema")
                    .email("admin@autostock.com")
                    .password(passwordEncoder.encode("admin123"))
                    .rol(Rol.ADMINISTRADOR)
                    .activo(true)
                    .build();
            usuarioRepository.save(admin);
        }

        // Crear productos solo si no hay ninguno
        if (productoRepository.count() == 0) {
            crearProductos();
        }
    }

    private void crearProductos() {
        Producto p1 = Producto.builder()
                .nombre("Filtro de aceite premium OEM")
                .descripcion("Filtro de aceite de alta calidad para motores nafteros")
                .precio(new BigDecimal("12500.00"))
                .stock(35)
                .categoria("Filtros")
                .marca("Bosch")
                .imagenUrl("https://picsum.photos/seed/filtro1/400/300")
                .activo(true)
                .build();
        p1 = productoRepository.save(p1);

        compatibilidadRepository.save(Compatibilidad.builder()
                .producto(p1).marcaVehiculo("Toyota").linea("Corolla").modelo("XLI").anio("2018-2022").build());
        compatibilidadRepository.save(Compatibilidad.builder()
                .producto(p1).marcaVehiculo("Toyota").linea("Corolla").modelo("SEG").anio("2019-2023").build());

        Producto p2 = Producto.builder()
                .nombre("Pastillas de freno delanteras cerámicas")
                .descripcion("Pastillas de freno cerámicas de alto rendimiento")
                .precio(new BigDecimal("28900.00"))
                .stock(12)
                .categoria("Frenos")
                .marca("Brembo")
                .imagenUrl("https://picsum.photos/seed/freno1/400/300")
                .activo(true)
                .build();
        p2 = productoRepository.save(p2);

        Producto p3 = Producto.builder()
                .nombre("Amortiguador trasero reforzado")
                .descripcion("Amortiguador gas reforzado para carga pesada")
                .precio(new BigDecimal("45000.00"))
                .stock(5)
                .categoria("Suspensión")
                .marca("Monroe")
                .imagenUrl("https://picsum.photos/seed/amort1/400/300")
                .activo(true)
                .build();
        p3 = productoRepository.save(p3);

        Producto p4 = Producto.builder()
                .nombre("Bujía de encendido iridio")
                .descripcion("Bujía NGK iridio alto rendimiento")
                .precio(new BigDecimal("3200.00"))
                .stock(72)
                .categoria("Motor")
                .marca("NGK")
                .imagenUrl("https://picsum.photos/seed/bujia1/400/300")
                .activo(true)
                .build();
        p4 = productoRepository.save(p4);

        Producto p5 = Producto.builder()
                .nombre("Correa de distribución reforzada")
                .descripcion("Correa distribución Dayco reforzada")
                .precio(new BigDecimal("18500.00"))
                .stock(8)
                .categoria("Distribución")
                .marca("Dayco")
                .imagenUrl("https://picsum.photos/seed/correa1/400/300")
                .activo(true)
                .build();
        p5 = productoRepository.save(p5);

        Producto p6 = Producto.builder()
                .nombre("Radiador de aluminio alta capacidad")
                .descripcion("Radiador aluminio full efficience")
                .precio(new BigDecimal("85000.00"))
                .stock(0)
                .categoria("Refrigeración")
                .marca("Valeo")
                .imagenUrl("https://picsum.photos/seed/rad1/400/300")
                .activo(true)
                .build();
        p6 = productoRepository.save(p6);

        Producto p7 = Producto.builder()
                .nombre("Bomba de agua con rodamiento cerámico")
                .descripcion("Bomba agua SKF con rodamiento cerámico")
                .precio(new BigDecimal("32000.00"))
                .stock(15)
                .categoria("Refrigeración")
                .marca("SKF")
                .imagenUrl("https://picsum.photos/seed/bomba1/400/300")
                .activo(true)
                .build();
        p7 = productoRepository.save(p7);

        Producto p8 = Producto.builder()
                .nombre("Kit de embrague completo")
                .descripcion("Kit embrague Valeo con plato, disco y rulemán")
                .precio(new BigDecimal("95000.00"))
                .stock(3)
                .categoria("Transmisión")
                .marca("Valeo")
                .imagenUrl("https://picsum.photos/seed/embrague1/400/300")
                .activo(true)
                .build();
        p8 = productoRepository.save(p8);

        Producto p9 = Producto.builder()
                .nombre("Sensor de oxígeno universal")
                .descripcion("Sensor O2 Bosch universal 4 cables")
                .precio(new BigDecimal("15800.00"))
                .stock(20)
                .categoria("Motor")
                .marca("Bosch")
                .imagenUrl("https://picsum.photos/seed/sensor1/400/300")
                .activo(true)
                .build();
        p9 = productoRepository.save(p9);

        Producto p10 = Producto.builder()
                .nombre("Filtro de aire alta eficiencia")
                .descripcion("Filtro aire Mann-Filter para motores diesel")
                .precio(new BigDecimal("8900.00"))
                .stock(28)
                .categoria("Filtros")
                .marca("Mann-Filter")
                .imagenUrl("https://picsum.photos/seed/aire1/400/300")
                .activo(true)
                .build();
        p10 = productoRepository.save(p10);
    }
}