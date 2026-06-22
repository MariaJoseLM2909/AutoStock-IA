package com.autostock.backend.service;

import com.autostock.backend.dto.*;
import com.autostock.backend.entity.*;
import com.autostock.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final ItemCarritoRepository itemCarritoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public CarritoDTO agregarItem(Long idUsuario, Long idProducto, Integer cantidad) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (producto.getStock() < cantidad) {
            throw new RuntimeException("Stock insuficiente");
        }

        Carrito carrito = carritoRepository.findByUsuarioIdUsuario(idUsuario)
                .orElseGet(() -> {
                    Carrito nuevo = Carrito.builder()
                            .usuario(usuario)
                            .items(new ArrayList<>())
                            .build();
                    return carritoRepository.save(nuevo);
                });

        ItemCarrito item = itemCarritoRepository
                .findByCarritoIdCarritoAndProductoIdProducto(carrito.getIdCarrito(), idProducto)
                .orElse(null);

        if (item != null) {
            item.setCantidad(item.getCantidad() + cantidad);
            itemCarritoRepository.save(item);
        } else {
            ItemCarrito nuevoItem = ItemCarrito.builder()
                    .carrito(carrito)
                    .producto(producto)
                    .cantidad(cantidad)
                    .precioUnitario(producto.getPrecio())
                    .build();
            itemCarritoRepository.save(nuevoItem);
            carrito.getItems().add(nuevoItem);
        }

        return mapToDTO(carrito);
    }

    public CarritoDTO obtenerCarrito(Long idUsuario) {
        Carrito carrito = carritoRepository.findByUsuarioIdUsuario(idUsuario)
                .orElse(Carrito.builder().items(new ArrayList<>()).build());
        return mapToDTO(carrito);
    }

    @Transactional
    public CarritoDTO actualizarCantidad(Long idItem, Integer cantidad) {
        ItemCarrito item = itemCarritoRepository.findById(idItem)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));

        if (cantidad <= 0) {
            itemCarritoRepository.delete(item);
        } else {
            if (item.getProducto().getStock() < cantidad) {
                throw new RuntimeException("Stock insuficiente");
            }
            item.setCantidad(cantidad);
            itemCarritoRepository.save(item);
        }

        return obtenerCarrito(item.getCarrito().getUsuario().getIdUsuario());
    }

    @Transactional
    public void eliminarItem(Long idItem) {
        ItemCarrito item = itemCarritoRepository.findById(idItem)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        itemCarritoRepository.delete(item);
    }

    private CarritoDTO mapToDTO(Carrito carrito) {
        List<ItemCarritoDTO> items = carrito.getItems().stream()
                .map(i -> ItemCarritoDTO.builder()
                        .idItemCarrito(i.getIdItemCarrito())
                        .idProducto(i.getProducto().getIdProducto())
                        .nombreProducto(i.getProducto().getNombre())
                        .imagenProducto(i.getProducto().getImagenUrl())
                        .cantidad(i.getCantidad())
                        .precioUnitario(i.getPrecioUnitario())
                        .subtotal(i.getPrecioUnitario().multiply(BigDecimal.valueOf(i.getCantidad())))
                        .build())
                .collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(ItemCarritoDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CarritoDTO.builder()
                .idCarrito(carrito.getIdCarrito())
                .idUsuario(carrito.getUsuario() != null ? carrito.getUsuario().getIdUsuario() : null)
                .items(items)
                .total(total)
                .build();
    }
}
