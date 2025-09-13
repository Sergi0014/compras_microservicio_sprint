package com.compras.ordenes.repository;

import com.compras.ordenes.model.OrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Long> {}
