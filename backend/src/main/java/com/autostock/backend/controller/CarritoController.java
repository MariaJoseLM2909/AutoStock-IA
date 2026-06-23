package com.autostock.backend.controller;

import com.autostock.backend.dto.CarritoDTO;
import com.autostock.backend.dto.ItemCarritoRequestDTO;
import com.autostock.backend.service.CarritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CarritoController {

    private final CarritoService carritoService;

    @PostMapping("/items")
    public ResponseEntity<CarritoDTO> agregarItem(@RequestBody ItemCarritoRequestDTO dto) {
        return ResponseEntity.ok(carritoService.agregarItem(dto.getIdUsuario(), dto.getIdProducto(), dto.getCantidad()));
    }

    @GetMapping
    public ResponseEntity<CarritoDTO> obtenerCarrito(@RequestParam Long idUsuario) {
        return ResponseEntity.ok(carritoService.obtenerCarrito(idUsuario));
    }

    @PutMapping("/items/{idItem}")
    public ResponseEntity<CarritoDTO> actualizarCantidad(
            @PathVariable Long idItem,
            @RequestParam Integer cantidad) {
        return ResponseEntity.ok(carritoService.actualizarCantidad(idItem, cantidad));
    }

    @DeleteMapping("/items/{idItem}")
    public ResponseEntity<Void> eliminarItem(@PathVariable Long idItem) {
        carritoService.eliminarItem(idItem);
        return ResponseEntity.ok().build();
    }
}