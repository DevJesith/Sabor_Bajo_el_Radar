package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.Direccion;
import com.sbr.sabor_bajo_el_radar.repository.DireccionRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.DireccionFacadeLocal;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class DireccionFacade implements DireccionFacadeLocal {

    @Autowired
    private DireccionRepository direccionRepository;

    @Override
    public Direccion create(Direccion direccion) {
        return direccionRepository.save(direccion);
    }

    @Override
    public Direccion edit(Direccion direccion) {
        if (direccion.getId() == null || !direccionRepository.existsById(direccion.getId())) {
            throw new IllegalArgumentException("La dirección no existe");
        }
        return direccionRepository.save(direccion);
    }

    @Override
    public void remove(Integer id) {
        if (!direccionRepository.existsById(id)) {
            throw new IllegalArgumentException("La dirección no existe");
        }
        direccionRepository.deleteById(id);
    }

    @Override
    public Direccion find(Integer id) {
        return direccionRepository.findById(id).orElse(null);
    }

    @Override
    public List<Direccion> findAll() {
        return direccionRepository.findAll();
    }

    @Override
    public List<Direccion> findRange(int start, int end) {
        List<Direccion> direcciones = direccionRepository.findAll();
        if (start < 0) start = 0;
        if (end > direcciones.size()) end = direcciones.size();
        return direcciones.subList(start, end);
    }

    @Override
    public long count() {
        return direccionRepository.count();
    }
}
