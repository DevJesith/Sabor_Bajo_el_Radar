package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.Inventario;
import com.sbr.sabor_bajo_el_radar.repository.InventarioRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.InventarioFacadeLocal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventarioFacade implements InventarioFacadeLocal {

    @Autowired
    private InventarioRepository inventarioRepository;

    @Override
    public Inventario create(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }

    @Override
    public Inventario update(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }

    @Override
    public void delete(Integer id) {
        inventarioRepository.deleteById(id);
    }

    @Override
    public Optional<Inventario> find(Integer id) {
        return inventarioRepository.findById(id);
    }

    @Override
    public List<Inventario> findAll() {
        return inventarioRepository.findAll();
    }
}
