package com.autostock.backend.controller;

import com.autostock.backend.dto.ProductoDTO;
import com.autostock.backend.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
// v0.4: CU-09 catalogo, CU-10 busqueda filtros, CU-11 detalle producto
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoDTO>> listar(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String busqueda) {
        return ResponseEntity.ok(productoService.buscarConFiltros(categoria, marca, busqueda));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    @GetMapping("/{id}/sugerencias")
    public ResponseEntity<List<ProductoDTO>> sugerencias(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerSugerencias(id));
    }
}
