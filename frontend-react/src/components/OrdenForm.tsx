import React, { useState, useEffect, useCallback } from "react";
import { OrdenCompra, ProductoConCantidad } from "../types";
import {
  ordenesApi,
  detallesApi,
  crearOrdenCompleta,
  handleApiError,
} from "../services/api";
import ProveedorSelector from "./ProveedorSelector";
import ProductoSelector from "./ProductoSelector";

interface OrdenFormProps {
  orden?: OrdenCompra;
  onSave: (orden: OrdenCompra) => void;
  onCancel: () => void;
}

const OrdenForm: React.FC<OrdenFormProps> = ({ orden, onSave, onCancel }) => {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<
    number | null
  >(null);
  const [productosSeleccionados, setProductosSeleccionados] = useState<
    ProductoConCantidad[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función memoizada para cambiar productos seleccionados
  const handleProductosChange = useCallback(
    (productos: ProductoConCantidad[]) => {
      setProductosSeleccionados(productos);
    },
    []
  );

  // Función memoizada para cambiar proveedor seleccionado
  const handleProveedorChange = useCallback(
    (proveedorId: number | null) => {
      setProveedorSeleccionado(proveedorId);
      // Limpiar productos cuando cambie el proveedor
      if (proveedorId !== proveedorSeleccionado) {
        setProductosSeleccionados([]);
      }
    },
    [proveedorSeleccionado]
  );

  const loadOrdenData = useCallback(async () => {
    if (!orden?.id) return;

    try {
      setLoading(true);
      const detalles = await detallesApi.getByOrdenId(orden.id);

      setProveedorSeleccionado(orden.proveedorId);

      // Convertir detalles a productos con cantidad (se completarán en ProductoSelector)
      const productosConCantidad: ProductoConCantidad[] = detalles.map(
        (detalle) => ({
          id: detalle.productoId,
          nombre: "",
          precioUnitario: 0,
          precioCompra: detalle.precioUnitario,
          stock: 0,
          proveedorId: orden.proveedorId,
          estado: true,
          cantidadSeleccionada: detalle.cantidad,
          precioUnitarioOrden: detalle.precioUnitario,
        })
      );

      setProductosSeleccionados(productosConCantidad);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [orden?.id, orden?.proveedorId]);

  // Cargar datos iniciales si es edición
  useEffect(() => {
    if (orden?.id) {
      loadOrdenData();
    }
  }, [orden?.id, loadOrdenData]);

  const validateForm = (): string | null => {
    if (!proveedorSeleccionado) {
      return "Debe seleccionar un proveedor";
    }
    if (productosSeleccionados.length === 0) {
      return "Debe seleccionar al menos un producto";
    }
    for (const producto of productosSeleccionados) {
      if (producto.cantidadSeleccionada <= 0) {
        return `La cantidad del producto ${producto.nombre} debe ser mayor a 0`;
      }
      if (producto.precioUnitarioOrden <= 0) {
        return `El precio del producto ${producto.nombre} debe ser mayor a 0`;
      }
    }
    return null;
  };

  const calcularTotal = (): number => {
    return productosSeleccionados.reduce(
      (total, producto) =>
        total + producto.cantidadSeleccionada * producto.precioUnitarioOrden,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const total = calcularTotal();

      let ordenGuardada: OrdenCompra;

      if (orden?.id) {
        // Actualizar orden existente
        ordenGuardada = await ordenesApi.update(orden.id, {
          proveedorId: proveedorSeleccionado!,
          total: total,
          estado: orden.estado,
        });
      } else {
        // Crear nueva orden con detalles
        const productosParaOrden = productosSeleccionados.map((producto) => ({
          productoId: producto.id!,
          cantidad: producto.cantidadSeleccionada,
          precioUnitario: producto.precioUnitarioOrden,
        }));

        ordenGuardada = await crearOrdenCompleta({
          proveedorId: proveedorSeleccionado!,
          productos: productosParaOrden,
        });
      }

      onSave(ordenGuardada);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading && orden?.id) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando orden...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {orden?.id ? "Editar Orden de Compra" : "Nueva Orden de Compra"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de Proveedor */}
          <ProveedorSelector
            proveedorSeleccionado={proveedorSeleccionado}
            onProveedorChange={handleProveedorChange}
          />

          {/* Selector de Productos */}
          <ProductoSelector
            productosSeleccionados={productosSeleccionados}
            onProductosChange={handleProductosChange}
            proveedorId={proveedorSeleccionado}
          />

          {/* Resumen de la Orden */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              3. Resumen de la Orden
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Número de productos:</span>
                <span>{productosSeleccionados.length}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Cantidad total de artículos:</span>
                <span>
                  {productosSeleccionados.reduce(
                    (total, p) => total + p.cantidadSeleccionada,
                    0
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-800 border-t pt-2">
                <span>Total a pagar:</span>
                <span className="text-blue-600">
                  ${calcularTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={
                  loading ||
                  !proveedorSeleccionado ||
                  productosSeleccionados.length === 0
                }
                className="flex-1 py-3 px-6 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {orden?.id ? "Actualizando..." : "Creando..."}
                  </div>
                ) : orden?.id ? (
                  "Actualizar Orden"
                ) : (
                  "Crear Orden"
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrdenForm;
