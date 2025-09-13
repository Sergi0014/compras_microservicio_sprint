package com.compras.proveedores.controller;

import com.compras.proveedores.model.Proveedor;
import com.compras.proveedores.repository.ProveedorRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/proveedores")
@Tag(name = "Proveedores", description = "API CRUD de Proveedores")
public class ProveedorController {
    private final ProveedorRepository repository;

    public ProveedorController(ProveedorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Proveedor> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proveedor> get(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Proveedor> create(@RequestBody Proveedor proveedor) {
        Proveedor saved = repository.save(proveedor);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proveedor> update(@PathVariable Long id, @RequestBody Proveedor body) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setNombre(body.getNombre());
                    existing.setRuc(body.getRuc());
                    existing.setDireccion(body.getDireccion());
                    existing.setTelefono(body.getTelefono());
                    existing.setEstado(body.getEstado());
                    return ResponseEntity.ok(repository.save(existing));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return repository.findById(id)
                .map(existing -> { repository.delete(existing); return new ResponseEntity<Void>(HttpStatus.NO_CONTENT); })
                .orElse(ResponseEntity.notFound().build());
    }
}
