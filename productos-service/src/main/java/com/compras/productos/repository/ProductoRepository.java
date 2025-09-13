package com.compras.productos.repository;

import com.compras.productos.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByProveedorIdAndEstadoTrue(Long proveedorId);
    List<Producto> findByEstadoTrue();
}
