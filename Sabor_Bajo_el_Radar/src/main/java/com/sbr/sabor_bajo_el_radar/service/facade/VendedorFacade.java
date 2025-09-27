package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.Vendedor;
import com.sbr.sabor_bajo_el_radar.repository.VendedorRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.VendedorFacadeLocal;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VendedorFacade implements VendedorFacadeLocal {

    private final VendedorRepository vendedorRepository;

    public VendedorFacade(VendedorRepository vendedorRepository) {
        this.vendedorRepository = vendedorRepository;
    }

    @Override
    public Vendedor create(Vendedor vendedor) {
        return vendedorRepository.save(vendedor);
    }

    @Override
    public Vendedor edit(Vendedor vendedor) {
        return vendedorRepository.save(vendedor);
    }

    @Override
    public void remove(Integer id) {
        vendedorRepository.deleteById(id);
    }

    @Override
    public Optional<Vendedor> find(Integer id) {
        return vendedorRepository.findById(id);
    }

    @Override
    public List<Vendedor> findAll() {
        return vendedorRepository.findAll();
    }

    @Override
    public long count() {
        return vendedorRepository.count();
    }
}
