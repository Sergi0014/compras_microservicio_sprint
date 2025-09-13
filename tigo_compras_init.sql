-- =====================================================================
-- SCRIPT DE INICIALIZACIÓN COMPLETA: BASE DE DATOS TIGO_COMPRAS
-- =====================================================================
-- Este script crea la base de datos unificada y todas las tablas necesarias
-- para el sistema de microservicios de compras.

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS `tigo_compras` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `tigo_compras`;

-- =====================================================================
-- TABLA: PROVEEDORES
-- =====================================================================
CREATE TABLE IF NOT EXISTS `proveedores` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `ruc` VARCHAR(20) NOT NULL UNIQUE,
  `direccion` VARCHAR(500),
  `telefono` VARCHAR(20),
  `estado` BOOLEAN DEFAULT TRUE,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_proveedor_ruc` (`ruc`),
  INDEX `idx_proveedor_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: PRODUCTOS
-- =====================================================================
CREATE TABLE IF NOT EXISTS `productos` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  `precio_compra` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `proveedor_id` BIGINT NOT NULL,
  `estado` BOOLEAN DEFAULT TRUE,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`) ON DELETE RESTRICT,
  INDEX `idx_producto_proveedor` (`proveedor_id`),
  INDEX `idx_producto_estado` (`estado`),
  INDEX `idx_producto_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: ORDENES_COMPRA
-- =====================================================================
CREATE TABLE IF NOT EXISTS `ordenes_compra` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `proveedor_id` BIGINT NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `estado` BOOLEAN DEFAULT TRUE,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`) ON DELETE RESTRICT,
  INDEX `idx_orden_proveedor` (`proveedor_id`),
  INDEX `idx_orden_fecha` (`fecha_creacion`),
  INDEX `idx_orden_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABLA: DETALLE_ORDEN_COMPRA (INTEGRADA CON ÓRDENES)
