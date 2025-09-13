import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPath = "/" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  //  modo oscuro
  useEffect(() => {
    document.documentElement.classList.add("dark");
    try {
      localStorage.setItem("theme", "dark");
    } catch {}
  }, []);

  // Cerrar sidebar en desktop cuando se redimensiona
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-tigo-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        currentPath={currentPath}
      />

      {/* Contenido principal */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Contenido de la página */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-white dark:bg-tigo-gray-800 border-t border-gray-200 dark:border-tigo-gray-700 py-8">
          <div className="container-responsive">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo y descripción */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-lg gradient-tigo flex items-center justify-center shadow-tigo">
                    <span className="text-white font-bold text-sm">T</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Tigo Compras
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                  Sistema de microservicios para la gestión integral de compras
                  y proveedores en tigo
                </p>
              </div>

              {/* Enlaces rápidos */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-4">
                  Enlaces Rápidos
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/productos"
                      className="text-gray-600 dark:text-gray-400 hover:text-tigo-blue-600 dark:hover:text-tigo-blue-400 transition-colors duration-200"
                    >
                      Productos
                    </a>
                  </li>
                  <li>
                    <a
                      href="/proveedores"
                      className="text-gray-600 dark:text-gray-400 hover:text-tigo-blue-600 dark:hover:text-tigo-blue-400 transition-colors duration-200"
                    >
                      Proveedores
                    </a>
                  </li>
                  <li>
                    <a
                      href="/ordenes"
                      className="text-gray-600 dark:text-gray-400 hover:text-tigo-blue-600 dark:hover:text-tigo-blue-400 transition-colors duration-200"
                    >
                      Ordenes
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-tigo-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    2025 Tig.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
