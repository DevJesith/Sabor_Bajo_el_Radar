package com.sbr.sabor_bajo_el_radar.service.facade;
import com.sbr.sabor_bajo_el_radar.model.Publicacion;
import com.sbr.sabor_bajo_el_radar.model.MuroSocial;
import com.sbr.sabor_bajo_el_radar.repository.PublicacionRepository;
import com.sbr.sabor_bajo_el_radar.service.local.PublicacionFacadeLocal;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PublicacionFacade implements PublicacionFacadeLocal {

    private final PublicacionRepository publicacionRepository;

    public PublicacionFacade(PublicacionRepository publicacionRepository) {
        this.publicacionRepository = publicacionRepository;
    }

    @Override
    public Publicacion save(Publicacion publicacion) {
        return publicacionRepository.save(publicacion);
    }

    @Override
    public Optional<Publicacion> findById(Integer id) {
        return publicacionRepository.findById(id);
    }

    @Override
    public List<Publicacion> findAll() {
        return publicacionRepository.findAll();
    }

    @Override
    public void deleteById(Integer id) {
        publicacionRepository.deleteById(id);
    }

    @Override
    public List<Publicacion> findByMuro(MuroSocial muro) {
        return publicacionRepository.findByMuro(muro);
    }
}
