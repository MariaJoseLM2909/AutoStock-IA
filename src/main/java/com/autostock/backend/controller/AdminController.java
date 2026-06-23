package com.autostock.backend.controller;

import com.autostock.backend.dto.ProductoDTO;
import com.autostock.backend.service.ProductoService;
import com.autostock.backend.service.ReporteService;
import com.autostock.backend.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AdminController {

    private final ProductoService productoService;
    private final StockService stockService;
    private final ReporteService reporteService;

    @PostMapping("/productos")
    public ResponseEntity<ProductoDTO> crearProducto(@RequestBody ProductoDTO dto) {
        return ResponseEntity.ok(productoService.crear(dto));
    }

    @PutMapping("/productos/{id}")
    public ResponseEntity<ProductoDTO> actualizarProducto(@PathVariable Long id, @RequestBody ProductoDTO dto) {
        return ResponseEntity.ok(productoService.actualizar(id, dto));
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stock")
    public ResponseEntity<List<ProductoDTO>> listarStock() {
        return ResponseEntity.ok(stockService.listarStock());
    }

    @PutMapping("/stock/{id}")
    public ResponseEntity<ProductoDTO> actualizarStock(@PathVariable Long id, @RequestParam Integer cantidad) {
        return ResponseEntity.ok(stockService.actualizarStock(id, cantidad));
    }

    @GetMapping("/reportes/categorias")
    public ResponseEntity<Map<String, Object>> reporteCategorias() {
        return ResponseEntity.ok(reporteService.reportePorCategoria());
    }

    @GetMapping("/reportes/stock")
    public ResponseEntity<Map<String, Object>> reporteStock() {
        return ResponseEntity.ok(reporteService.reporteEstadoStock());
    }
}
