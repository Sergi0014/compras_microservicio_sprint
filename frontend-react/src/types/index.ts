// Tipos TypeScript para las entidades del sistema de compras

export interface Proveedor {
    id?: number;
    nombre: string;
    ruc: string;
    direccion: string;
    telefono: string;
    estado?: boolean;
    fechaCreacion?: string;
    fechaActualizacion?: string;
}

export interface Producto {
    id?: number;
    nombre: string;
    precioUnitario: number;
    precioCompra: number;
    stock: number;
    proveedorId: number;
    estado?: boolean;
    fechaCreacion?: string;
    fechaActualizacion?: string;
}

export interface OrdenCompra {
    id?: number;
    proveedorId: number;
    total: number;
    estado?: boolean;
    detalles?: DetalleOrdenCompra[]; // Detalles integrados opcionalmente
    fechaCreacion?: string;
    fechaActualizacion?: string;
}

export interface DetalleOrdenCompra {
    id?: number;
    ordenCompraId?: number; // Ahora opcional cuando se maneja dentro de la orden
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    precioTotal: number;
    fechaCreacion?: string;
    fechaActualizacion?: string;
}

// Tipos auxiliares para el frontend
export interface ProductoConCantidad extends Producto {
    cantidadSeleccionada: number;
    precioUnitarioOrden: number;
}

export interface OrdenCompraCompleta extends OrdenCompra {
    proveedor?: Proveedor;
    detalles?: DetalleOrdenCompra[];
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ErrorResponse {
    message: string;
    details?: string;
}
