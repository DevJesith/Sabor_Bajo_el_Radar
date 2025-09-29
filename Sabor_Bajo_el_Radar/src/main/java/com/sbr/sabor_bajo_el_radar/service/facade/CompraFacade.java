package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.Compra;
import com.sbr.sabor_bajo_el_radar.repository.CompraRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.CompraFacadeLocal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormatSymbols;
import java.util.*;

@Service
public class CompraFacade implements CompraFacadeLocal {

    @Autowired
    private CompraRepository compraRepository;

    @Override
    public Compra create(Compra compra) {
        return compraRepository.save(compra);
    }

    @Override
    public Compra edit(Compra compra) {
        if (compra.getId() == null || !compraRepository.existsById(compra.getId())) {
            throw new IllegalArgumentException("La compra no existe");
        }
        return compraRepository.save(compra);
    }

    @Override
    public void remove(Integer id) {
        if (!compraRepository.existsById(id)) {
            throw new IllegalArgumentException("La compra no existe");
        }
        compraRepository.deleteById(id);
    }

    @Override
    public Compra find(Integer id) {
        return compraRepository.findById(id).orElse(null);
    }

    @Override
    public List<Compra> findAll() {
        return compraRepository.findAll();
    }

    @Override
    public List<Compra> findRange(int start, int end) {
        List<Compra> compras = compraRepository.findAll();
        if (start < 0) start = 0;
        if (end > compras.size()) end = compras.size();
        return compras.subList(start, end);
    }

    @Override
    public long count() {
        return compraRepository.count();
    }


    @Override
    public Map<String, Double> obtenerVentasPorMes(int year) {
        List<Object[]> resultados = compraRepository.sumarVentasPorMes(year);
        Map<String, Double> ventas = new LinkedHashMap<>();

        for (Object[] fila : resultados) {
            int mes = (int) fila[0];
            double total = ((Number) fila[1]).doubleValue();
            String nombreMes = new DateFormatSymbols().getMonths()[mes - 1];
            ventas.put(nombreMes, total);
        }
        return ventas;
    }

    @Override
    public List<Map<String, Object>> obtenerEstadosPorPeriodo() {
        List<Object[]> resultados = compraRepository.contarEstadosPorPeriodo();

        List<Map<String, Object>> respuesta = new ArrayList<>();
        for (Object[] fila : resultados) {
            Map<String, Object> item = new HashMap<>();
            item.put("periodo", fila[0]);   // ej: "2025-03"
            item.put("estado", fila[1]);    // ej: "pendiente"
            item.put("cantidad", fila[2]);  // ej: 4
            respuesta.add(item);
        }
        return respuesta;

    }
}
