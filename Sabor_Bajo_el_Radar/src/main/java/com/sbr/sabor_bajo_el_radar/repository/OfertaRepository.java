package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Oferta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, Integer> {
    // Aquí puedes añadir métodos personalizados, ejemplo:
    // List<Oferta> findByVendedorId(Integer vendedorId);
}
