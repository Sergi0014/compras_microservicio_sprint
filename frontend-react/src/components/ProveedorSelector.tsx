import React, { useState, useEffect } from "react";
import { Proveedor } from "../types";
import { proveedoresApi, handleApiError } from "../services/api";

interface ProveedorSelectorProps {
  proveedorSeleccionado: number | null;
  onProveedorChange: (proveedorId: number | null) => void;
}

const ProveedorSelector: React.FC<ProveedorSelectorProps> = ({
  proveedorSeleccionado,
  onProveedorChange,
}) => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingProveedor, setCreatingProveedor] = useState(false);
  const [newProveedor, setNewProveedor] = useState({
    nombre: "",
    ruc: "",
    direccion: "",
    telefono: "",
    estado: true,
  });

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      setLoading(true);
      const data = await proveedoresApi.getAll();
      setProveedores(data.filter((p) => p.estado)); // Solo proveedores activos
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewProveedor({
      nombre: "",
      ruc: "",
      direccion: "",
      telefono: "",
      estado: true,
    });
  };

  const validateForm = (): string | null => {
    if (!newProveedor.nombre.trim()) {
      return "El nombre es requerido";
    }
    if (!newProveedor.ruc.trim()) {
      return "El RUC es requerido";
    }
    if (newProveedor.ruc.length !== 11) {
      return "El RUC debe tener 11 dígitos";
    }
    if (!newProveedor.direccion.trim()) {
      return "La dirección es requerida";
    }
    if (!newProveedor.telefono.trim()) {
      return "El teléfono es requerido";
    }
    return null;
  };

  const handleCreateProveedor = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setCreatingProveedor(true);
      setError(null);

      const proveedorCreado = await proveedoresApi.create({
        nombre: newProveedor.nombre.trim(),
        ruc: newProveedor.ruc.trim(),
        direccion: newProveedor.direccion.trim(),
        telefono: newProveedor.telefono.trim(),
        estado: newProveedor.estado,
      });

      // Actualizar la lista de proveedores
      setProveedores((prev) => [...prev, proveedorCreado]);

      // Seleccionar automáticamente el proveedor creado
      onProveedorChange(proveedorCreado.id!);

      // Limpiar formulario y cerrar modal
      resetForm();
      setShowCreateForm(false);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setCreatingProveedor(false);
    }
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    resetForm();
    setError(null);
  };

  const proveedorSeleccionadoInfo = proveedores.find(
    (p) => p.id === proveedorSeleccionado
  );

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          1. Seleccionar Proveedor
        </h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
        >
          Nuevo Proveedor
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button onClick={loadProveedores} className="ml-2 text-sm underline">
            Reintentar
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proveedor <span className="text-red-500">*</span>
          </label>
          <select
            value={proveedorSeleccionado || ""}
            onChange={(e) =>
              onProveedorChange(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre} - {proveedor.ruc}
              </option>
            ))}
          </select>
        </div>

        {/* Información del proveedor seleccionado */}
        {proveedorSeleccionadoInfo && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">
              Información del Proveedor
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Nombre:</span>
                <span className="ml-2 text-gray-600">
                  {proveedorSeleccionadoInfo.nombre}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">RUC:</span>
                <span className="ml-2 text-gray-600">
                  {proveedorSeleccionadoInfo.ruc}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Dirección:</span>
                <span className="ml-2 text-gray-600">
                  {proveedorSeleccionadoInfo.direccion}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Teléfono:</span>
                <span className="ml-2 text-gray-600">
                  {proveedorSeleccionadoInfo.telefono}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal para crear nuevo proveedor */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Crear Nuevo Proveedor
              </h3>
              <button
                onClick={handleCloseForm}
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

            <form onSubmit={handleCreateProveedor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProveedor.nombre}
                  onChange={(e) =>
                    setNewProveedor((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del proveedor"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RUC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProveedor.ruc}
                  onChange={(e) =>
                    setNewProveedor((prev) => ({
                      ...prev,
                      ruc: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12345678901"
                  maxLength={11}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newProveedor.direccion}
                  onChange={(e) =>
                    setNewProveedor((prev) => ({
                      ...prev,
                      direccion: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dirección del proveedor"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={newProveedor.telefono}
                  onChange={(e) =>
                    setNewProveedor((prev) => ({
                      ...prev,
                      telefono: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="999-888-777"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="estado"
                  checked={newProveedor.estado}
                  onChange={(e) =>
                    setNewProveedor((prev) => ({
                      ...prev,
                      estado: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="estado"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Proveedor activo
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  disabled={creatingProveedor}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingProveedor}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-green-400"
                >
                  {creatingProveedor ? "Creando..." : "Crear Proveedor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProveedorSelector;
