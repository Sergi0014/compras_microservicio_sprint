import React, { useState, useEffect, useCallback, useRef } from "react";
import { Producto, ProductoConCantidad } from "../types";
import { productosApi, handleApiError } from "../services/api";

interface ProductoSelectorProps {
  productosSeleccionados: ProductoConCantidad[];
  onProductosChange: (productos: ProductoConCantidad[]) => void;
  proveedorId?: number | null;
}

const ProductoSelector: React.FC<ProductoSelectorProps> = ({
  productosSeleccionados,
  onProductosChange,
  proveedorId,
}) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const loadProductos = useCallback(async () => {
    try {
      setLoading(true);

      if (!proveedorId) {
        setProductos([]);
        return;
      }

      const data = await productosApi.getByProveedor(proveedorId);
      setProductos(data.filter((p) => p.estado)); // Solo productos activos
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [proveedorId]);

  // Cargar productos al montar el componente o cuando cambie el proveedor
  useEffect(() => {
    loadProductos();
  }, [loadProductos]);

  // Usar useRef para evitar bucles infinitos en el useEffect
  const prevProveedorId = useRef<number | null>(null);

  // Limpiar productos seleccionados cuando cambie el proveedor
  useEffect(() => {
    if (
      prevProveedorId.current !== null &&
      prevProveedorId.current !== proveedorId
    ) {
      onProductosChange([]);
    }
    prevProveedorId.current = proveedorId || null;
  }, [proveedorId, onProductosChange]);

  // Filtrar productos por término de búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Productos disponibles (no seleccionados)
  const productosDisponibles = productosFiltrados.filter(
    (producto) => !productosSeleccionados.some((ps) => ps.id === producto.id)
  );

  const agregarProducto = (producto: Producto) => {
    const productoConCantidad: ProductoConCantidad = {
      ...producto,
      cantidadSeleccionada: 1,
      precioUnitarioOrden: producto.precioCompra, // Usar precio de compra por defecto
    };

    const nuevosProductos = [...productosSeleccionados, productoConCantidad];
    onProductosChange(nuevosProductos);
  };

  const eliminarProducto = (productoId: number) => {
    onProductosChange(
      productosSeleccionados.filter((p) => p.id !== productoId)
    );
  };

  const actualizarCantidad = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarProducto(productoId);
      return;
    }

    onProductosChange(
      productosSeleccionados.map((p) =>
        p.id === productoId
          ? {
              ...p,
              cantidadSeleccionada: cantidad,
              precioTotal: cantidad * p.precioUnitarioOrden,
            }
          : p
      )
    );
  };

  const actualizarPrecio = (productoId: number, precio: number) => {
    onProductosChange(
      productosSeleccionados.map((p) =>
        p.id === productoId
          ? {
              ...p,
              precioUnitarioOrden: precio,
              precioTotal: p.cantidadSeleccionada * precio,
            }
          : p
      )
    );
  };

  const calcularTotal = (): number => {
    return productosSeleccionados.reduce(
      (total, producto) =>
        total + producto.cantidadSeleccionada * producto.precioUnitarioOrden,
      0
    );
  };

  if (loading) {
    return (
      <div className="card animate-scale-in">
        <div className="card-body text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Cargando productos...
          </p>
        </div>
      </div>
    );
  }

  // Si no hay proveedor seleccionado, mostrar mensaje
  if (!proveedorId) {
    return (
      <div className="card animate-fade-in">
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-400"
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              2. Seleccionar Productos
            </h3>
          </div>
        </div>
        <div className="card-body">
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              Primero debe seleccionar un proveedor
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Los productos se cargarán según el proveedor seleccionado
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <div className="card-header">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-tigo-blue-100 dark:bg-tigo-blue-900 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-tigo-blue-600 dark:text-tigo-blue-400"
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Seleccionar Productos
            </h3>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`btn-outline btn-sm transition-all duration-200 ${
              showAddForm
                ? "bg-tigo-blue-600 text-white border-tigo-blue-600"
                : ""
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
                d={
                  showAddForm
                    ? "M6 18L18 6M6 6l12 12"
                    : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                }
              />
            </svg>
            {showAddForm ? "Cerrar" : "Buscar productos"}
          </button>
        </div>
      </div>

      <div className="card-body">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg animate-slide-in">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-3 flex-shrink-0"
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
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-300">{error}</p>
                <button
                  onClick={loadProductos}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline transition-colors duration-200"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formulario de búsqueda y selección */}
        {showAddForm && (
          <div className="mb-6 animate-slide-in">
            <div className="card bg-gray-50 dark:bg-tigo-gray-700/50 border-0">
              <div className="card-body">
                <div className="mb-4">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Buscar productos por nombre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 input-glow rounded-xl border-0 bg-white dark:bg-tigo-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-tigo-blue-500"
                    />
                  </div>
                </div>

                {productosDisponibles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto scrollbar-hide">
                    {productosDisponibles.map((producto, index) => (
                      <div
                        key={producto.id}
                        className="card-interactive p-4 animate-scale-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {producto.nombre}
                            </h4>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <svg
                                  className="w-4 h-4 text-tigo-lime-500"
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
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {producto.stock}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <svg
                                  className="w-4 h-4 text-tigo-blue-500"
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
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  $ {producto.precioCompra.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => agregarProducto(producto)}
                            className="btn-primary btn-sm ml-4 transform hover:scale-110 transition-all duration-200"
                          >
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Agregar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
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
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm
                        ? "No se encontraron productos que coincidan con tu búsqueda"
                        : "No hay productos disponibles"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lista de productos seleccionados */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              Productos Seleccionados
            </h4>
            <span className="badge-primary">
              {productosSeleccionados.length} productos
            </span>
          </div>

          {productosSeleccionados.length > 0 ? (
            <div className="space-y-4">
              {productosSeleccionados.map((producto, index) => (
                <div
                  key={producto.id}
                  className="card bg-gradient-to-r from-gray-50 to-gray-100 dark:from-tigo-gray-700 dark:to-tigo-gray-600 border-l-4 border-tigo-blue-500 animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card-body">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {producto.nombre}
                        </h5>
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
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
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          <span>Stock disponible: {producto.stock}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
                        <div className="flex flex-col">
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Cantidad
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              max={producto.stock}
                              value={producto.cantidadSeleccionada}
                              onChange={(e) =>
                                actualizarCantidad(
                                  producto.id!,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-20 px-3 py-2 border border-gray-300 dark:border-tigo-gray-600 rounded-lg text-center focus:ring-2 focus:ring-tigo-blue-500 focus:border-transparent bg-white dark:bg-tigo-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Precio Unit.
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                              $
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={producto.precioUnitarioOrden}
                              onChange={(e) =>
                                actualizarPrecio(
                                  producto.id!,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-28 pl-8 pr-3 py-2 border border-gray-300 dark:border-tigo-gray-600 rounded-lg text-center focus:ring-2 focus:ring-tigo-blue-500 focus:border-transparent bg-white dark:bg-tigo-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Subtotal
                          </label>
                          <p className="text-lg font-bold text-tigo-blue-600 dark:text-tigo-blue-400">
                            ${" "}
                            {(
                              producto.cantidadSeleccionada *
                              producto.precioUnitarioOrden
                            ).toFixed(2)}
                          </p>
                        </div>

                        <button
                          onClick={() => eliminarProducto(producto.id!)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
                          title="Eliminar producto"
                        >
                          <svg
                            className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
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
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="card bg-gradient-to-r from-tigo-blue-50 to-tigo-lime-50 dark:from-tigo-blue-900/20 dark:to-tigo-lime-900/20 border-2 border-tigo-blue-200 dark:border-tigo-blue-700">
                <div className="card-body">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg gradient-tigo flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
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
                      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Total de la Orden:
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-gradient-tigo animate-pulse">
                      $ {calcularTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-tigo-gray-600 rounded-xl">
              <svg
                className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No hay productos seleccionados
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Agregar productos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductoSelector;
