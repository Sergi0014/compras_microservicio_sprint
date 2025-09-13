import axios from 'axios';
import {
    Proveedor,
    Producto,
    OrdenCompra,
    DetalleOrdenCompra
} from '../types';

// Configuración base para Axios
const API_BASE_URL = 'http://localhost:8085';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 3000, // 3 segundos de timeout
});

// Interceptor para manejo de errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// =================== SERVICIOS DE PROVEEDORES ===================
export const proveedoresApi = {
    // Obtener todos los proveedores
    getAll: async (): Promise<Proveedor[]> => {
        const response = await api.get('/proveedores');
        return response.data;
    },

    // Obtener proveedor por ID
    getById: async (id: number): Promise<Proveedor> => {
        const response = await api.get(`/proveedores/${id}`);
        return response.data;
    },

    // Crear nuevo proveedor
    create: async (proveedor: Omit<Proveedor, 'id'>): Promise<Proveedor> => {
        const response = await api.post('/proveedores', proveedor);
        return response.data;
    },

    // Actualizar proveedor
    update: async (id: number, proveedor: Partial<Proveedor>): Promise<Proveedor> => {
        const response = await api.put(`/proveedores/${id}`, proveedor);
        return response.data;
    },

    // Eliminar proveedor
    delete: async (id: number): Promise<void> => {
        await api.delete(`/proveedores/${id}`);
    }
};

// =================== SERVICIOS DE PRODUCTOS ===================
export const productosApi = {
    // Obtener todos los productos
    getAll: async (): Promise<Producto[]> => {
        const response = await api.get('/productos');
        return response.data;
    },

    // Obtener productos por proveedor
    getByProveedor: async (proveedorId: number): Promise<Producto[]> => {
        const response = await api.get(`/productos/proveedor/${proveedorId}`);
        return response.data;
    },

    // Obtener producto por ID
    getById: async (id: number): Promise<Producto> => {
        const response = await api.get(`/productos/${id}`);
        return response.data;
    },

    // Crear nuevo producto
    create: async (producto: Omit<Producto, 'id'>): Promise<Producto> => {
        const response = await api.post('/productos', producto);
        return response.data;
    },

    // Actualizar producto
    update: async (id: number, producto: Partial<Producto>): Promise<Producto> => {
        const response = await api.put(`/productos/${id}`, producto);
        return response.data;
    },

    // Eliminar producto
    delete: async (id: number): Promise<void> => {
        await api.delete(`/productos/${id}`);
    }
};

// =================== SERVICIOS DE ORDENES ===================
export const ordenesApi = {
    // Obtener todas las ordenes
    getAll: async (): Promise<OrdenCompra[]> => {
        const response = await api.get('/ordenes');
        return response.data;
    },

    // Obtener orden por ID
    getById: async (id: number): Promise<OrdenCompra> => {
        const response = await api.get(`/ordenes/${id}`);
        return response.data;
    },

    // Crear nueva orden
    create: async (orden: Omit<OrdenCompra, 'id'>): Promise<OrdenCompra> => {
        const response = await api.post('/ordenes', orden);
        return response.data;
    },

    // Actualizar orden
    update: async (id: number, orden: Partial<OrdenCompra>): Promise<OrdenCompra> => {
        const response = await api.put(`/ordenes/${id}`, orden);
        return response.data;
    },

    // Eliminar orden
    delete: async (id: number): Promise<void> => {
        await api.delete(`/ordenes/${id}`);
    }
};

// =================== SERVICIOS DE DETALLES (INTEGRADOS EN ORDENES) ===================
export const detallesApi = {
    // Obtener detalles por ID de orden
    getByOrdenId: async (ordenId: number): Promise<DetalleOrdenCompra[]> => {
        console.log(` Buscando detalles para orden ID: ${ordenId}`);
        try {
            const response = await api.get(`/ordenes/${ordenId}/detalles`);
            console.log(` Detalles encontrados para orden ${ordenId}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(` Error al buscar detalles para orden ${ordenId}:`, error);
            throw error;
        }
    },

    // Crear detalle en una orden específica
    create: async (ordenId: number, detalle: Omit<DetalleOrdenCompra, 'id' | 'ordenCompraId'>): Promise<DetalleOrdenCompra> => {
        console.log(` Creando detalle para orden ID: ${ordenId}`, detalle);
        try {
            const response = await api.post(`/ordenes/${ordenId}/detalles`, detalle);
            console.log(` Detalle creado para orden ${ordenId}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(` Error al crear detalle para orden ${ordenId}:`, error);
            throw error;
        }
    },

    // Actualizar detalle específico
    update: async (ordenId: number, detalleId: number, detalle: Partial<DetalleOrdenCompra>): Promise<DetalleOrdenCompra> => {
        console.log(` Actualizando detalle ID: ${detalleId} de orden ${ordenId}`, detalle);
        try {
            const response = await api.put(`/ordenes/${ordenId}/detalles/${detalleId}`, detalle);
            console.log(` Detalle actualizado:`, response.data);
            return response.data;
        } catch (error) {
            console.error(` Error al actualizar detalle ${detalleId}:`, error);
            throw error;
        }
    },

    // Eliminar detalle específico
    delete: async (ordenId: number, detalleId: number): Promise<void> => {
        console.log(` Eliminando detalle ID: ${detalleId} de orden ${ordenId}`);
        try {
            await api.delete(`/ordenes/${ordenId}/detalles/${detalleId}`);
            console.log(` Detalle ${detalleId} eliminado`);
        } catch (error) {
            console.error(` Error al eliminar detalle ${detalleId}:`, error);
            throw error;
        }
    }
};

// =================== FUNCIONES AUXILIARES ===================

// Función para verificar la conexión con el API Gateway
export const checkApiConnection = async (): Promise<boolean> => {
    try {
        await api.get('/proveedores');
        return true;
    } catch (error) {
        console.error('No se pudo conectar al API Gateway:', error);
        return false;
    }
};

// Función para manejar errores de API de forma consistente
export const handleApiError = (error: any): string => {
    if (error.response) {
        // El servidor respondió con un código de estado de error
        return error.response.data?.message ||
            `Error del servidor: ${error.response.status}`;
    } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        return 'No se pudo conectar al servidor. Verifique que el API Gateway esté ejecutándose en el puerto 8085.';
    } else {
        // Algo pasó al configurar la petición
        return `Error de configuración: ${error.message}`;
    }
};

