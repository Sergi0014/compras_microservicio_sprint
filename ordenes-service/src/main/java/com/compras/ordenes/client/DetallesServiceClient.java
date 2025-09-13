package com.compras.ordenes.client;

import com.compras.ordenes.dto.DetalleOrdenCompraDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Component
public class DetallesServiceClient {

    private final RestTemplate restTemplate;
    private final String detallesServiceUrl;

    public DetallesServiceClient(RestTemplate restTemplate, 
                                @Value("${services.detalles.url:http://localhost:8084}") String detallesServiceUrl) {
        this.restTemplate = restTemplate;
        this.detallesServiceUrl = detallesServiceUrl;
    }

    public DetalleOrdenCompraDto crearDetalle(Long ordenCompraId, Long productoId, Integer cantidad, BigDecimal precioUnitario) {
        DetalleOrdenCompraDto detalle = new DetalleOrdenCompraDto();
        detalle.setOrdenCompraId(ordenCompraId);
        detalle.setProductoId(productoId);
        detalle.setCantidad(cantidad);
        detalle.setPrecioUnitario(precioUnitario);
        detalle.setPrecioTotal(precioUnitario.multiply(BigDecimal.valueOf(cantidad)));

        return restTemplate.postForObject(
            detallesServiceUrl + "/detalles",
            detalle,
            DetalleOrdenCompraDto.class
        );
    }
}
