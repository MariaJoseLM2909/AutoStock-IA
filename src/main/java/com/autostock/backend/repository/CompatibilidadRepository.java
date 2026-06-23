package com.autostock.backend.repository;

import com.autostock.backend.entity.Compatibilidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompatibilidadRepository extends JpaRepository<Compatibilidad, Long> {
    List<Compatibilidad> findByProductoIdProducto(Long idProducto);
}
