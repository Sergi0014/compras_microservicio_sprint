# Sistema de Microservicios TIGO COMPRAS

## Descripción

Sistema de microservicios desarrollado en Java con Spring Boot para la gestión completa de compras empresariales. La arquitectura incluye gestión de proveedores, productos y órdenes de compra, utilizando una base de datos unificada, service discovery con Eureka, API Gateway y documentación automática con OpenAPI.

## Arquitectura del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   API Gateway   │────│  Eureka Server   │────│  MySQL Database     │
│   (Port 8085)   │    │   (Port 8761)    │    │   (tigo_compras)    │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         │                                                 │
         Ordenes─ /proveedores/** → Proveedores Service ──────┤
         Ordenes─ /productos/**  → Productos Service ─────────┤
         └─── /ordenes/**    → Ordenes Service ───────────┘
              └─── /ordenes/{id}/detalles (Integrado)
```

## Servicios del Sistema

| Servicio                | Puerto | Descripción                            | Base de Datos  |
| ----------------------- | ------ | -------------------------------------- | -------------- |
| **Eureka Server**       | 8761   | Service Discovery                      | -              |
| **API Gateway**         | 8085   | Enrutamiento y Load Balancing          | -              |
| **Proveedores Service** | 8081   | CRUD de Proveedores                    | `tigo_compras` |
| **Productos Service**   | 8082   | CRUD de Productos                      | `tigo_compras` |
| **Ordenes Service**     | 8083   | CRUD de Órdenes + Detalles (Integrado) | `tigo_compras` |

## Stack Tecnológico

- **Java 17**
- **Spring Boot 3.2.6**
- **Spring Cloud 2023.0.3**
- **Spring Cloud Gateway**
- **Netflix Eureka**
- **Spring Data JPA**
- **MySQL 8** (por defecto)
- **H2 Database** (desarrollo)
- **OpenAPI/Swagger**
- **Maven**

## Estructura del Proyecto

```
microservico/
├── eureka-server/           # Servidor de descubrimiento de servicios
├── api-gateway/            # Gateway de entrada y enrutamiento
├── proveedores-service/    # Gestión de proveedores
├── productos-service/      # Gestión de productos
├── ordenes-service/        # Gestión de órdenes de compra
├── frontend-react/         # Interfaz de usuario en React
├── docker-compose.yml      # Configuración de contenedores
├── pom.xml                # Configuración Maven principal
├── tigo_compras_init.sql  # Script de inicialización de BD
└── README.md              # Documentación del proyecto
```

## Configuración del Entorno

### Prerrequisitos

- **Java 17+**
- **Maven 3.6+**
- **MySQL 8** (XAMPP recomendado) o **H2** para desarrollo
- **IntelliJ IDEA** o **Visual Studio Code**

### Base de Datos

#### Opción 1: MySQL (XAMPP) - Producción

1. Instalar XAMPP
2. Iniciar Apache y MySQL
3. Las bases de datos se crean automáticamente: `proveedores_db`, `productos_db`, `ordenes_db`, `detalles_db`

## Guía de Instalación y Ejecución con IntelliJ IDEA

### Paso 1: Importar el Proyecto

1. Abrir IntelliJ IDEA
2. Seleccionar "File" → "Open"
3. Navegar y seleccionar la carpeta "microservico"
4. Hacer clic en "OK"

IntelliJ detectará automáticamente que es un proyecto Maven multi-módulo y comenzará a indexar los archivos.

### Paso 2: Configuración Inicial

#### Verificar Configuración de Java

1. Ir a "File" → "Project Structure" → "Project"
2. Asegurarse de que "Project SDK" esté configurado con Java 17
3. Verificar que "Project language level" esté en "17"

#### Configuración de Maven

- IntelliJ descargará automáticamente las dependencias
- Esperar a que termine la indexación (barra de progreso en la parte inferior)
- Si hay problemas, usar "View" → "Tool Windows" → "Maven" y hacer clic en "Reload All Maven Projects"

### Paso 3: Ejecutar los Servicios

#### Opción A: Configuraciones de Ejecución (Recomendado)

Crear configuraciones de ejecución para cada servicio:

1. **Eureka Server**:

   - Ir a "Run" → "Edit Configurations"
   - Hacer clic en "+" → "Spring Boot"
   - Configurar:
     - Name: "Eureka Server"
     - Main class: `com.compras.eureka.EurekaServerApplication`
     - Module: eureka-server
     - VM options: `-Dserver.port=8761`

2. **API Gateway**:

   - Repetir proceso anterior con:
     - Name: "API Gateway"
     - Main class: `com.compras.gateway.ApiGatewayApplication`
     - Module: api-gateway
     - VM options: `-Dserver.port=8085`

3. **Servicios de Negocio**:

   - **Proveedores Service**:

     - Main class: `com.compras.proveedores.ProveedoresServiceApplication`
     - Module: proveedores-service
     - VM options: `-Dserver.port=8081`

   - **Productos Service**:

     - Main class: `com.compras.productos.ProductosServiceApplication`
     - Module: productos-service
     - VM options: `-Dserver.port=8082`

   - **Ordenes Service**:
     - Main class: `com.compras.ordenes.OrdenesServiceApplication`
     - Module: ordenes-service
     - VM options: `-Dserver.port=8083`

#### Opción B: Terminal Integrado

Usar el terminal integrado de IntelliJ (Alt+F12):

```bash
# Terminal 1: Eureka Server
./mvnw -DskipTests spring-boot:run -pl eureka-server

# Terminal 2: API Gateway
./mvnw -DskipTests spring-boot:run -pl api-gateway

# Terminal 3: Proveedores Service
./mvnw -DskipTests spring-boot:run -pl proveedores-service

# Terminal 4: Productos Service
./mvnw -DskipTests spring-boot:run -pl productos-service

# Terminal 5: Ordenes Service
./mvnw -DskipTests spring-boot:run -pl ordenes-service
```

### Paso 4: Orden de Arranque

Es importante seguir este orden para evitar errores:

1. **Eureka Server** (puerto 8761) - Esperar 30 segundos
2. **API Gateway** (puerto 8085) - Esperar 20 segundos
3. **Servicios de negocio** (puertos 8081, 8082, 8083) - Pueden iniciarse en paralelo

### Paso 5: Verificación

Una vez que todos los servicios estén ejecutándose:

1. Abrir navegador y verificar Eureka Dashboard: http://localhost:8761
2. Confirmar que todos los servicios aparecen registrados
3. Probar API Gateway: http://localhost:8085/proveedores

## Configuración Avanzada en IntelliJ

### Configuración de Base de Datos en Desarrollo

#### Para usar H2 Database (Base de datos en memoria)

1. En las configuraciones de ejecución, agregar en "VM options":
   ```
   -Dspring.profiles.active=h2
   ```
2. Los servicios usarán puertos alternativos: 18081, 18082, 18083
3. Acceder a la consola H2: http://localhost:1808X/h2-console

#### Para usar MySQL con XAMPP

1. Asegurar que XAMPP esté ejecutándose
2. MySQL debe correr en puerto 3306
3. Las bases de datos se crean automáticamente al iniciar los servicios

### Debugging en IntelliJ

1. **Configurar puntos de interrupción**: Click en el margen izquierdo del código
2. **Ejecutar en modo debug**: Click en el ícono de debug en lugar de run
3. **Variables y expresiones**: Usar la ventana "Variables" para inspeccionar el estado
4. **Evaluar expresiones**: Alt+F8 para evaluar expresiones durante el debug

## URLs de Acceso y Documentación

### Servicios Principales

| Servicio             | URL Base                          | Swagger UI                            |
| -------------------- | --------------------------------- | ------------------------------------- |
| **Eureka Dashboard** | http://localhost:8761             | -                                     |
| **API Gateway**      | http://localhost:8080             | -                                     |
| **Proveedores**      | http://localhost:8081/proveedores | http://localhost:8081/swagger-ui.html |
| **Productos**        | http://localhost:8082/productos   | http://localhost:8082/swagger-ui.html |
| **Ordenes**          | http://localhost:8083/ordenes     | http://localhost:8083/swagger-ui.html |
| **Detalles**         | http://localhost:8084/detalles    | http://localhost:8084/swagger-ui.html |

### Rutas del API Gateway

| Ruta                  | Destino             | Descripción                |
| --------------------- | ------------------- | -------------------------- |
| `GET /proveedores/**` | proveedores-service | Operaciones de proveedores |
| `GET /productos/**`   | productos-service   | Operaciones de productos   |
| `GET /ordenes/**`     | ordenes-service     | Operaciones de órdenes     |
| `GET /detalles/**`    | detalles-service    | Operaciones de detalles    |

## Ejemplos de Uso de la API

### 1. Gestión de Proveedores

#### Crear Proveedor

```bash
# Via Gateway
POST http://localhost:8080/proveedores
Content-Type: application/json

{
  "nombre": "Proveedor ABC",
  "email": "contacto@proveedorabc.com",
  "telefono": "+34-123-456-789",
  "direccion": "Calle Principal 123, Madrid"
}

# Directo al servicio
POST http://localhost:8081/proveedores
Content-Type: application/json

{
  "nombre": "Proveedor XYZ",
  "email": "info@proveedorxyz.com",
  "telefono": "+34-987-654-321",
  "direccion": "Avenida Secundaria 456, Barcelona"
}
```

#### Listar Proveedores

```bash
# Via Gateway
GET http://localhost:8080/proveedores

# Directo al servicio
GET http://localhost:8081/proveedores
```

#### Obtener Proveedor por ID

```bash
# Via Gateway
GET http://localhost:8080/proveedores/1

# Directo al servicio
GET http://localhost:8081/proveedores/1
```

#### Actualizar Proveedor

```bash
# Via Gateway
PUT http://localhost:8080/proveedores/1
Content-Type: application/json

{
  "nombre": "Proveedor ABC Actualizado",
  "email": "nuevo@proveedorabc.com",
  "telefono": "+34-111-222-333",
  "direccion": "Nueva Dirección 789, Madrid"
}
```

#### Eliminar Proveedor

```bash
# Via Gateway
DELETE http://localhost:8080/proveedores/1

# Directo al servicio
DELETE http://localhost:8081/proveedores/1
```

### 2. Gestión de Productos

#### Crear Producto

```bash
POST http://localhost:8080/productos
Content-Type: application/json

{
  "nombre": "Laptop HP",
  "descripcion": "Laptop HP Pavilion 15.6 pulgadas",
  "precio": 899.99,
  "stock": 25,
  "categoria": "Electrónicos"
}
```

#### Listar Productos

```bash
GET http://localhost:8080/productos
```

### 3. Gestión de Órdenes de Compra

#### Crear Orden

```bash
POST http://localhost:8080/ordenes
Content-Type: application/json

{
  "fechaOrden": "2025-08-28",
  "proveedorId": 1,
  "total": 1799.98,
  "estado": "PENDIENTE"
}
```

#### Obtener Órdenes por Estado

```bash
GET http://localhost:8080/ordenes?estado=PENDIENTE
```

### 4. Gestión de Detalles de Orden

#### Agregar Detalle a Orden

```bash
POST http://localhost:8080/detalles
Content-Type: application/json

{
  "ordenId": 1,
  "productoId": 1,
  "cantidad": 2,
  "precioUnitario": 899.99,
  "subtotal": 1799.98
}
```

## Ejecución con Docker (Alternativa)

### Construcción

```bash
# Construir todos los servicios
docker-compose build

# Construir servicio específico
docker-compose build proveedores-service
```

### Ejecución

```bash
# Iniciar toda la arquitectura
docker-compose up

# Iniciar en background
docker-compose up -d

# Iniciar servicios específicos
docker-compose up eureka-server api-gateway
```

### Escalado

```bash
# Escalar servicio específico
docker-compose up --scale proveedores-service=2

# Ver logs
docker-compose logs proveedores-service
```

## Testing y Pruebas

### Pruebas Unitarias

```bash
# Ejecutar todas las pruebas
./mvnw test

# Pruebas de un módulo específico
./mvnw test -pl proveedores-service

# Pruebas con coverage
./mvnw test jacoco:report
```

### Pruebas de Integración

```bash
# Con perfil H2 para pruebas rápidas
./mvnw test -Dspring.profiles.active=h2

# Pruebas end-to-end
./mvnw verify
```

### Pruebas con Postman/Insomnia

1. **Importar colección**: Usar los endpoints documentados en Swagger
2. **Configurar variables**:

   - `gateway_url`: `http://localhost:8080`
   - `proveedores_url`: `http://localhost:8081`
   - etc.

3. **Flujo de prueba completo**:
   ```
   1. POST /proveedores (crear proveedor)
   2. POST /productos (crear producto)
   3. POST /ordenes (crear orden con proveedor)
   4. POST /detalles (agregar productos a orden)
   5. GET /ordenes/{id} (verificar orden completa)
   ```

## Configuración de Perfiles de Desarrollo

### Perfil MySQL (por defecto)

```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/{db_name}
spring.datasource.username=root
spring.datasource.password=
```

### Perfil H2 (desarrollo)

```bash
# Activar perfil H2
java -jar target/app.jar --spring.profiles.active=h2

# O con Maven
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

**Puertos en modo H2:**

- Proveedores: 18081
- Productos: 18082
- Ordenes: 18083
- Detalles: 18084

**Consola H2:** http://localhost:1808{1-4}/h2-console

## Monitoreo y Logs

### Eureka Dashboard

- **URL**: http://localhost:8761
- **Información**: Servicios registrados, estado de salud, metadata

### Logs de Aplicación

```bash
# Ver logs en tiempo real
./mvnw spring-boot:run -pl proveedores-service | grep -i error

# Logs con nivel DEBUG
./mvnw spring-boot:run -pl proveedores-service -Dlogging.level.com.compras=DEBUG
```

### Health Check

```bash
# Verificar salud de servicios
GET http://localhost:8081/actuator/health
GET http://localhost:8082/actuator/health
GET http://localhost:8083/actuator/health
GET http://localhost:8084/actuator/health
```

## Solución de Problemas Comunes

### Problemas Comunes

#### Puerto ya en uso

```bash
# Verificar qué proceso usa el puerto
netstat -ano | findstr :8080

# Matar proceso (Windows)
taskkill /PID <PID> /F

# Cambiar puerto temporalmente
./mvnw spring-boot:run -Dserver.port=8090
```

#### Eureka no registra servicios

1. Verificar que Eureka esté corriendo en 8761
2. Comprobar configuración `eureka.client.service-url.defaultZone`
3. Revisar logs de servicios para errores de conexión

#### Error de conexión a base de datos

1. **MySQL**: Verificar que XAMPP esté corriendo
2. **H2**: Activar perfil con `--spring.profiles.active=h2`
3. Verificar credenciales en `application.properties`

#### Gateway devuelve 503/404

1. Verificar que servicios estén registrados en Eureka
2. Comprobar rutas en `application.properties` del gateway
3. Verificar que servicios respondan directamente

### Comandos de Diagnóstico

```bash
# Estado de puertos
netstat -ano | findstr ":80"

# Verificar servicios registrados
curl http://localhost:8761/eureka/apps

# Test de conectividad
curl -X GET http://localhost:8081/proveedores
curl -X GET http://localhost:8080/proveedores
```

## Referencias y Documentación

- **Spring Boot**: https://spring.io/projects/spring-boot
- **Spring Cloud**: https://spring.io/projects/spring-cloud
- **Netflix Eureka**: https://github.com/Netflix/eureka
- **Spring Cloud Gateway**: https://spring.io/projects/spring-cloud-gateway
- **OpenAPI/Swagger**: https://springdoc.org/

## Contribución

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## Soporte Técnico

Para resolver dudas o reportar problemas:

- Revisar la documentación en Swagger UI de cada servicio
- Consultar los logs detallados en la consola de IntelliJ
- Verificar el estado de los servicios en Eureka Dashboard

- `spring.jpa.hibernate.ddl-auto=update` para auto-crear tablas en desarrollo.

## Desarrollo sin Docker (XAMPP + Java)

Puede ejecutar cada módulo con:

```powershell
./mvnw -q -DskipTests spring-boot:run -pl eureka-server
./mvnw -q -DskipTests spring-boot:run -pl api-gateway
./mvnw -q -DskipTests spring-boot:run -pl proveedores-service
./mvnw -q -DskipTests spring-boot:run -pl productos-service
./mvnw -q -DskipTests spring-boot:run -pl ordenes-service
./mvnw -q -DskipTests spring-boot:run -pl detalles-service
```

Con XAMPP, asegure que MySQL corra en 3306. Si usa contraseña distinta a vacío o puerto distinto, ajuste `spring.datasource.*` en cada servicio.

Para usar H2 en memoria, por ejemplo en proveedores-service:

```powershell
./mvnw -q -DskipTests spring-boot:run -pl proveedores-service -Dspring-boot.run.arguments="--spring.profiles.active=h2"
```

## Licencia

Uso académico.
