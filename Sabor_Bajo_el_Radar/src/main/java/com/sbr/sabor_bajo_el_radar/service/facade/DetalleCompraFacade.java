package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.repository.DetalleCompraRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.DetalleCompraFacadeLocal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DetalleCompraFacade implements DetalleCompraFacadeLocal {

    @Autowired
    private DetalleCompraRepository detalleCompraRepository;

    @Override
    public Map<String, Double> calcularIngresosPorCategoria() {
        List<Object[]> resultados = detalleCompraRepository.sumarIngresosPorCategoria();
        Map<String, Double> ingresos = new LinkedHashMap<>();

        for (Object[] fila : resultados) {
            String categoria = (String) fila[0];
            Double total = ((Number) fila[1]).doubleValue();
            ingresos.put(categoria, total);
        }

        return ingresos;
    }
}