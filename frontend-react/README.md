# Sistema de Compras Tigo - Frontend

Sistema web para la gestión de compras, Ordenes, productos y proveedores con la identidad visual auténtica de Tigo.

## Características

- **Dashboard**: Vista general con estadísticas y Ordenes recientes
- **Gestión de Compras**: Crear y administrar Ordenes de compra
- **Productos**: Administrar catálogo de productos
- **Proveedores**: Gestionar información de proveedores
- **Diseño Tigo**: Identidad visual corporativa con colores auténticos

## Tecnologías

- React 18 con TypeScript
- Tailwind CSS para estilos con paleta personalizada Tigo
- React Router para navegación
- Axios para comunicación con API
- React Icons para iconos

## Paleta de Colores Tigo

- **Azul Corporativo**: `#003d82` (color principal)
- **Verde Lima**: `#84cc16` (color secundario)
- **Amarillo**: `#f59e0b` (color de acento)
- **Gradiente Principal**: Azul corporativo → Verde lima
- **Gradiente Alternativo**: Azul corporativo → Amarillo

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm start
```

## Compilación

```bash
npm run build
```

## Estructura de Componentes

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal
│   ├── Header.tsx      # Cabecera con branding Tigo
│   ├── Sidebar.tsx     # Navegación lateral
│   └── ...
├── pages/              # Páginas principales
│   ├── Dashboard.tsx   # Dashboard con estadísticas
│   ├── Compras.tsx     # Gestión de Ordenes
│   ├── Productos.tsx   # Catálogo de productos
│   └── Proveedores.tsx # Gestión de proveedores
├── services/           # Servicios API
└── types/              # Definiciones TypeScript
```
