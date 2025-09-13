package com.compras.productos.controller;

import com.compras.productos.model.Producto;
import com.compras.productos.repository.ProductoRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@Tag(name = "Productos", description = "API CRUD de Productos")
public class ProductoController {
    private final ProductoRepository repository;
    public ProductoController(ProductoRepository repository) { this.repository = repository; }

    @GetMapping
    public List<Producto> list(@RequestParam(required = false) Long proveedorId) {
        if (proveedorId != null) {
            return repository.findByProveedorIdAndEstadoTrue(proveedorId);
        }
        return repository.findByEstadoTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> get(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/proveedor/{proveedorId}")
    public List<Producto> getByProveedor(@PathVariable Long proveedorId) {
        return repository.findByProveedorIdAndEstadoTrue(proveedorId);
    }

    @PostMapping
    public ResponseEntity<Producto> create(@RequestBody Producto body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(body));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(@PathVariable Long id, @RequestBody Producto body) {
        return repository.findById(id).map(existing -> {
            existing.setNombre(body.getNombre());
            existing.setPrecioUnitario(body.getPrecioUnitario());
            existing.setPrecioCompra(body.getPrecioCompra());
            existing.setStock(body.getStock());
            existing.setProveedorId(body.getProveedorId());
            existing.setEstado(body.getEstado());
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return repository.findById(id).map(p -> { repository.delete(p); return new ResponseEntity<Void>(HttpStatus.NO_CONTENT); })
                .orElse(ResponseEntity.notFound().build());
    }
}
