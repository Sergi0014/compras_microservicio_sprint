import React, { useState } from "react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="header">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo y menú móvil */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="btn-ghost btn-sm lg:hidden focus-ring"
              aria-label="Abrir menú"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo Tigo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl gradient-tigo flex items-center justify-center shadow-tigo">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gradient-tigo">
                  Tigo Compras
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sistema de Microservicios
                </p>
              </div>
            </div>
          </div>

          {/* Acciones del header */}
          <div className="flex items-center space-x-2">
            {/* Búsqueda móvil */}
            <button className="btn-ghost btn-sm md:hidden focus-ring">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
