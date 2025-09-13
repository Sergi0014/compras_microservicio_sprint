import React, { useState, useEffect } from "react";
import { Proveedor } from "../types";
import { proveedoresApi, handleApiError } from "../services/api";

const Proveedores: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(
    null
  );
  const [savingProveedor, setSavingProveedor] = useState(false);
  const [formData, setFormData] = useState({
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
      setProveedores(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      ruc: "",
      direccion: "",
      telefono: "",
      estado: true,
    });
    setEditingProveedor(null);
  };

  const validateForm = (): string | null => {
    if (!formData.nombre.trim()) {
      return "El nombre es requerido";
    }
    if (!formData.ruc.trim()) {
      return "El RUC es requerido";
    }
    if (formData.ruc.length !== 11) {
      return "El RUC debe tener 11 dígitos";
    }
    if (!formData.direccion.trim()) {
      return "La dirección es requerida";
    }
    if (!formData.telefono.trim()) {
      return "El teléfono es requerido";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSavingProveedor(true);
      setError(null);

      if (editingProveedor) {
        // Actualizar proveedor existente
        const proveedorActualizado = await proveedoresApi.update(
          editingProveedor.id!,
          {
            nombre: formData.nombre.trim(),
            ruc: formData.ruc.trim(),
            direccion: formData.direccion.trim(),
            telefono: formData.telefono.trim(),
            estado: formData.estado,
          }
        );

        setProveedores((prev) =>
          prev.map((p) =>
            p.id === editingProveedor.id ? proveedorActualizado : p
          )
        );
      } else {
        // Crear nuevo proveedor
        const nuevoProveedor = await proveedoresApi.create({
          nombre: formData.nombre.trim(),
          ruc: formData.ruc.trim(),
          direccion: formData.direccion.trim(),
          telefono: formData.telefono.trim(),
          estado: formData.estado,
        });

        setProveedores((prev) => [...prev, nuevoProveedor]);
      }

      resetForm();
      setShowCreateForm(false);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSavingProveedor(false);
    }
  };

  const startEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setFormData({
      nombre: proveedor.nombre,
      ruc: proveedor.ruc,
      direccion: proveedor.direccion,
      telefono: proveedor.telefono,
      estado: proveedor.estado || true,
    });
    setShowCreateForm(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este proveedor?")) {
      return;
    }

    try {
      await proveedoresApi.delete(id);
      setProveedores((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingProveedor(null);
    resetForm();
    setError(null);
  };

  // Filtrar proveedores por término de búsqueda
  const proveedoresFiltrados = proveedores.filter(
    (proveedor) =>
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.ruc.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando proveedores...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Proveedores
          </h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Crear Proveedor
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button
              onClick={loadProveedores}
              className="ml-2 text-sm underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o RUC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabla de proveedores */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  RUC
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Dirección
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Teléfono
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {proveedoresFiltrados.length > 0 ? (
                proveedoresFiltrados.map((proveedor) => (
                  <tr key={proveedor.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {proveedor.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {proveedor.nombre}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {proveedor.ruc}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {proveedor.direccion}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {proveedor.telefono}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          proveedor.estado
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {proveedor.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(proveedor)}
                          className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(proveedor.id!)}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "No se encontraron proveedores"
                      : "No hay proveedores registrados"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal para crear/editar proveedor */}
        {(showCreateForm || editingProveedor) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingProveedor
                    ? "Editar Proveedor"
                    : "Crear Nuevo Proveedor"}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData((prev) => ({
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
                    value={formData.ruc}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, ruc: e.target.value }))
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
                    value={formData.direccion}
                    onChange={(e) =>
                      setFormData((prev) => ({
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
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        telefono: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="999-888-777"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="estado"
                    checked={formData.estado}
                    onChange={(e) =>
                      setFormData((prev) => ({
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
                    disabled={savingProveedor}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingProveedor}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {savingProveedor
                      ? editingProveedor
                        ? "Actualizando..."
                        : "Creando..."
                      : editingProveedor
                      ? "Actualizar Proveedor"
                      : "Crear Proveedor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Proveedores;
