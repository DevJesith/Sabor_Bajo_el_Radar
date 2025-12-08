package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacturaRepository extends JpaRepository<Factura, Integer> {

    Optional<Factura> findByCompraIdCompraId(Integer compraId);
}