import React from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  href,
  isActive,
  badge,
  onClick,
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`nav-link group ${isActive ? "active" : ""}`}
    >
      <span className="nav-icon">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && <span className="badge-primary">{badge}</span>}
    </a>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPath = "/",
}) => {
  const navigationItems = [
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 1v6h8V1"
          />
        </svg>
      ),
      label: "Dashboard",
      href: "/",
      isActive: currentPath === "/",
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      label: "Productos",
      href: "/productos",
      isActive: currentPath.startsWith("/productos"),
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      label: "Proveedores",
      href: "/proveedores",
      isActive: currentPath.startsWith("/proveedores"),
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      label: "Ordenes",
      href: "/ordenes",
      isActive: currentPath.startsWith("/ordenes"),
    },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div className="sidebar-overlay lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="p-6 border-b border-gray-200 dark:border-tigo-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg gradient-tigo flex items-center justify-center shadow-tigo">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Tigo
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Microservicios
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="btn-ghost btn-sm lg:hidden focus-ring"
                aria-label="Cerrar menú"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Navegación principal */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
            <div className="mb-6">
              <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Principal
              </h3>
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <NavItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    isActive={item.isActive}
                    onClick={() => {
                      // Cerrar sidebar en móvil al hacer clic
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
