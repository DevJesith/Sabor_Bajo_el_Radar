package com.sbr.sabor_bajo_el_radar.service.facade;

import com.sbr.sabor_bajo_el_radar.model.Oferta;
import com.sbr.sabor_bajo_el_radar.repository.OfertaRepository;
import com.sbr.sabor_bajo_el_radar.service.facadeLocal.OfertaFacadeLocal;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OfertaFacade implements OfertaFacadeLocal {

    private final OfertaRepository ofertaRepository;

    public OfertaFacade(OfertaRepository ofertaRepository) {
        this.ofertaRepository = ofertaRepository;
    }

    @Override
    public Oferta save(Oferta oferta) {
        return ofertaRepository.save(oferta);
    }

    @Override
    public Optional<Oferta> findById(Integer id) {
        return ofertaRepository.findById(id);
    }

    @Override
    public List<Oferta> findAll() {
        return ofertaRepository.findAll();
    }

    @Override
    public void deleteById(Integer id) {
        ofertaRepository.deleteById(id);
    }
}