-- =====================================================================
CREATE TABLE IF NOT EXISTS `detalle_orden_compra` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `orden_compra_id` BIGINT NOT NULL,
  `producto_id` BIGINT NOT NULL,
  `cantidad` INT NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  `precio_total` DECIMAL(10,2) NOT NULL,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`orden_compra_id`) REFERENCES `ordenes_compra` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE RESTRICT,
  INDEX `idx_detalle_orden` (`orden_compra_id`),
  INDEX `idx_detalle_producto` (`producto_id`),
  CHECK (`cantidad` > 0),
  CHECK (`precio_unitario` > 0),
  CHECK (`precio_total` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- DATOS INICIALES: PROVEEDORES
-- =====================================================================
INSERT INTO `proveedores` (`nombre`, `ruc`, `direccion`, `telefono`, `estado`) VALUES
('TechCorp S.A.', '12345678901', 'Av. Tecnología 123, Lima', '01-234-5678', TRUE),
('Digital Solutions SAC', '23456789012', 'Jr. Innovación 456, Lima', '01-345-6789', TRUE),
('Hardware Plus EIRL', '34567890123', 'Av. Computación 789, Lima', '01-456-7890', TRUE),
('Distribuidora TIGO', '45678901234', 'Av. Principal 1000, Lima', '01-567-8901', TRUE),
('Suministros Digitales', '56789012345', 'Calle Los Negocios 500, Lima', '01-678-9012', TRUE)
ON DUPLICATE KEY UPDATE 
    `nombre` = VALUES(`nombre`),
    `direccion` = VALUES(`direccion`),
    `telefono` = VALUES(`telefono`),
    `fecha_actualizacion` = CURRENT_TIMESTAMP;

-- =====================================================================
-- DATOS INICIALES: PRODUCTOS ORGANIZADOS POR PROVEEDOR
-- =====================================================================

-- Productos de TechCorp S.A. (ID: 1)
INSERT INTO `productos` (`nombre`, `precio_unitario`, `precio_compra`, `stock`, `proveedor_id`, `estado`) VALUES
('Laptop Dell Inspiron 15', 2500.00, 2000.00, 15, 1, TRUE),
('Monitor LG 24 pulgadas', 800.00, 600.00, 25, 1, TRUE),
('Teclado Mecánico Corsair', 350.00, 250.00, 40, 1, TRUE),
('Mouse Gaming Logitech', 180.00, 120.00, 50, 1, TRUE),
('WebCam Logitech HD', 150.00, 100.00, 30, 1, TRUE)
ON DUPLICATE KEY UPDATE 
    `precio_unitario` = VALUES(`precio_unitario`),
    `precio_compra` = VALUES(`precio_compra`),
    `stock` = VALUES(`stock`),
    `fecha_actualizacion` = CURRENT_TIMESTAMP;

-- Productos de Digital Solutions SAC (ID: 2)
INSERT INTO `productos` (`nombre`, `precio_unitario`, `precio_compra`, `stock`, `proveedor_id`, `estado`) VALUES
('Tablet Samsung Galaxy Tab', 1200.00, 900.00, 20, 2, TRUE),
('Smartphone iPhone 14', 4500.00, 3800.00, 12, 2, TRUE),
('Auriculares Sony WH-1000XM4', 1800.00, 1400.00, 18, 2, TRUE),
('Cargador Inalámbrico', 250.00, 180.00, 45, 2, TRUE),
('Power Bank 20000mAh', 180.00, 120.00, 35, 2, TRUE)
ON DUPLICATE KEY UPDATE 
    `precio_unitario` = VALUES(`precio_unitario`),
    `precio_compra` = VALUES(`precio_compra`),
    `stock` = VALUES(`stock`),
    `fecha_actualizacion` = CURRENT_TIMESTAMP;

-- Productos de Hardware Plus EIRL (ID: 3)
INSERT INTO `productos` (`nombre`, `precio_unitario`, `precio_compra`, `stock`, `proveedor_id`, `estado`) VALUES
('Disco Duro SSD 1TB', 450.00, 320.00, 28, 3, TRUE),
('Memoria RAM DDR4 16GB', 380.00, 280.00, 32, 3, TRUE),
('Tarjeta Gráfica RTX 3060', 2800.00, 2200.00, 8, 3, TRUE),
('Fuente de Poder 650W', 420.00, 300.00, 22, 3, TRUE),
('Procesador Intel i7', 1800.00, 1400.00, 15, 3, TRUE)
ON DUPLICATE KEY UPDATE 
    `precio_unitario` = VALUES(`precio_unitario`),
    `precio_compra` = VALUES(`precio_compra`),
    `stock` = VALUES(`stock`),
    `fecha_actualizacion` = CURRENT_TIMESTAMP;

-- Productos de Distribuidora TIGO (ID: 4)
INSERT INTO `productos` (`nombre`, `precio_unitario`, `precio_compra`, `stock`, `proveedor_id`, `estado`) VALUES
('Router Wi-Fi 6', 320.00, 240.00, 25, 4, TRUE),
('Switch 24 puertos', 850.00, 650.00, 12, 4, TRUE),
('Cable UTP Cat 6 (100m)', 180.00, 120.00, 40, 4, TRUE),
('Access Point', 280.00, 200.00, 20, 4, TRUE),
('Firewall Empresarial', 3500.00, 2800.00, 5, 4, TRUE)
ON DUPLICATE KEY UPDATE 
    `precio_unitario` = VALUES(`precio_unitario`),
    `precio_compra` = VALUES(`precio_compra`),
    `stock` = VALUES(`stock`),
    `fecha_actualizacion` = CURRENT_TIMESTAMP;

-- Productos de Suministros Digitales (ID: 5)
INSERT INTO `productos` (`nombre`, `precio_unitario`, `precio_compra`, `stock`, `proveedor_id`, `estado`) VALUES
('Impresora HP LaserJet', 1200.00, 900.00, 18, 5, TRUE),
('Scanner Epson', 650.00, 480.00, 15, 5, TRUE),
('Proyector Epson', 2200.00, 1700.00, 8, 5, TRUE),
('Tóner HP Negro', 120.00, 80.00, 60, 5, TRUE),
('Papel Bond A4 (500 hojas)', 25.00, 18.00, 100, 5, TRUE)
ON DUPLICATE KEY UPDATE 
    `precio_unitario` = VALUES(`precio_unitario`),
    `precio_compra` = VALUES(`precio_compra`),
    `stock` = VALUES(`stock`),
    `fecha_actualizacion` = CURRENT_TIMESTAMP;

-- =====================================================================
-- ÓRDENES DE EJEMPLO (OPCIONALES)
-- =====================================================================
INSERT INTO `ordenes_compra` (`proveedor_id`, `total`, `estado`) VALUES
(1, 3550.00, TRUE),  -- Orden para TechCorp
(2, 6950.00, TRUE),  -- Orden para Digital Solutions
(3, 3220.00, TRUE)   -- Orden para Hardware Plus
ON DUPLICATE KEY UPDATE 
    `total` = VALUES(`total`),
    `fecha_actualizacion` = CURRENT_TIMESTAMP;

-- =====================================================================
-- DETALLES DE ÓRDENES DE EJEMPLO (OPCIONALES)
-- =====================================================================
INSERT INTO `detalle_orden_compra` (`orden_compra_id`, `producto_id`, `cantidad`, `precio_unitario`, `precio_total`) VALUES
-- Detalles para orden 1 (TechCorp)
(1, 1, 1, 2500.00, 2500.00),  -- 1 Laptop Dell
(1, 3, 3, 350.00, 1050.00),   -- 3 Teclados Corsair

-- Detalles para orden 2 (Digital Solutions)
(2, 7, 1, 1200.00, 1200.00),  -- 1 Tablet Samsung
(3, 8, 1, 4500.00, 4500.00),  -- 1 iPhone 14
(2, 10, 5, 250.00, 1250.00),  -- 5 Cargadores Inalámbricos

-- Detalles para orden 3 (Hardware Plus)
(3, 12, 1, 450.00, 450.00),   -- 1 SSD 1TB
(3, 13, 2, 380.00, 760.00),   -- 2 Memoria RAM
(3, 15, 1, 420.00, 420.00),   -- 1 Fuente de Poder
(3, 16, 1, 1800.00, 1800.00)  -- 1 Procesador Intel
ON DUPLICATE KEY UPDATE 
    `cantidad` = VALUES(`cantidad`),
    `precio_unitario` = VALUES(`precio_unitario`),
    `precio_total` = VALUES(`precio_total`),
    `fecha_actualizacion` = CURRENT_TIMESTAMP;

-- =====================================================================
-- VERIFICACIÓN DE DATOS
-- =====================================================================
SELECT 'Base de datos TIGO_COMPRAS creada exitosamente' AS Status;
SELECT COUNT(*) as Total_Proveedores FROM proveedores;
SELECT COUNT(*) as Total_Productos FROM productos;
SELECT COUNT(*) as Total_Ordenes FROM ordenes_compra;
SELECT COUNT(*) as Total_Detalles FROM detalle_orden_compra;

-- =====================================================================
-- FIN DEL SCRIPT
-- =====================================================================