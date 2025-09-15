package com.compras.ordenes.controller;

import com.compras.ordenes.dto.CrearOrdenCompletaRequest;
import com.compras.ordenes.model.DetalleOrdenCompra;
import com.compras.ordenes.model.OrdenCompra;
import com.compras.ordenes.repository.DetalleOrdenCompraRepository;
import com.compras.ordenes.repository.OrdenCompraRepository;
import com.compras.ordenes.service.OrdenCompletaService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/ordenes")
@Tag(name = "Ordenes de Compra")
public class OrdenCompraController {
    private final OrdenCompraRepository repository;
    private final DetalleOrdenCompraRepository detalleRepository;
    private final OrdenCompletaService ordenCompletaService;
    
    public OrdenCompraController(OrdenCompraRepository repository, 
                                DetalleOrdenCompraRepository detalleRepository,
                                OrdenCompletaService ordenCompletaService) { 
        this.repository = repository; 
        this.detalleRepository = detalleRepository;
        this.ordenCompletaService = ordenCompletaService;
    }

    @GetMapping("/test")
    public String test() {
        return "Servicio de órdenes funcionando - Optimizaciones aplicadas!";
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<OrdenCompra> list(@RequestParam(defaultValue = "20") int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "id"));
        List<OrdenCompra> ordenes = repository.findAll(pageable).getContent();
        
        // Forzar la inicialización de los detalles mientras la sesión está activa
        ordenes.forEach(orden -> orden.getDetalles().size());
        
        return ordenes;
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenCompra> get(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OrdenCompra> create(@RequestBody OrdenCompra body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(body));
    }

    @PostMapping("/completa")
    public ResponseEntity<OrdenCompra> crearOrdenCompleta(@RequestBody CrearOrdenCompletaRequest request) {
        try {
            OrdenCompra ordenCreada = ordenCompletaService.crearOrdenCompleta(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ordenCreada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrdenCompra> update(@PathVariable Long id, @RequestBody OrdenCompra body) {
        return repository.findById(id).map(existing -> {
            existing.setProveedorId(body.getProveedorId());
            existing.setTotal(body.getTotal());
            existing.setEstado(body.getEstado());
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return repository.findById(id).map(orden -> { 
            repository.delete(orden); 
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT); 
        }).orElse(ResponseEntity.notFound().build());
    }

    // Endpoints para manejar detalles de orden
    @GetMapping("/{ordenId}/detalles")
    public ResponseEntity<List<DetalleOrdenCompra>> getDetallesByOrden(@PathVariable Long ordenId) {
        if (!repository.existsById(ordenId)) {
            return ResponseEntity.notFound().build();
        }
        List<DetalleOrdenCompra> detalles = detalleRepository.findByOrdenCompraId(ordenId);
        return ResponseEntity.ok(detalles);
    }

    @PostMapping("/{ordenId}/detalles")
    public ResponseEntity<DetalleOrdenCompra> addDetalle(@PathVariable Long ordenId, @RequestBody DetalleOrdenCompra detalle) {
        return repository.findById(ordenId).map(orden -> {
            detalle.setOrdenCompra(orden);
            DetalleOrdenCompra savedDetalle = detalleRepository.save(detalle);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDetalle);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{ordenId}/detalles/{detalleId}")
    public ResponseEntity<DetalleOrdenCompra> updateDetalle(@PathVariable Long ordenId, 
                                                           @PathVariable Long detalleId, 
                                                           @RequestBody DetalleOrdenCompra detalle) {
        if (!repository.existsById(ordenId)) {
            return ResponseEntity.notFound().build();
        }
        
        return detalleRepository.findById(detalleId).map(existing -> {
            existing.setProductoId(detalle.getProductoId());
            existing.setCantidad(detalle.getCantidad());
            existing.setPrecioUnitario(detalle.getPrecioUnitario());
            existing.setPrecioTotal(detalle.getPrecioTotal());
            return ResponseEntity.ok(detalleRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{ordenId}/detalles/{detalleId}")
    public ResponseEntity<Void> deleteDetalle(@PathVariable Long ordenId, @PathVariable Long detalleId) {
        if (!repository.existsById(ordenId)) {
            return ResponseEntity.notFound().build();
        }
        
        return detalleRepository.findById(detalleId).map(detalle -> {
            detalleRepository.delete(detalle);
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }).orElse(ResponseEntity.notFound().build());
    }
}
