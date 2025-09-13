import React, { useState, useEffect } from "react";
import { OrdenCompra } from "../types";
import {
  ordenesApi,
  productosApi,
  proveedoresApi,
  handleApiError,
} from "../services/api";

interface DashboardStats {
  totalOrdenes: number;
  totalProductos: number;
  totalProveedores: number;
  montoTotalOrdenes: number;
  productosConBajoStock: number;
  ordenesRecientes: OrdenCompra[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrdenes: 0,
    totalProductos: 0,
    totalProveedores: 0,
    montoTotalOrdenes: 0,
    productosConBajoStock: 0,
    ordenesRecientes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ordenes, productos, proveedores] = await Promise.all([
        ordenesApi.getAll(),
        productosApi.getAll(),
        proveedoresApi.getAll(),
      ]);

      // Calcular estadísticas
      const totalOrdenes = ordenes.length;
      const totalProductos = productos.filter((p) => p.estado).length;
      const totalProveedores = proveedores.filter((p) => p.estado).length;
      const montoTotalOrdenes = ordenes.reduce(
        (sum, orden) => sum + orden.total,
        0
      );
      const productosConBajoStock = productos.filter(
        (p) => p.estado && p.stock <= 10
      ).length;
      const ordenesRecientes = ordenes
        .sort(
          (a, b) =>
            new Date(b.fechaCreacion || "").getTime() -
            new Date(a.fechaCreacion || "").getTime()
        )
        .slice(0, 5);

      setStats({
        totalOrdenes,
        totalProductos,
        totalProveedores,
        montoTotalOrdenes,
        productosConBajoStock,
        ordenesRecientes,
      });
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            onClick={loadDashboardData}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen general del sistema de compras</p>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Ordenes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Ordenes</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalOrdenes}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
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
          </div>
        </div>

        {/* Total Productos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Productos Activos
              </p>
              <p className="text-3xl font-bold text-green-600">
                {stats.totalProductos}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Proveedores */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Proveedores Activos
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {stats.totalProveedores}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Monto Total */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Monto Total</p>
              <p className="text-3xl font-bold text-yellow-600">
                ${stats.montoTotalOrdenes.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
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
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alertas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Alertas</h2>

          {stats.productosConBajoStock > 0 ? (
            <div className="flex items-center p-4 bg-orange-100 border border-orange-400 text-orange-700 rounded">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <p className="font-medium">Stock Bajo</p>
                <p className="text-sm">
                  {stats.productosConBajoStock} producto
                  {stats.productosConBajoStock !== 1 ? "s" : ""}
                  {stats.productosConBajoStock === 1
                    ? " tiene"
                    : " tienen"}{" "}
                  stock bajo (≤10 unidades)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-medium">Todo en orden</p>
                <p className="text-sm">No hay productos con stock bajo</p>
              </div>
            </div>
          )}
        </div>

        {/* Ordenes Recientes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Ordenes Recientes
          </h2>

          {stats.ordenesRecientes.length > 0 ? (
            <div className="space-y-3">
              {stats.ordenesRecientes.map((orden) => (
                <div
                  key={orden.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      Orden #{orden.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {orden.fechaCreacion
                        ? new Date(orden.fechaCreacion).toLocaleDateString()
                        : "Sin fecha"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      ${orden.total.toFixed(2)}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        orden.estado
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {orden.estado ? "Activa" : "Inactiva"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No hay ordenes registradas
            </p>
          )}
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white-800 mb-4">
          Acciones Rapidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => (window.location.href = "/compras")}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="font-medium">Nueva Orden</p>
          </button>

          <button
            onClick={() => (window.location.href = "/productos")}
            className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <p className="font-medium">Nuevo Producto</p>
          </button>

          <button
            onClick={() => (window.location.href = "/proveedores")}
            className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="font-medium">Nuevo Proveedor</p>
          </button>

          <button
            onClick={loadDashboardData}
            className="p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-8 h-8 mx-auto mb-2"
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
            <p className="font-medium">Actualizar</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
