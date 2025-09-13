package com.compras.productos.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 100, nullable = false)
    private String nombre;
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precioUnitario;
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precioCompra;
    @Column(nullable = false)
    private Integer stock;
    @Column(name = "proveedor_id", nullable = false)
    private Long proveedorId;
    @Column(nullable = false)
    private Boolean estado = true;
    private Instant fechaCreacion;
    private Instant fechaActualizacion;

    @PrePersist
    public void prePersist() {
        fechaCreacion = Instant.now();
        fechaActualizacion = fechaCreacion;
    }
    @PreUpdate
    public void preUpdate() { fechaActualizacion = Instant.now(); }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
    public BigDecimal getPrecioCompra() { return precioCompra; }
    public void setPrecioCompra(BigDecimal precioCompra) { this.precioCompra = precioCompra; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Long getProveedorId() { return proveedorId; }
    public void setProveedorId(Long proveedorId) { this.proveedorId = proveedorId; }
    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }
    public Instant getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(Instant fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public Instant getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(Instant fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
