package com.sbr.sabor_bajo_el_radar.service.facadeLocal;

import com.sbr.sabor_bajo_el_radar.model.Publicacion;
import com.sbr.sabor_bajo_el_radar.model.MuroSocial;

import java.util.List;
import java.util.Optional;

public interface PublicacionFacadeLocal {
    Publicacion save(Publicacion publicacion);
    Optional<Publicacion> findById(Integer id);
    List<Publicacion> findAll();
    void deleteById(Integer id);

    // Extra: obtener publicaciones de un muro específico
    List<Publicacion> findByMuro(MuroSocial muro);
}
