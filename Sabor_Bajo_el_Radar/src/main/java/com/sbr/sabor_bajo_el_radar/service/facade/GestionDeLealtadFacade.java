package com.sbr.sabor_bajo_el_radar.service.facade;
import com.sbr.sabor_bajo_el_radar.model.GestionDeLealtad;
import com.sbr.sabor_bajo_el_radar.repository.GestionDeLealtadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GestionDeLealtadFacade implements GestionDeLealtadFacadeLocal {

    @Autowired
    private GestionDeLealtadRepository gestionDeLealtadRepository;

    @Override
    public GestionDeLealtad create(GestionDeLealtad gestion) {
        return gestionDeLealtadRepository.save(gestion);
    }

    @Override
    public GestionDeLealtad update(GestionDeLealtad gestion) {
        return gestionDeLealtadRepository.save(gestion);
    }

    @Override
    public void delete(Integer id) {
        gestionDeLealtadRepository.deleteById(id);
    }

    @Override
    public Optional<GestionDeLealtad> find(Integer id) {
        return gestionDeLealtadRepository.findById(id);
    }

    @Override
    public List<GestionDeLealtad> findAll() {
        return gestionDeLealtadRepository.findAll();
    }
}
