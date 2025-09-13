package com.compras.ordenes.repository;

import com.compras.ordenes.model.DetalleOrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleOrdenCompraRepository extends JpaRepository<DetalleOrdenCompra, Long> {
    
    @Query("SELECT d FROM DetalleOrdenCompra d WHERE d.ordenCompra.id = :ordenCompraId")
    List<DetalleOrdenCompra> findByOrdenCompraId(Long ordenCompraId);
    
    @Query("SELECT d FROM DetalleOrdenCompra d WHERE d.productoId = :productoId")
    List<DetalleOrdenCompra> findByProductoId(Long productoId);
}