package com.sbr.sabor_bajo_el_radar.service.facade;
import com.sbr.sabor_bajo_el_radar.model.Factura;
import com.sbr.sabor_bajo_el_radar.repository.FacturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacturaFacade implements FacturaFacadeLocal {

    @Autowired
    private FacturaRepository facturaRepository;

    @Override
    public Factura create(Factura factura) {
        return facturaRepository.save(factura);
    }

    @Override
    public Factura update(Factura factura) {
        return facturaRepository.save(factura);
    }

    @Override
    public void delete(Integer id) {
        facturaRepository.deleteById(id);
    }

    @Override
    public Optional<Factura> find(Integer id) {
        return facturaRepository.findById(id);
    }

    @Override
    public List<Factura> findAll() {
        return facturaRepository.findAll();
    }
}
