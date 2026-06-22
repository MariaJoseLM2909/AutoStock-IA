package com.autostock.backend.repository;

import com.autostock.backend.entity.ItemCarrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {
    List<ItemCarrito> findByCarritoIdCarrito(Long idCarrito);
    Optional<ItemCarrito> findByCarritoIdCarritoAndProductoIdProducto(Long idCarrito, Long idProducto);
}