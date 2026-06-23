package com.autostock.backend.repository;

import com.autostock.backend.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByCategoriaContainingIgnoreCase(String categoria);

    List<Producto> findByMarcaContainingIgnoreCase(String marca);

    @Query("SELECT p FROM Producto p WHERE " +
            "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
            "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%'))")
    List<Producto> buscarPorTexto(@Param("busqueda") String busqueda);

    List<Producto> findByCategoriaAndMarcaIgnoreCase(String categoria, String marca);

    List<Producto> findByStockLessThanEqual(Integer stock);
}