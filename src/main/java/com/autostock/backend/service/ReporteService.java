package com.autostock.backend.service;

import com.autostock.backend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final ProductoRepository productoRepository;

    public Map<String, Object> reportePorCategoria() {
        Map<String, Long> categorias = productoRepository.findAll().stream()
                .filter(p -> p.getActivo())
                .collect(java.util.stream.Collectors.groupingBy(
                        p -> p.getCategoria(),
                        java.util.stream.Collectors.counting()
                ));

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("categorias", categorias);
        return reporte;
    }

    public Map<String, Object> reporteEstadoStock() {
        long normal = productoRepository.findAll().stream()
                .filter(p -> p.getActivo() && p.getStock() > 5).count();
        long bajo = productoRepository.findAll().stream()
                .filter(p -> p.getActivo() && p.getStock() > 0 && p.getStock() <= 5).count();
        long sinStock = productoRepository.findAll().stream()
                .filter(p -> p.getActivo() && p.getStock() == 0).count();

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("normal", normal);
        reporte.put("bajo", bajo);
        reporte.put("sinStock", sinStock);
        return reporte;
    }
}