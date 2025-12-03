package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Oferta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfertaRepository extends JpaRepository<Oferta, Long> {
    List<Oferta> findByProductoNegocioVendedorId(Long vendedorId);
}