// Función para obtener información completa de una orden con sus detalles y proveedor
export const getOrdenCompleta = async (ordenId: number): Promise<{
    orden: OrdenCompra;
    proveedor: Proveedor;
    detalles: DetalleOrdenCompra[];
}> => {
    try {
        console.log(` Obteniendo orden completa para ID: ${ordenId}`);

        // Obtener orden y detalles usando los nuevos endpoints integrados
        const [orden, detalles] = await Promise.all([
            ordenesApi.getById(ordenId),
            detallesApi.getByOrdenId(ordenId) // Ahora usa /ordenes/{id}/detalles
        ]);

        const proveedor = await proveedoresApi.getById(orden.proveedorId);

        console.log(` Orden completa obtenida para ID: ${ordenId}`, { orden, proveedor, detalles });

        return { orden, proveedor, detalles };
    } catch (error) {
        console.error(` Error obteniendo orden completa ${ordenId}:`, error);
        throw new Error(`Error al obtener orden completa: ${handleApiError(error)}`);
    }
};

// Función para validar stock antes de crear una orden
export const validarStock = async (productos: { productoId: number; cantidad: number }[]): Promise<{
    valid: boolean;
    errors: string[];
}> => {
    try {
        const errors: string[] = [];
        const todosLosProductos = await productosApi.getAll();

        for (const item of productos) {
            const producto = todosLosProductos.find(p => p.id === item.productoId);
            if (!producto) {
                errors.push(`Producto con ID ${item.productoId} no encontrado`);
                continue;
            }

            if (!producto.estado) {
                errors.push(`El producto "${producto.nombre}" está inactivo`);
                continue;
            }

            if (producto.stock < item.cantidad) {
                errors.push(`Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`);
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    } catch (error) {
        return {
            valid: false,
            errors: [`Error al validar stock: ${handleApiError(error)}`]
        };
    }
};

// Función para crear una orden completa con detalles integrados
export const crearOrdenCompleta = async (ordenData: {
    proveedorId: number;
    productos: { productoId: number; cantidad: number; precioUnitario: number }[];
}): Promise<OrdenCompra> => {
    try {
        console.log(' Enviando datos de orden completa:', ordenData);

        // Validar stock primero
        const stockValidation = await validarStock(ordenData.productos.map(p => ({
            productoId: p.productoId,
            cantidad: p.cantidad
        })));

        if (!stockValidation.valid) {
            throw new Error(stockValidation.errors.join(', '));
        }

        // Estrategia 1: Intentar crear orden completa con endpoint específico
        try {
            console.log(' Intentando endpoint /ordenes/completa...');
            const response = await api.post('/ordenes/completa', ordenData);
            console.log(' Orden creada exitosamente con endpoint /ordenes/completa:', response.data);
            return response.data;
        } catch (endpointError) {
            console.log(' Endpoint /ordenes/completa no disponible, usando estrategia de orden + detalles...');
        }

        // Estrategia 2: Crear orden básica + agregar detalles individualmente
        try {
            console.log(' Creando orden básica y añadiendo detalles...');

            // Calcular total
            const total = ordenData.productos.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0);

            // Crear orden básica
            const ordenBasica = {
                proveedorId: ordenData.proveedorId,
                total,
                estado: true
            };

            const ordenCreada = await ordenesApi.create(ordenBasica);
            console.log(' Orden básica creada:', ordenCreada);

            if (!ordenCreada.id) {
                throw new Error('No se pudo obtener ID de la orden creada');
            }

            // Agregar detalles uno por uno usando los nuevos endpoints integrados
            const detallesCreados = [];
            for (const producto of ordenData.productos) {
                const detalle = {
                    productoId: producto.productoId,
                    cantidad: producto.cantidad,
                    precioUnitario: producto.precioUnitario,
                    precioTotal: producto.cantidad * producto.precioUnitario
                };

                try {
                    const detalleCreado = await detallesApi.create(ordenCreada.id, detalle);
                    detallesCreados.push(detalleCreado);
                    console.log(` Detalle creado para producto ${producto.productoId}`);
                } catch (detalleError) {
                    console.error(` Error creando detalle para producto ${producto.productoId}:`, detalleError);
                    // Continuar con los demás productos, no fallar por uno solo
                }
            }

            // Retornar la orden con detalles incluidos
            return {
                ...ordenCreada,
                detalles: detallesCreados
            };

        } catch (fallbackError) {
            console.error(' Error en estrategia de fallback:', fallbackError);
            throw new Error(`No se pudo crear la orden completa: ${handleApiError(fallbackError)}`);
        }

    } catch (error) {
        console.error(' Error completo en crearOrdenCompleta:', error);
        throw new Error(`Error al crear orden completa: ${handleApiError(error)}`);
    }
};

export default api;
