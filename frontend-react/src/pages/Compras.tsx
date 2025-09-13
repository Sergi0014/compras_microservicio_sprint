import React, { useState, useEffect } from "react";
import { OrdenCompra } from "../types";
import { checkApiConnection } from "../services/api";
import OrdenList from "../components/OrdenList";
import OrdenForm from "../components/OrdenForm";

type ViewMode = "list" | "create" | "edit";

const Compras: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [ordenEditando, setOrdenEditando] = useState<OrdenCompra | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  // Verificar conexión con el API al cargar la página
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkApiConnection();
      setApiConnected(connected);
    };

    checkConnection();
  }, []);

  const handleNuevaOrden = () => {
    setOrdenEditando(undefined);
    setViewMode("create");
  };

  const handleEditarOrden = (orden: OrdenCompra) => {
    setOrdenEditando(orden);
    setViewMode("edit");
  };

  const handleOrdenGuardada = (orden: OrdenCompra) => {
    setViewMode("list");
    setOrdenEditando(undefined);
    setRefreshTrigger((prev) => prev + 1); // Trigger refresh de la lista
  };

  const handleCancelar = () => {
    setViewMode("list");
    setOrdenEditando(undefined);
  };

  const handleRetryConnection = async () => {
    setApiConnected(null); // Mostrar loading
    const connected = await checkApiConnection();
    setApiConnected(connected);
  };

  // Mostrar error de conexión si no se puede conectar al API
  if (apiConnected === false) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error de Conexión
          </h2>
          <p className="text-gray-600 mb-6">
            No se pudo conectar al API Gateway. Verifique que todos los
            servicios estén ejecutándose:
          </p>
          <ul className="text-left text-sm text-gray-600 mb-6 space-y-1">
            <li>• Eureka Server (puerto 8761)</li>
            <li>• API Gateway (puerto 8085)</li>
            <li>• Servicios de microservicios</li>
          </ul>
          <button
            onClick={handleRetryConnection}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  // Mostrar loading mientras se verifica la conexión
  if (apiConnected === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">
            Verificando conexión con el API Gateway...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header moderno */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg mr-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Sistema de Compras
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  gestion de compras tigo
                </p>
              </div>
            </div>

            {viewMode === "list" && (
              <button
                onClick={handleNuevaOrden}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transform transition hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nueva Orden
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navegación de breadcrumb moderna */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "text-blue-600 font-semibold bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Ordenes de Compra
                </button>
              </li>
              {viewMode !== "list" && (
                <>
                  <li className="text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </li>
                  <li className="text-blue-600 font-semibold bg-blue-50 px-3 py-2 rounded-lg">
                    {viewMode === "create" ? "Nueva Orden" : "Editar Orden"}
                  </li>
                </>
              )}
            </ol>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === "list" && (
          <OrdenList
            onEditOrden={handleEditarOrden}
            refreshTrigger={refreshTrigger}
          />
        )}

        {(viewMode === "create" || viewMode === "edit") && (
          <OrdenForm
            orden={ordenEditando}
            onSave={handleOrdenGuardada}
            onCancel={handleCancelar}
          />
        )}
      </main>

      {/* Footer moderno */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-gray-600 font-medium">
                Sistema de Microservicios de Compras de tigo
              </span>
            </div>
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    apiConnected
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                      : "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      apiConnected ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></span>
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Compras;
