package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.GestionDeLealtad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GestionDeLealtadRepository extends JpaRepository<GestionDeLealtad, Integer> {
}
