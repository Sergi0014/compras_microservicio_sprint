import React, { useState, useEffect } from "react";
import { Producto, Proveedor } from "../types";
import { productosApi, proveedoresApi, handleApiError } from "../services/api";

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    precioUnitario: 0,
    precioCompra: 0,
    stock: 0,
    proveedorId: 0,
    estado: true,
  });

  useEffect(() => {
    loadProductos();
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      const data = await proveedoresApi.getAll();
      setProveedores(data.filter((p) => p.estado)); // Solo proveedores activos
    } catch (err) {
      console.error("Error cargando proveedores:", err);
    }
  };

  const loadProductos = async () => {
    try {
      setLoading(true);
      const data = await productosApi.getAll();
      setProductos(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewProduct({
      nombre: "",
      precioUnitario: 0,
      precioCompra: 0,
      stock: 0,
      proveedorId: 0,
      estado: true,
    });
    setEditingProduct(null);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProduct.nombre.trim()) {
      setError("El nombre del producto es requerido");
      return;
    }

    if (newProduct.precioCompra <= 0) {
      setError("El precio de compra debe ser mayor a 0");
      return;
    }

    if (newProduct.precioUnitario <= 0) {
      setError("El precio unitario debe ser mayor a 0");
      return;
    }

    if (newProduct.stock < 0) {
      setError("El stock no puede ser negativo");
      return;
    }

    if (!newProduct.proveedorId || newProduct.proveedorId <= 0) {
      setError("Debe seleccionar un proveedor");
      return;
    }

    try {
      setCreatingProduct(true);
      setError(null);

      const productoCreado = await productosApi.create({
        nombre: newProduct.nombre.trim(),
        precioUnitario: newProduct.precioUnitario,
        precioCompra: newProduct.precioCompra,
        stock: newProduct.stock,
        proveedorId: newProduct.proveedorId,
        estado: newProduct.estado,
      });

      setProductos((prev) => [...prev, productoCreado]);
      resetForm();
      setShowCreateForm(false);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setCreatingProduct(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProduct) return;

    try {
      setCreatingProduct(true);
      setError(null);

      const productoActualizado = await productosApi.update(
        editingProduct.id!,
        {
          nombre: newProduct.nombre.trim(),
          precioUnitario: newProduct.precioUnitario,
          precioCompra: newProduct.precioCompra,
          stock: newProduct.stock,
          proveedorId: newProduct.proveedorId,
          estado: newProduct.estado,
        }
      );

      setProductos((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? productoActualizado : p))
      );

      resetForm();
      setEditingProduct(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setCreatingProduct(false);
    }
  };

  const startEdit = (producto: Producto) => {
    setEditingProduct(producto);
    setNewProduct({
      nombre: producto.nombre,
      precioUnitario: producto.precioUnitario,
      precioCompra: producto.precioCompra,
      stock: producto.stock,
      proveedorId: producto.proveedorId,
      estado: producto.estado || true,
    });
    setShowCreateForm(false);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este producto?")) {
      return;
    }

    try {
      await productosApi.delete(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingProduct(null);
    resetForm();
    setError(null);
  };

  // Filtrar productos por término de búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
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
            Gestion de Productos
          </h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Crear Producto
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button onClick={loadProductos} className="ml-2 text-sm underline">
              Reintentar
            </button>
          </div>
        )}

        {/* Barra de búsqueda */}

        {/* Tabla de productos */}
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
                  Precio Unitario
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Precio Compra
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Proveedor
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
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((producto) => (
                  <tr key={producto.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {producto.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {producto.nombre}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      ${producto.precioUnitario.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      ${producto.precioCompra.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {producto.stock}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {proveedores.find((p) => p.id === producto.proveedorId)
                        ?.nombre || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          producto.estado
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {producto.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(producto)}
                          className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(producto.id!)}
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
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm
                      ? "No se encontraron productos"
                      : "No hay productos registrados"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal para crear/editar producto */}
        {(showCreateForm || editingProduct) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}
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

              <form
                onSubmit={
                  editingProduct ? handleEditProduct : handleCreateProduct
                }
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProduct.nombre}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        nombre: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingrese el nombre del producto"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proveedor <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newProduct.proveedorId}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        proveedorId: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={0}>Seleccione un proveedor</option>
                    {proveedores.map((proveedor) => (
                      <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio Unitario <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.precioUnitario}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          precioUnitario: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio Compra <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newProduct.precioCompra}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          precioCompra: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        stock: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="estado"
                    checked={newProduct.estado}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
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
                    Producto activo
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
                    disabled={creatingProduct}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creatingProduct}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {creatingProduct
                      ? editingProduct
                        ? "Actualizando..."
                        : "Creando..."
                      : editingProduct
                      ? "Actualizar Producto"
                      : "Crear Producto"}
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

export default Productos;
