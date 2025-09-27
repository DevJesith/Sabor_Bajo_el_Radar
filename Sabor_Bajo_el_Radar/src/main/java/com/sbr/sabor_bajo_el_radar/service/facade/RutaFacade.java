package com.sbr.sabor_bajo_el_radar.service.facade;
import com.sbr.sabor_bajo_el_radar.model.Ruta;
import com.sbr.sabor_bajo_el_radar.repository.RutaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RutaFacade {

    private final RutaRepository rutaRepository;

    public RutaFacade(RutaRepository rutaRepository) {
        this.rutaRepository = rutaRepository;
    }

    public Ruta create(Ruta ruta) {
        return rutaRepository.save(ruta);
    }

    public Ruta edit(Ruta ruta) {
        return rutaRepository.save(ruta);
    }

    public void remove(Integer id) {
        rutaRepository.deleteById(id);
    }

    public Optional<Ruta> find(Integer id) {
        return rutaRepository.findById(id);
    }

    public List<Ruta> findAll() {
        return rutaRepository.findAll();
    }

    public long count() {
        return rutaRepository.count();
    }
}
