package com.compras.ordenes.service;

import com.compras.ordenes.dto.CrearOrdenCompletaRequest;
import com.compras.ordenes.model.DetalleOrdenCompra;
import com.compras.ordenes.model.OrdenCompra;
import com.compras.ordenes.repository.DetalleOrdenCompraRepository;
import com.compras.ordenes.repository.OrdenCompraRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrdenCompletaService {

    private final OrdenCompraRepository ordenCompraRepository;
    private final DetalleOrdenCompraRepository detalleRepository;

    public OrdenCompletaService(OrdenCompraRepository ordenCompraRepository, 
                              DetalleOrdenCompraRepository detalleRepository) {
        this.ordenCompraRepository = ordenCompraRepository;
        this.detalleRepository = detalleRepository;
    }

    @Transactional
    public OrdenCompra crearOrdenCompleta(CrearOrdenCompletaRequest request) {
        // Validar request
        if (request.getProveedorId() == null) {
            throw new IllegalArgumentException("El ID del proveedor es requerido");
        }
        if (request.getProductos() == null || request.getProductos().isEmpty()) {
            throw new IllegalArgumentException("Debe incluir al menos un producto");
        }

        // Calcular total
        BigDecimal total = request.getProductos().stream()
            .map(p -> p.getPrecioUnitario().multiply(BigDecimal.valueOf(p.getCantidad())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Crear la orden
        OrdenCompra orden = new OrdenCompra();
        orden.setProveedorId(request.getProveedorId());
        orden.setTotal(total);
        orden.setEstado(true);

        // Guardar la orden
        OrdenCompra ordenGuardada = ordenCompraRepository.save(orden);

        // Crear los detalles de la orden
        List<DetalleOrdenCompra> detallesCreados = new ArrayList<>();
        for (CrearOrdenCompletaRequest.ProductoOrden producto : request.getProductos()) {
            try {
                DetalleOrdenCompra detalle = new DetalleOrdenCompra();
                detalle.setOrdenCompra(ordenGuardada);
                detalle.setProductoId(producto.getProductoId());
                detalle.setCantidad(producto.getCantidad());
                detalle.setPrecioUnitario(producto.getPrecioUnitario());
                detalle.setPrecioTotal(producto.getPrecioUnitario().multiply(BigDecimal.valueOf(producto.getCantidad())));
                
                DetalleOrdenCompra detalleGuardado = detalleRepository.save(detalle);
                detallesCreados.add(detalleGuardado);
                
                // Agregamos el detalle a la orden para mantener la relación
                ordenGuardada.addDetalle(detalleGuardado);
                
            } catch (Exception e) {
                // Si falla la creación de detalles, eliminar la orden creada
                ordenCompraRepository.delete(ordenGuardada);
                throw new RuntimeException("Error al crear los detalles de la orden: " + e.getMessage(), e);
            }
        }

        return ordenGuardada;
    }
}
