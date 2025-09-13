package com.compras.ordenes.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordenes_compra")
public class OrdenCompra {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "proveedor_id", nullable = false)
    private Long proveedorId;
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal total;
    @Column(nullable = false)
    private Boolean estado = true;
    
    @OneToMany(mappedBy = "ordenCompra", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<DetalleOrdenCompra> detalles = new ArrayList<>();
    
    private Instant fechaCreacion;
    private Instant fechaActualizacion;

    @PrePersist
    public void prePersist() { fechaCreacion = Instant.now(); fechaActualizacion = fechaCreacion; }
    @PreUpdate
    public void preUpdate() { fechaActualizacion = Instant.now(); }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProveedorId() { return proveedorId; }
    public void setProveedorId(Long proveedorId) { this.proveedorId = proveedorId; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }
    public Instant getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(Instant fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public Instant getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(Instant fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    
    public List<DetalleOrdenCompra> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleOrdenCompra> detalles) { 
        this.detalles = detalles;
        if (detalles != null) {
            for (DetalleOrdenCompra detalle : detalles) {
                detalle.setOrdenCompra(this);
            }
        }
    }
    
    public void addDetalle(DetalleOrdenCompra detalle) {
        if (this.detalles == null) {
            this.detalles = new ArrayList<>();
        }
        this.detalles.add(detalle);
        detalle.setOrdenCompra(this);
    }
    
    public void removeDetalle(DetalleOrdenCompra detalle) {
        if (this.detalles != null) {
            this.detalles.remove(detalle);
            detalle.setOrdenCompra(null);
        }
    }
}
