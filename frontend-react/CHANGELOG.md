# Frontend React - Microservicios de Compras

## 🔄 Actualizaciones Recientes

### Integración de Detalles en el Servicio de Órdenes

El frontend ha sido actualizado para funcionar con la nueva arquitectura donde los **detalles de orden** están integrados directamente en el **servicio de órdenes**, eliminando la necesidad de un microservicio separado para detalles.

## 📋 Cambios Realizados

### 1. **API Services (`src/services/api.ts`)**

#### ✅ Nuevos Endpoints de Detalles Integrados

```typescript
// ANTES: /detalles/orden/{ordenId}
// AHORA: /ordenes/{ordenId}/detalles

export const detallesApi = {
    // Obtener detalles de una orden
    getByOrdenId: (ordenId) => `/ordenes/${ordenId}/detalles`

    // Crear detalle en una orden
    create: (ordenId, detalle) => POST `/ordenes/${ordenId}/detalles`

    // Actualizar detalle específico
    update: (ordenId, detalleId, detalle) => PUT `/ordenes/${ordenId}/detalles/${detalleId}`

    // Eliminar detalle específico
    delete: (ordenId, detalleId) => DELETE `/ordenes/${ordenId}/detalles/${detalleId}`
}
```

#### ✅ Función `crearOrdenCompleta` Mejorada

- **Estrategia Primaria**: Usar endpoint `/ordenes/completa` si está disponible
- **Estrategia de Fallback**: Crear orden básica + agregar detalles individualmente
- **Validación de Stock**: Verificación previa antes de crear la orden
- **Manejo de Errores**: Logging detallado y recuperación automática

### 2. **Tipos TypeScript (`src/types/index.ts`)**

#### ✅ Tipos Actualizados

```typescript
export interface OrdenCompra {
  // ... campos existentes
  detalles?: DetalleOrdenCompra[]; // Detalles integrados opcionalmente
}

export interface DetalleOrdenCompra {
  // ... campos existentes
  ordenCompraId?: number; // Ahora opcional cuando se maneja dentro de la orden
}
```

### 3. **Componentes React**

#### ✅ Compatibilidad Mantenida

- **OrdenList.tsx**: Funciona sin cambios, usa las APIs actualizadas automáticamente
- **OrdenForm.tsx**: Compatible con la nueva estructura de APIs
- **Compras.tsx**: Sin cambios requeridos

## 🚀 Cómo Usar

### Instalación y Ejecución

```bash
# Instalar dependencias
cd frontend-react
npm install

# Ejecutar en desarrollo
npm start

# Construir para producción
npm run build
```

### Configuración de API

El frontend está configurado para conectarse al API Gateway en:

```typescript
const API_BASE_URL = "http://localhost:8085";
```

## 🔧 Funcionalidades

### ✅ Gestión de Órdenes Integrada

- **Crear órdenes** con detalles en una sola operación
- **Visualizar detalles** directamente desde la lista de órdenes
- **Editar y eliminar** detalles individualmente
- **Validación de stock** automática antes de crear órdenes

### ✅ Manejo de Errores Robusto

- **Estrategias de Fallback**: Si un endpoint no está disponible, usa métodos alternativos
- **Logging Detallado**: Información completa en consola para debugging
- **Recuperación Automática**: Reintenta operaciones automáticamente cuando es posible

### ✅ Interfaz de Usuario Mejorada

- **Feedback Visual**: Indicadores de carga y estados de error
- **Validaciones**: Verificación de datos antes de enviar al servidor
- **Experiencia Fluida**: Navegación sin interrupciones entre vistas

## 📊 Arquitectura de APIs

### Estructura de Endpoints Actualizada

```
API Gateway (http://localhost:8085)
├── /proveedores              # Gestión de proveedores
├── /productos                # Gestión de productos
└── /ordenes                  # Gestión de órdenes integrada
    ├── GET /                 # Listar todas las órdenes
    ├── POST /                # Crear nueva orden
    ├── GET /{id}             # Obtener orden específica
    ├── PUT /{id}             # Actualizar orden
    ├── DELETE /{id}          # Eliminar orden
    ├── POST /completa        # Crear orden con detalles (si disponible)
    └── /{ordenId}/detalles   # Gestión de detalles integrada
        ├── GET /             # Listar detalles de la orden
        ├── POST /            # Agregar detalle a la orden
        ├── PUT /{detalleId}  # Actualizar detalle específico
        └── DELETE /{detalleId} # Eliminar detalle específico
```

## 🐛 Debugging

### Logging en Consola

El frontend incluye logging detallado para facilitar el debugging:

- `🔍` Búsquedas y consultas
- `✅` Operaciones exitosas
- `❌` Errores y fallos
- `📤` Envío de datos
- `🔄` Procesos en curso

### Verificación de Conectividad

```typescript
import { checkApiConnection } from "./services/api";

// Verificar si el API Gateway está disponible
const connected = await checkApiConnection();
```

## 📝 Notas de Migración

### ✅ Compatibilidad Garantizada

- **Sin cambios en la UI**: La interfaz de usuario mantiene la misma funcionalidad
- **APIs Transparentes**: Los cambios en endpoints son transparentes para los componentes
- **Fallback Automático**: Si hay problemas, el sistema intenta métodos alternativos

### ✅ Beneficios de la Integración

- **Menos Complejidad**: Un microservicio menos que mantener
- **Mejor Performance**: Menos llamadas entre servicios
- **Consistencia de Datos**: Transacciones ACID entre órdenes y detalles
- **Mantenimiento Simplificado**: Menos puntos de falla

## 🔮 Próximos Pasos

1. **Probar Funcionalidad Completa**: Verificar crear, editar y eliminar órdenes
2. **Validar Performance**: Medir tiempos de respuesta con la nueva arquitectura
3. **Monitorear Logs**: Revisar logs de consola para detectar posibles issues
4. **Optimizar UX**: Mejorar feedback visual basado en uso real

---

**Nota**: Este frontend es compatible tanto con la arquitectura anterior (microservicio separado de detalles) como con la nueva arquitectura integrada, proporcionando una migración suave y sin interrupciones.
