package com.compras.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Permitir origins específicos en los puertos 3000 y 3001
        corsConfig.addAllowedOriginPattern("http://localhost:3000");
        corsConfig.addAllowedOriginPattern("http://localhost:3001");
        corsConfig.addAllowedOriginPattern("http://127.0.0.1:3000");
        corsConfig.addAllowedOriginPattern("http://127.0.0.1:3001");
        
        // Permitir todos los métodos HTTP
        corsConfig.addAllowedMethod("GET");
        corsConfig.addAllowedMethod("POST");
        corsConfig.addAllowedMethod("PUT");
        corsConfig.addAllowedMethod("DELETE");

  
        
        // Permitir todos los headers
        corsConfig.addAllowedHeader("*");
        
        // Permitir credenciales
        corsConfig.setAllowCredentials(true);
        
        // Configurar el tiempo de vida del preflight cache
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
