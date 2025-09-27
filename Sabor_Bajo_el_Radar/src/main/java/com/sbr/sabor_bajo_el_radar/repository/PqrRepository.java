package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Pqr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PqrRepository extends JpaRepository<Pqr, Integer> {
    // Aquí puedes añadir consultas personalizadas si necesitas
    // List<Pqr> findByUsuarioId(Integer usuarioId);
}
