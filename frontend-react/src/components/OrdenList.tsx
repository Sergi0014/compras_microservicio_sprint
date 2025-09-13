import React, { useState, useEffect } from "react";
import { OrdenCompra, Proveedor, DetalleOrdenCompra, Producto } from "../types";
import {
  ordenesApi,
  proveedoresApi,
  detallesApi,
  productosApi,
  handleApiError,
} from "../services/api";

interface OrdenListProps {
  onEditOrden: (orden: OrdenCompra) => void;
  refreshTrigger?: number;
}

const OrdenList: React.FC<OrdenListProps> = ({
  onEditOrden,
  refreshTrigger,
}) => {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrden, setExpandedOrden] = useState<number | null>(null);
  const [detallesOrden, setDetallesOrden] = useState<
    Record<number, DetalleOrdenCompra[]>
  >({});

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ordenesData, proveedoresData, productosData] = await Promise.all([
        ordenesApi.getAll(),
        proveedoresApi.getAll(),
        productosApi.getAll(),
      ]);

      setOrdenes(ordenesData);
      setProveedores(proveedoresData);
      setProductos(productosData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const loadDetallesOrden = async (ordenId: number) => {
    try {
      const detalles = await detallesApi.getByOrdenId(ordenId);

      setDetallesOrden((prev) => ({
        ...prev,
        [ordenId]: detalles,
      }));
    } catch (err) {
      console.error(`Error al cargar detalles para orden ${ordenId}:`, err);
      // Agregar el error al estado para mostrar información más útil
      setDetallesOrden((prev) => ({
        ...prev,
        [ordenId]: [],
      }));
    }
  };

  const toggleExpandOrden = (ordenId: number) => {
    if (expandedOrden === ordenId) {
      setExpandedOrden(null);
    } else {
      setExpandedOrden(ordenId);
      if (!detallesOrden[ordenId]) {
        loadDetallesOrden(ordenId);
      }
    }
  };

  const getProveedorNombre = (proveedorId: number): string => {
    const proveedor = proveedores.find((p) => p.id === proveedorId);
    return proveedor?.nombre || `Proveedor ${proveedorId}`;
  };

  const getProductoNombre = (productoId: number): string => {
    const producto = productos.find((p) => p.id === productoId);
    return producto?.nombre || `Producto ${productoId}`;
  };

  const handleDeleteOrden = async (ordenId: number) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta orden?")) {
      return;
    }

    try {
      await ordenesApi.delete(ordenId);
      setOrdenes((prev) => prev.filter((o) => o.id !== ordenId));

      // También eliminar los detalles de la memoria
      setDetallesOrden((prev) => {
        const newDetalles = { ...prev };
        delete newDetalles[ordenId];
        return newDetalles;
      });
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando ordenes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Ordenes de Compra
              </h2>
              <p className="text-sm text-gray-600">
                {ordenes.length}{" "}
                {ordenes.length === 1
                  ? "orden registrada"
                  : "ordenes registradas"}
              </p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="inline-flex items-center px-4 py-2 bg-white text-gray-600 hover:text-blue-600 text-sm font-medium rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
            title="Actualizar lista"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      {ordenes.length === 0 ? (
        <div className="p-12 text-center">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay ordenes de compra
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Crea tu primera orden de compra para comenzar a gestionar tus
            compras en tigo.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {ordenes.map((orden) => (
            <div
              key={orden.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Orden #{orden.id}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            orden.estado
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                              : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              orden.estado ? "bg-green-400" : "bg-red-400"
                            }`}
                          ></span>
                          {orden.estado ? "Activa" : "Inactiva"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Proveedor:</strong>{" "}
                        {getProveedorNombre(orden.proveedorId)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {orden.fechaCreacion && formatDate(orden.fechaCreacion)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${orden.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Total de la orden</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-6">
                  <button
                    onClick={() => toggleExpandOrden(orden.id!)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Ver detalles"
                  >
                    <svg
                      className={`w-5 h-5 transform transition-transform duration-200 ${
                        expandedOrden === orden.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => onEditOrden(orden)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Editar orden"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleDeleteOrden(orden.id!)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Eliminar orden"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Detalles expandidos mejorados */}
              {expandedOrden === orden.id && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Detalles de la Orden
                    </h4>

                    {detallesOrden[orden.id!] ? (
                      detallesOrden[orden.id!].length > 0 ? (
                        <div className="space-y-3">
                          {detallesOrden[orden.id!].map((detalle) => (
                            <div
                              key={detalle.id}
                              className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {getProductoNombre(detalle.productoId)}
                                  </p>
                                  <p className="text-xs text-gray-500 mb-1">
                                    ID: {detalle.productoId}
                                  </p>
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"
                                        />
                                      </svg>
                                      Cant: {detalle.cantidad}
                                    </span>
                                    <span className="flex items-center">
                                      <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                        />
                                      </svg>
                                      ${detalle.precioUnitario.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-green-600">
                                    ${detalle.precioTotal.toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Subtotal
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <svg
                            className="mx-auto h-8 w-8 mb-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                          <p className="italic">
                            No hay detalles para esta orden (Orden ID:{" "}
                            {orden.id})
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Es posible que esta orden se haya creado sin
                            productos o que el backend no haya creado
                            automáticamente los detalles
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-6">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                        <p className="text-gray-500">Cargando detalles...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdenList;
