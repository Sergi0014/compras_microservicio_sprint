package com.compras.proveedores;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ProveedoresServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProveedoresServiceApplication.class, args);
    }
}
