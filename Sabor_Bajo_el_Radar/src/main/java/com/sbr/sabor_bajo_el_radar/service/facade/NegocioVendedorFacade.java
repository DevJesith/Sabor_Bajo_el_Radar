package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.NegocioVendedor;
import com.sbr.sabor_bajo_el_radar.repository.NegocioVendedorRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.NegocioVendedorFacadeLocal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NegocioVendedorFacade implements NegocioVendedorFacadeLocal {

    @Autowired
    private NegocioVendedorRepository negocioVendedorRepository;

    @Override
    public NegocioVendedor create(NegocioVendedor negocioVendedor) {
        return negocioVendedorRepository.save(negocioVendedor);
    }

    @Override
    public NegocioVendedor update(NegocioVendedor negocioVendedor) {
        return negocioVendedorRepository.save(negocioVendedor);
    }

    @Override
    public void delete(Integer id) {
        negocioVendedorRepository.deleteById(id);
    }

    @Override
    public Optional<NegocioVendedor> find(Integer id) {
        return negocioVendedorRepository.findById(id);
    }

    @Override
    public List<NegocioVendedor> findAll() {
        return negocioVendedorRepository.findAll();
    }
}
