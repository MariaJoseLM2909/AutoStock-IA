package com.autostock.backend.service;

import com.autostock.backend.dto.ProductoDTO;
import com.autostock.backend.entity.Producto;
import com.autostock.backend.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockService {

    private final ProductoRepository productoRepository;

    public List<ProductoDTO> listarStock() {
        return productoRepository.findAll().stream()
                .filter(Producto::getActivo)
                .sorted((p1, p2) -> p1.getStock().compareTo(p2.getStock()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductoDTO actualizarStock(Long idProducto, Integer nuevoStock) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (nuevoStock < 0) {
            throw new RuntimeException("El stock no puede ser negativo");
        }

        producto.setStock(nuevoStock);
        return mapToDTO(productoRepository.save(producto));
    }

    private ProductoDTO mapToDTO(Producto producto) {
        return ProductoDTO.builder()
                .idProducto(producto.getIdProducto())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .stock(producto.getStock())
                .imagenUrl(producto.getImagenUrl())
                .categoria(producto.getCategoria())
                .marca(producto.getMarca())
                .build();
    }
}