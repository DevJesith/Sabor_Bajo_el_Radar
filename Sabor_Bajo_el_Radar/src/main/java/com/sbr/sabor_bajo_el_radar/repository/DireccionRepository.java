package com.sbr.sabor_bajo_el_radar.repository;

import com.sbr.sabor_bajo_el_radar.model.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DireccionRepository extends JpaRepository<Direccion, Integer> {
    
    @Query("SELECT d.localidad, COUNT(d) FROM Direccion d GROUP BY d.localidad")
    List<Object[]> contarUsuariosPorLocalidad();
}
