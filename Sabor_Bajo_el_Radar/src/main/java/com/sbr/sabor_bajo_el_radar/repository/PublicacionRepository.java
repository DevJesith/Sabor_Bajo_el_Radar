package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Publicacion;
import com.sbr.sabor_bajo_el_radar.model.MuroSocial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicacionRepository extends JpaRepository<Publicacion, Integer> {
    // Buscar publicaciones por muro social
    List<Publicacion> findByMuro(MuroSocial muro);
}
