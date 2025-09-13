# Colección de Ejemplos para Testing de APIs

## Variables de Entorno

Configurar las siguientes variables en tu cliente REST (Postman, Thunder Client, Insomnia):

```json
{
  "gateway_url": "http://localhost:8080",
  "eureka_url": "http://localhost:8761",
  "proveedores_url": "http://localhost:8081",
  "productos_url": "http://localhost:8082",
  "ordenes_url": "http://localhost:8083",
  "detalles_url": "http://localhost:8084"
}
```

## 1. Verificación de Servicios

### Eureka Dashboard

```http
GET {{eureka_url}}
```

### Health Checks

```http
GET {{proveedores_url}}/actuator/health
GET {{productos_url}}/actuator/health
GET {{ordenes_url}}/actuator/health
GET {{detalles_url}}/actuator/health
```

## 2. CRUD Proveedores

### Crear Proveedor

```http
POST {{gateway_url}}/proveedores
Content-Type: application/json

{
  "nombre": "Tech Solutions S.A.",
  "email": "contacto@techsolutions.com",
  "telefono": "+34-91-123-4567",
  "direccion": "Av. Tecnología 123, Madrid, España"
}
```

### Listar Proveedores

```http
GET {{gateway_url}}/proveedores
```

### Obtener Proveedor por ID

```http
GET {{gateway_url}}/proveedores/1
```

### Actualizar Proveedor

```http
PUT {{gateway_url}}/proveedores/1
Content-Type: application/json

{
  "nombre": "Tech Solutions S.A. - Actualizado",
  "email": "nuevo@techsolutions.com",
  "telefono": "+34-91-999-8888",
  "direccion": "Av. Innovación 456, Madrid, España"
}
```

### Eliminar Proveedor

```http
DELETE {{gateway_url}}/proveedores/1
```

## 3. CRUD Productos

### Crear Producto

```http
POST {{gateway_url}}/productos
Content-Type: application/json

{
  "nombre": "MacBook Pro 16\"",
  "descripcion": "MacBook Pro de 16 pulgadas con chip M3 Pro",
  "precio": 2899.99,
  "stock": 15,
  "categoria": "Laptops"
}
```

### Crear Múltiples Productos

```http
POST {{gateway_url}}/productos
Content-Type: application/json

{
  "nombre": "iPhone 15 Pro",
  "descripcion": "iPhone 15 Pro de 256GB",
  "precio": 1199.99,
  "stock": 50,
  "categoria": "Smartphones"
}

POST {{gateway_url}}/productos
Content-Type: application/json

{
  "nombre": "Monitor 4K Dell",
  "descripcion": "Monitor Dell UltraSharp 27\" 4K",
  "precio": 549.99,
  "stock": 30,
  "categoria": "Monitores"
}
```

### Listar Productos

```http
GET {{gateway_url}}/productos
```

### Buscar Producto por ID

```http
GET {{gateway_url}}/productos/1
```

### Actualizar Producto

```http
PUT {{gateway_url}}/productos/1
Content-Type: application/json

{
  "nombre": "MacBook Pro 16\" (2024)",
  "descripcion": "MacBook Pro de 16 pulgadas con chip M3 Pro - Edición 2024",
  "precio": 2799.99,
  "stock": 20,
  "categoria": "Laptops Premium"
}
```

## 4. CRUD Órdenes de Compra

### Crear Orden

```http
POST {{gateway_url}}/ordenes
Content-Type: application/json

{
  "fechaOrden": "2025-08-28",
  "proveedorId": 1,
  "total": 5799.98,
  "estado": "PENDIENTE"
}
```

### Listar Órdenes

```http
GET {{gateway_url}}/ordenes
```

### Obtener Orden por ID

```http
GET {{gateway_url}}/ordenes/1
```

### Actualizar Estado de Orden

```http
PUT {{gateway_url}}/ordenes/1
Content-Type: application/json

{
  "fechaOrden": "2025-08-28",
  "proveedorId": 1,
  "total": 5799.98,
  "estado": "CONFIRMADA"
}
```

````

## 6. Flujo Completo de Prueba

### Paso 1: Crear Proveedor

```http
POST {{gateway_url}}/proveedores
Content-Type: application/json

{
  "nombre": "Apple Authorized Reseller",
  "email": "orders@applereseller.com",
  "telefono": "+34-93-555-0123",
  "direccion": "Passeig de Gràcia 100, Barcelona"
}
````

### Paso 2: Crear Productos

```http
POST {{gateway_url}}/productos
Content-Type: application/json

{
  "nombre": "iPad Air M2",
  "descripcion": "iPad Air de 11 pulgadas con chip M2",
  "precio": 699.99,
  "stock": 25,
  "categoria": "Tablets"
}
```

### Paso 3: Crear Orden

```http
POST {{gateway_url}}/ordenes
Content-Type: application/json

{
  "fechaOrden": "2025-08-28",
  "proveedorId": 1,
  "total": 1399.98,
  "estado": "PENDIENTE"
}
```

````

### Paso 5: Verificar Orden Completa

```http
GET {{gateway_url}}/ordenes/1
GET {{gateway_url}}/detalles?ordenId=1
````

## 7. Acceso Directo a Servicios (Bypass Gateway)

### Proveedores Directo

```http
GET {{proveedores_url}}/proveedores
POST {{proveedores_url}}/proveedores
```

### Productos Directo

```http
GET {{productos_url}}/productos
POST {{productos_url}}/productos
```

### Órdenes Directo

```http
GET {{ordenes_url}}/ordenes
POST {{ordenes_url}}/ordenes
```

## 8. Documentación Swagger

### URLs de Swagger UI

```http
GET {{proveedores_url}}/swagger-ui.html
GET {{productos_url}}/swagger-ui.html
GET {{ordenes_url}}/swagger-ui.html
GET {{detalles_url}}/swagger-ui.html
```

### OpenAPI JSON

```http
GET {{proveedores_url}}/v3/api-docs
GET {{productos_url}}/v3/api-docs
GET {{ordenes_url}}/v3/api-docs
GET {{detalles_url}}/v3/api-docs
```

## 9. Tests de Estrés y Rendimiento

### Crear Múltiples Proveedores

```bash
# Script para crear 10 proveedores
for i in {1..10}; do
  curl -X POST {{gateway_url}}/proveedores \
    -H "Content-Type: application/json" \
    -d "{\"nombre\":\"Proveedor $i\",\"email\":\"proveedor$i@test.com\",\"telefono\":\"+34-90-000-000$i\",\"direccion\":\"Dirección $i\"}"
done
```

### Prueba de Carga con Productos

```bash
# Script para crear 50 productos
for i in {1..50}; do
  curl -X POST {{gateway_url}}/productos \
    -H "Content-Type: application/json" \
    -d "{\"nombre\":\"Producto $i\",\"descripcion\":\"Descripción del producto $i\",\"precio\":$((RANDOM % 1000 + 100)).99,\"stock\":$((RANDOM % 100 + 1)),\"categoria\":\"Categoría $((i % 5 + 1))\"}"
done
```
