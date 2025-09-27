package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.Compra;
import com.sbr.sabor_bajo_el_radar.repository.CompraRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.CompraFacadeLocal;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

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
}
