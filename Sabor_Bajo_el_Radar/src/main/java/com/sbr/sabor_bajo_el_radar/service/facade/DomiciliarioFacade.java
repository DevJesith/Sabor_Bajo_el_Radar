package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.Domiciliario;
import com.sbr.sabor_bajo_el_radar.repository.DomiciliarioRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.DomiciliarioFacadeLocal;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class DomiciliarioFacade implements DomiciliarioFacadeLocal {

    @Autowired
    private DomiciliarioRepository domiciliarioRepository;

    @Override
    public Domiciliario create(Domiciliario domiciliario) {
        return domiciliarioRepository.save(domiciliario);
    }

    @Override
    public Domiciliario edit(Domiciliario domiciliario) {
        if (domiciliario.getId() == null || !domiciliarioRepository.existsById(domiciliario.getId())) {
            throw new IllegalArgumentException("El domiciliario no existe");
        }
        return domiciliarioRepository.save(domiciliario);
    }

    @Override
    public void remove(Integer id) {
        if (!domiciliarioRepository.existsById(id)) {
            throw new IllegalArgumentException("El domiciliario no existe");
        }
        domiciliarioRepository.deleteById(id);
    }

    @Override
    public Domiciliario find(Integer id) {
        return domiciliarioRepository.findById(id).orElse(null);
    }

    @Override
    public List<Domiciliario> findAll() {
        return domiciliarioRepository.findAll();
    }

    @Override
    public List<Domiciliario> findRange(int start, int end) {
        List<Domiciliario> domiciliarios = domiciliarioRepository.findAll();
        if (start < 0) start = 0;
        if (end > domiciliarios.size()) end = domiciliarios.size();
        return domiciliarios.subList(start, end);
    }

    @Override
    public long count() {
        return domiciliarioRepository.count();
    }
}
