package com.autostock.backend.controller;

import com.autostock.backend.dto.CarritoDTO;
import com.autostock.backend.service.CarritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
// v0.5: CU-12 agregar item, CU-13 modificar cantidad, CU-14 eliminar item
public class CarritoController {

    private final CarritoService carritoService;

    @PostMapping("/items")
    public ResponseEntity<CarritoDTO> agregarItem(
            @RequestParam Long idUsuario,
            @RequestParam Long idProducto,
            @RequestParam(defaultValue = "1") Integer cantidad) {
        return ResponseEntity.ok(carritoService.agregarItem(idUsuario, idProducto, cantidad));
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
