package com.compras.ordenes.dto;

import java.math.BigDecimal;
import java.util.List;

public class CrearOrdenCompletaRequest {
    private Long proveedorId;
    private List<ProductoOrden> productos;

    public static class ProductoOrden {
        private Long productoId;
        private Integer cantidad;
        private BigDecimal precioUnitario;

        // Constructors
        public ProductoOrden() {}

        public ProductoOrden(Long productoId, Integer cantidad, BigDecimal precioUnitario) {
            this.productoId = productoId;
            this.cantidad = cantidad;
            this.precioUnitario = precioUnitario;
        }

        // Getters and setters
        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        public BigDecimal getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
    }

    // Constructors
    public CrearOrdenCompletaRequest() {}

    public CrearOrdenCompletaRequest(Long proveedorId, List<ProductoOrden> productos) {
        this.proveedorId = proveedorId;
        this.productos = productos;
    }

    // Getters and setters
    public Long getProveedorId() { return proveedorId; }
    public void setProveedorId(Long proveedorId) { this.proveedorId = proveedorId; }
    public List<ProductoOrden> getProductos() { return productos; }
    public void setProductos(List<ProductoOrden> productos) { this.productos = productos; }
}
