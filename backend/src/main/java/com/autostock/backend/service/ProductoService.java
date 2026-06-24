package com.autostock.backend.service;

import com.autostock.backend.dto.*;
import com.autostock.backend.entity.*;
import com.autostock.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CompatibilidadRepository compatibilidadRepository;

    public List<ProductoDTO> listarTodos() {
        return productoRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> buscarConFiltros(String categoria, String marca, String busqueda) {
        List<Producto> productos;

        if (busqueda != null && !busqueda.isEmpty()) {
            productos = productoRepository.buscarPorTexto(busqueda);
        } else if (categoria != null && marca != null) {
            productos = productoRepository.findByCategoriaAndMarcaIgnoreCase(categoria, marca);
        } else if (categoria != null) {
            productos = productoRepository.findByCategoriaContainingIgnoreCase(categoria);
        } else if (marca != null) {
            productos = productoRepository.findByMarcaContainingIgnoreCase(marca);
        } else {
            productos = productoRepository.findAll();
        }

        return productos.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProductoDTO obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return mapToDTO(producto);
    }

    @Transactional
    public ProductoDTO crear(ProductoDTO dto) {
        Producto producto = Producto.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .precio(dto.getPrecio())
                .stock(dto.getStock())
                .imagenUrl(dto.getImagenUrl())
                .categoria(dto.getCategoria())
                .marca(dto.getMarca())
                .activo(true)
                .build();

        Producto guardado = productoRepository.save(producto);

        if (dto.getCompatibilidades() != null) {
            for (CompatibilidadDTO compDTO : dto.getCompatibilidades()) {
                Compatibilidad comp = Compatibilidad.builder()
                        .producto(guardado)
                        .marcaVehiculo(compDTO.getMarcaVehiculo())
                        .linea(compDTO.getLinea())
                        .modelo(compDTO.getModelo())
                        .anio(compDTO.getAnio())
                        .build();
                compatibilidadRepository.save(comp);
            }
        }

        return mapToDTO(guardado);
    }

    @Transactional
    public ProductoDTO actualizar(Long id, ProductoDTO dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setImagenUrl(dto.getImagenUrl());
        producto.setCategoria(dto.getCategoria());
        producto.setMarca(dto.getMarca());

        return mapToDTO(productoRepository.save(producto));
    }

    @Transactional
    public void eliminar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setActivo(false);
        productoRepository.save(producto);
    }

    public List<ProductoDTO> obtenerSugerencias(Long idProducto) {
        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Obtener marcas de vehículo compatibles con el producto actual
        List<String> marcasVehiculo = producto.getCompatibilidades().stream()
                .map(c -> c.getMarcaVehiculo().toLowerCase())
                .distinct()
                .collect(Collectors.toList());

        List<Producto> todos = productoRepository.findAll().stream()
                .filter(p -> !p.getIdProducto().equals(idProducto))
                .filter(p -> p.getActivo())
                .collect(Collectors.toList());

        // Prioridad 1: misma compatibilidad de vehículo
        List<Producto> porCompatibilidad = todos.stream()
                .filter(p -> p.getCompatibilidades().stream()
                        .anyMatch(c -> marcasVehiculo.contains(c.getMarcaVehiculo().toLowerCase())))
                .collect(Collectors.toList());

        // Prioridad 2: misma categoria
        List<Producto> porCategoria = todos.stream()
                .filter(p -> p.getCategoria().equalsIgnoreCase(producto.getCategoria()))
                .filter(p -> porCompatibilidad.stream().noneMatch(c -> c.getIdProducto().equals(p.getIdProducto())))
                .collect(Collectors.toList());

        // Combinar: compatibilidad primero, luego categoria, limite 4
        List<Producto> resultado = new java.util.ArrayList<>();
        resultado.addAll(porCompatibilidad);
        resultado.addAll(porCategoria);

        return resultado.stream()
                .limit(4)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ProductoDTO mapToDTO(Producto producto) {
        List<CompatibilidadDTO> comps = producto.getCompatibilidades().stream()
                .map(c -> CompatibilidadDTO.builder()
                        .idCompatibilidad(c.getIdCompatibilidad())
                        .marcaVehiculo(c.getMarcaVehiculo())
                        .linea(c.getLinea())
                        .modelo(c.getModelo())
                        .anio(c.getAnio())
                        .build())
                .collect(Collectors.toList());

        return ProductoDTO.builder()
                .idProducto(producto.getIdProducto())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .stock(producto.getStock())
                .imagenUrl(producto.getImagenUrl())
                .categoria(producto.getCategoria())
                .marca(producto.getMarca())
                .compatibilidades(comps)
                .build();
    }
}